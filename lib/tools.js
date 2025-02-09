'use strict';

const axios = require('axios');
const dot = require('dot-object');
const gatebox = require('./gatebox');
const shutterbox = require('./shutterbox');
const switchbox = require('./switchbox');
const switchboxD = require('./switchboxD');
const tempsensor = require('./tempsensor');
const multisensor = require('./multisensor');
const saunabox = require('./saunabox');
const tvlift = require('./tvlift');

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
 * Finds a value in an object by a property name, case-insensitive.
 *
 * @param obj - The object to search in.
 * @param prop - The property name to search for.
 * @returns The value of the found property, or undefined if not found.
 */
function findVal(obj, prop) {
    for (let p in obj) {
        if (prop.toLowerCase() == p.toLowerCase()) {
            return obj[p];
        }
    }
    return null;
}

/**
 *
 * @param type Type of device to get Datapoints from
 * @returns array of datapoints
 */
function getDatapoints(type) {
    switch (type) {
        case 'gatebox':
            return gatebox.datapoints;
        case 'shutterbox':
            return shutterbox.datapoints;
        case 'tvlift':
            return tvlift.datapoints;
        case 'switchbox':
            return switchbox.datapoints;
        case 'switchboxD':
            return switchboxD.datapoints;
        case 'tempsensor':
            return tempsensor.datapoints;
        case 'multisensor':
            return multisensor.datapoints;
        case 'saunabox':
            return saunabox.datapoints;
        default:
            break;
    }
    return false;
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
        iob.log.info(`setIobStates device: ${device}`);
    }
    if (iob.extLog) {
        iob.log.info(`setIobStates values: ${values}`);
    }
    for (const key in values) {
        const search = `${device.api_type}#${key}`;
        if (iob.extLog) {
            iob.log.info(`setIobStates search: ${search}`);
        }
        const deviceDatapoints = iob.datapoints[device.dev_name];
        const datapoint = findVal(deviceDatapoints, search);
        if (datapoint != null) {
            const path = datapoint.path;
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
                if (Object.prototype.hasOwnProperty.call(datapoint, 'factor')) {
                    await iob.setState(`${device.dev_name}.${path}`, value * datapoint.factor, true);
                } else {
                    await iob.setState(`${device.dev_name}.${path}`, value, true);
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
        iob.log.info(`getBleboxData : device : ${device} type: ${type}`);
    }
    try {
        values = await iob.getSimpleObject(device, type, null);
        await this.setIobStates(device, values);
    } catch (error) {
        iob.log.error(`getBleboxData: ${error}`);
    }
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
    iob.datapoints[name] = getDatapoints(apiType);
    if (iob.extLog) {
        iob.log.info(`initCommon: datapoints: ${JSON.stringify(iob.datapoints[name])}`);
    }
    await this.initIobStates(name, iob.datapoints[name]);
}

module.exports = {
    isArray,
    isObject,
    findVal,
    setIob,
    initCommon,
    getBleboxData,
    getDatapoints,
    simpleObjectUrlGetter,
    initIobStates,
    setIobStates,
};
