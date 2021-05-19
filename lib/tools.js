// @ts-nocheck
"use strict";

//const utils = require("@iobroker/adapter-core");
const axios = require("axios");
const dot = require("dot-object");

let iob = new Object;

function setIob(objIob) {
    iob = objIob;
}

/**
 * Tests whether the given variable is a real object and not an Array
 * @param {any} it The variable to test
 * @returns {it is Record<string, any>}
 */
function isObject(it) {
    // This is necessary because:
    // typeof null === 'object'
    // typeof [] === 'object'
    // [] instanceof Object === true
    return Object.prototype.toString.call(it) === "[object Object]";
}

/**
 * Tests whether the given variable is really an Array
 * @param {any} it The variable to test
 * @returns {it is any[]}
 */
function isArray(it) {
    if (typeof Array.isArray === "function") return Array.isArray(it);
    return Object.prototype.toString.call(it) === "[object Array]";
}

/**
     * 
     * @param {string} url URL to GET data from
     *
     * returns object of dotted styled keys with values e.g. device.ip = 192.168.1.2
     */
async function simpleObjectUrlGetter(device, url) {
    let states = {};
    let response = {};
    //const iob = this;
    const res = "http://" + device.ip + ":" + device.port + url;
    iob.log.info("URL = " + res);
    try {
        response = await axios.default.get(res);
        iob.log.info("body:" + JSON.stringify(response.data));
        //const state_response = JSON.parse(response.data);
        states = dot.dot(response.data);
        iob.log.info("data:" + JSON.stringify(states));
    } catch (error) {
        iob.log.error("simpleObjectUrlGetter: " + error);
    }
    return states;
}

/**
 * 
 * @param {object} states object of dotted styled keys with values e.g. device.ip = 192.168.1.2
 */
async function initIobStates(name, datapoints) {
    iob.log.info("initIobStates start: " + JSON.stringify(name) + " = " + JSON.stringify(datapoints));
    for (const key in datapoints) {
        iob.log.info("initIobStates key: " + JSON.stringify(key));
        if (Object.prototype.hasOwnProperty.call(datapoints, key)) {
            const path = name + "." + datapoints[key].path;
            const iobObject = datapoints[key];
            iob.log.info("initIobStates: " + JSON.stringify(path) + " = " + JSON.stringify(iobObject));
            iob.setObject(path, {
                type: iobObject.type,
                common: iobObject.common,
                native: {},
            });
        }
    }
}

/**
 * 
 * @param {object} states object of dotted styled keys with values e.g. device.ip = 192.168.1.2
 */
async function setIobStates(device, values) {
    iob.log.info("setIobStates device: " + JSON.stringify(device));
    iob.log.info("setIobStates values: " + JSON.stringify(values));
    for (const key in values) {
        const search = device.type + "#" + key;
        iob.log.info("setIobStates search: " + search);
        iob.log.info("setIobStates datapoints: " + JSON.stringify(iob.datapoints[device.name]));
        if (Object.prototype.hasOwnProperty.call(iob.datapoints[device.name], search)) {
            const deviceDatapoints = iob.datapoints[device.name];
            const path = deviceDatapoints[search].path;
            iob.log.info("setIobStates path: " + path);
            const value = values[key];
            iob.log.info("setIobStates: " + JSON.stringify(device.name + "." + path) + " = " + JSON.stringify(value));
            if (path) {
                if (Object.prototype.hasOwnProperty.call(deviceDatapoints[search], "factor")) {
                    iob.setState(device.name + "." + path, value * deviceDatapoints[search].factor);
                } else {
                    iob.setState(device.name + "." + path, value);
                }
            }
        }
    }
}

/**
* get Data of Blebox
*/
async function getBleboxData(device, type) {
    let values = {};
    iob.log.info("getBleboxData : device : " + JSON.stringify(device) + " type: " + type);
    values = await iob.getSimpleObject(device, type, null);
    await this.setIobStates(device, values);
    return true;
}

async function initCommon(name, type) {
    iob.log.info("initCommon: name: " + name + " type: " + type);
    iob.datapoints[name] = iob.getDatapoints(type);
    iob.log.info("initCommon: datapoints: " + JSON.stringify(iob.datapoints[name]));
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
    setIobStates
};
