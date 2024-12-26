'use strict';

const axios = require('axios');
const dot = require('dot-object');

let iob = {};

/**
 * Import global iob-Object from main.js
 *
 * @param objIob iob-object from main.js
 */
function setIob(objIob) {
    iob = objIob;
}

/**
 * Tests whether the given variable is a real object and not an Array
 *
 * @param it The variable to test
 * @returns true or false
 */
function isObject(it) {
    // This is necessary because:
    // typeof null === 'object'
    // typeof [] === 'object'
    // [] instanceof Object === true
    return Object.prototype.toString.call(it) === '[object Object]';
}

/**
 * Tests whether the given variable is really an Array
 *
 * @param it The variable to test
 * @returns true or false
 */
function isArray(it) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(it);
    }
    return Object.prototype.toString.call(it) === '[object Array]';
}

/**
 *
 * @param device    object of the device to request data
 * @param url       URL to GET data from
 * @returns extracted states from the response
 */
async function simpleObjectUrlGetter(device, url) {
    let states = {};
    let response = {};
    const res = `http://${device.dev_ip}:${device.dev_port}${url}`;
    if (iob.extLog) {
        iob.log.info(`URL = ${res}`);
    }
    try {
        response = await axios.default.get(res);
        if (iob.extLog) {
            iob.log.info(`body:${JSON.stringify(response.data)}`);
        }
        states = dot.dot(response.data);
        if (iob.extLog) {
            iob.log.info(`data:${JSON.stringify(states)}`);
        }
    } catch (error) {
        iob.log.error(`simpleObjectUrlGetter: ${error}`);
        states = {};
    }
    return states;
}

/**
 *
 * @param name          name of the device
 * @param datapoints    datapoints of the device
 */
async function initIobStates(name, datapoints) {
    if (iob.extLog) {
        iob.log.info(`initIobStates start: ${JSON.stringify(name)} = ${JSON.stringify(datapoints)}`);
    }
    for (const key in datapoints) {
        if (iob.extLog) {
            iob.log.info(`initIobStates key: ${JSON.stringify(key)}`);
        }
        if (Object.prototype.hasOwnProperty.call(datapoints, key)) {
            const path = `${name}.${datapoints[key].path}`;
            const iobObject = datapoints[key];
            if (iob.extLog) {
                iob.log.info(`initIobStates: ${JSON.stringify(path)} = ${JSON.stringify(iobObject)}`);
            }
            iob.setObject(path, {
                type: iobObject.type,
                common: iobObject.common,
                role: iobObject.role,
                read: iobObject.read,
                write: iobObject.write,
                native: {},
            });
        }
    }
}

/**
 *
 * @param device        device to set value
 * @param values        value to set
 */
async function setIobStates(device, values) {
    if (iob.extLog) {
        iob.log.info(`setIobStates device: ${JSON.stringify(device)}`);
    }
    if (iob.extLog) {
        iob.log.info(`setIobStates values: ${JSON.stringify(values)}`);
    }
    for (const key in values) {
        const search = `${device.api_type}#${key}`;
        if (iob.extLog) {
            iob.log.info(`setIobStates search: ${search}`);
        }
        if (Object.prototype.hasOwnProperty.call(iob.datapoints[device.dev_name], search)) {
            const deviceDatapoints = iob.datapoints[device.dev_name];
            const path = deviceDatapoints[search].path;
            if (iob.extLog) {
                iob.log.info(`setIobStates path: ${path}`);
            }
            const value = values[key];
            if (iob.extLog) {
                iob.log.info(
                    `setIobStates: ${JSON.stringify(`${device.dev_name}.${path}`)} = ${JSON.stringify(value)}`,
                );
            }
            if (path) {
                if (Object.prototype.hasOwnProperty.call(deviceDatapoints[search], 'factor')) {
                    iob.setState(`${device.dev_name}.${path}`, value * deviceDatapoints[search].factor, true);
                } else {
                    iob.setState(`${device.dev_name}.${path}`, value, true);
                }
            }
        } else {
            if (iob.extLog) {
                iob.log.warn(`setIobStates search: ${search} not found`);
            }
        }
    }
}

/**
 * get Data of Blebox
 *
 * @param device    device to get data from
 * @param type      type of request
 */
async function getBleboxData(device, type) {
    let values = {};
    if (iob.extLog) {
        iob.log.info(`getBleboxData : device : ${JSON.stringify(device)} type: ${type}`);
    }
    values = await iob.getSimpleObject(device, type, null);
    await this.setIobStates(device, values);
    return true;
}

/**
 * @param name      name of the device
 * @param apiType   type of API, not necessarily device_type!
 */
async function initCommon(name, apiType) {
    if (iob.extLog) {
        iob.log.info(`initCommon: name: ${name} type: ${apiType}`);
    }
    iob.datapoints[name] = iob.getDatapoints(apiType);
    if (iob.extLog) {
        iob.log.info(`initCommon: datapoints: ${JSON.stringify(iob.datapoints[name])}`);
    }
    await this.initIobStates(name, iob.datapoints[name]);
}

module.exports = {
    isArray,
    isObject,
    setIob,
    initCommon,
    getBleboxData,
    simpleObjectUrlGetter,
    initIobStates,
    setIobStates,
};
