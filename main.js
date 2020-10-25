// @ts-nocheck
"use strict";

const utils = require("@iobroker/adapter-core");
const axios = require("axios");
const dot = require("dot-object");
const tools = require(__dirname + "/lib/tools");
const schedule = require("node-schedule");
const shutterbox = require("./lib/shutterbox");

// eslint-disable-next-line prefer-const
let datapoints = {};

class Blebox extends utils.Adapter {

    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: "blebox",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        this.log.info("Full config: " + JSON.stringify(this.config));
        let result = await this.checkPasswordAsync("admin", "iobroker");
        this.log.info("check user admin pw ioboker: " + result);
        result = await this.checkGroupAsync("admin", "admin");
        this.log.info("check group user admin group admin: " + result);
        if (Object.prototype.hasOwnProperty.call(this.config, "devices")) {
            this.config.devices.forEach(device => {
                this.log.info("device name: " + device.name);
                this.log.info("device smart_name: " + device.smart_name);
                this.log.info("device type: " + device.type);
                this.log.info("device ip: " + device.ip);
                this.log.info("device port: " + device.port);
                this.initCommon(device.name, device.type);
                switch (device.type) {
                    case "shutterbox":
                        shutterbox.init();
                        this.getBleboxData(device, "deviceUptime");
                        this.getBleboxData(device, "settingsState");
                        this.getBleboxData(device, "deviceState");
                        this.getBleboxData(device, "shutterState");
                        break;

                    default:
                        break;
                }
                const iob = this;
                schedule.scheduleJob("*/10 * * * *", function () {
                    iob.getBleboxUptime();
                });
                this.subscribeStates(device.name + ".command.*");
            });
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            this.log.info("cleaned everything up...");
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed object changes
     * @param {string} id
     * @param {ioBroker.Object | null | undefined} obj
     */
    onObjectChange(id, obj) {
        if (obj) {
            // The object was changed
            this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        } else {
            // The object was deleted
            this.log.info(`object ${id} deleted`);
        }
    }

    /**
     * 
     * @param {string} name : Name of device as defined in Config
     */
    getDeviceByName(name) {
        let ret = {};
        this.log.info("getDeviceByName # name : " + JSON.stringify(name) );
        this.config.devices.forEach(device => {
            this.log.info("getDeviceByName # device : " + JSON.stringify(device) );
            if (device.name == name) {
                this.log.info("getDeviceByName # return device : " + JSON.stringify(device) );
                ret = device;
            }
        });
        return ret;
    }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    async onStateChange(id, state) {
        const name = id.split(".")[2];
        const device = this.getDeviceByName(name);
        const l_datapoint = datapoints[name];
        this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack}) name: ${name}`);
        this.log.info("datapoint : " + JSON.stringify(l_datapoint));
        this.log.info("device : " + JSON.stringify(device));
        if (state) {
            let response = {};
            // The state was changed
            switch (id) {
                case this.namespace + "." + name + ".command.move":
                    switch (state.val) {
                        case "d":
                            this.log.info("moving down");
                            response = await this.getSimpleObject(device, "sendDown", null);
                            response["command.move"] = "";
                            await this.setIobStates(response);
                            this.getBleboxData(device, "shutterState");
                            break;
                        case "u":
                            this.log.info("moving up");
                            response = await this.getSimpleObject(device, "sendUp", null);
                            response["command.move"] = "";
                            await this.setIobStates(response);
                            this.getBleboxData(device, "shutterState");
                            break;
                    }
                    break;
                case this.namespace + "." + name + ".command.tilt":
                    if ((state.val != "") && (state.val >= 0) && (state.val <= 100)) {
                        this.log.info(`tilt: ${state.val}`);
                        response = await this.getSimpleObject(device, "tilt", state.val);
                        response["command.tilt"] = "";
                        await this.setIobStates(response);
                        this.getBleboxData(device, "shutterState");
                    }
                    break;
                case this.namespace + "." + name + ".command.favorite":
                    if ((state.val >= 1) && (state.val <= 4)) {
                        this.log.info(`favorite: ${state.val}`);
                        response = await this.getSimpleObject(device, "favorite", state.val);
                        response["command.favorite"] = "";
                        await this.setIobStates(response);
                        this.getBleboxData(device, "shutterState");
                    }
                    break;
                case this.namespace + "." + name + ".command.position":
                    if ((state.val != "") && (state.val >= 0) && (state.val <= 100)) {
                        this.log.info(`position: ${state.val}`);
                        response = await this.getSimpleObject(device, "position", state.val);
                        response["command.position"] = "";
                        await this.setIobStates(response);
                        this.getBleboxData(device, "shutterState");
                    }
                    break;
                default:
                    this.log.error(`state ${id} not processed`);
            }
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.message" property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    // 	if (typeof obj === "object" && obj.message) {
    // 		if (obj.command === "send") {
    // 			// e.g. send email or pushover or whatever
    // 			this.log.info("send command");

    // 			// Send response in callback if required
    // 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    // 		}
    // 	} 
    // }


    /**
    * get Data of Blebox
    */
    async getBleboxData(device, type) {
        let states = {};
        this.log.info("getBleboxData : device : " + JSON.stringify(device) + " type: " + type);
        states = await this.getSimpleObject(device, type, null);
        await this.setIobStates(device, states);
        return true;
    }

    /**
     * 
     * @param {string} type apiPart to GET data from
     */
    async getSimpleObject(device, type, val) {
        let states = {};
        const locationUrl = new Array();
        locationUrl["deviceState"] = "/api/device/state";
        locationUrl["deviceUptime"] = "/api/device/uptime";
        locationUrl["settingsState"] = "/api/settings/state";
        locationUrl["sendUp"] = "/s/u";
        locationUrl["sendDown"] = "/s/d";
        locationUrl["favorite"] = "/s/f/" + val;
        locationUrl["position"] = "/s/p/" + val;
        locationUrl["tilt"] = "/s/t/" + val;
        locationUrl["shutterState"] = "/api/shutter/state";
        this.log.info("getSimpleObject : " + type + " URL: " + locationUrl[type] + " device: " + JSON.stringify(device));
        states = await this.simpleObjectUrlGetter(device, locationUrl[type]);
        return states;
    }

    /**
     * 
     * @param {string} url URL to GET data from
     *
     * returns object of dotted styled keys with values e.g. device.ip = 192.168.1.2
     */
    async simpleObjectUrlGetter(device, url) {
        let states = {};
        let response = {};
        const iob = this;
        const res = "http://" + device.ip + ":" + device.port + url;
        this.log.info("URL = " + res);
        response = await axios.default.get(res);
        this.log.info("body:" + JSON.stringify(response.data));
        //const state_response = JSON.parse(response.data);
        try {
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
    async initIobStates(name, datapoints) {
        this.log.info("initIobStates start: " + JSON.stringify(name) + " = " + JSON.stringify(datapoints));
        for (const key in datapoints) {
            this.log.info("initIobStates key: " + JSON.stringify(key));
            if (Object.prototype.hasOwnProperty.call(datapoints, key)) {
                const path = name + "." + key;
                const value = datapoints[key];
                this.log.info("initIobStates: " + JSON.stringify(path) + " = " + JSON.stringify(value));
                this.setObject(path, {
                    type: datapoints[key].type,
                    common: {
                        name: datapoints[key].common.name,
                        type: datapoints[key].common.type,
                        role: datapoints[key].common.role,
                        read: datapoints[key].common.read,
                        write: datapoints[key].common.write,
                    },
                    native: {},
                });
            }
        }
    }

    /**
     * 
     * @param {object} states object of dotted styled keys with values e.g. device.ip = 192.168.1.2
     */
    async setIobStates(device, datapoints) {
        this.log.info("setIobStates Start: " + JSON.stringify(device) + " = " + JSON.stringify(datapoints));
        for (const key in datapoints) {
            if (Object.prototype.hasOwnProperty.call(datapoints, key)) {
                const value = datapoints[key];
                this.log.info("setIobStates: " + JSON.stringify(device.name + "." + key) + " = " + JSON.stringify(value));
                this.setState(device.name + "." + key, value);
            }
        }
    }

    async initCommon(name, type) {
        this.log.info("initCommon: name: " + name + " type: " + type);
        datapoints[name] = tools.getDatapoints(type);
        this.log.info("initCommon: datapoints: " + JSON.stringify(datapoints[name]));
        await this.initIobStates(name, datapoints[name]);
    }
}


// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new Blebox(options);
} else {
    // otherwise start the instance directly
    new Blebox();
}