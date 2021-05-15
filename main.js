// @ts-nocheck
"use strict";

const utils = require("@iobroker/adapter-core");
const axios = require("axios");
const dot = require("dot-object");
const tools = require(__dirname + "/lib/tools");
const schedule = require("node-schedule");
const shutterbox = require("./lib/shutterbox");
const switchbox = require("./lib/switchbox");
const tempsensor = require("./lib/tempsensor");

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
        const iob = this;
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
                this.getBleboxData(device, "deviceUptime");
                switch (device.type) {
                    case "shutterbox":
                        shutterbox.init();
                        this.getBleboxData(device, "settingsState");
                        this.getBleboxData(device, "deviceState");
                        this.getBleboxData(device, "shutterState");
                        schedule.scheduleJob("*/10 * * * *", function () {
                            iob.getBleboxData(device, "deviceUptime");
                        });
                        this.subscribeStates(device.name + ".command.*");
                        break;
                    case "switchbox":
                        switchbox.init();
                        this.getBleboxData(device, "settingsState");
                        this.getBleboxData(device, "deviceState");
                        this.getBleboxData(device, "switchState");
                        this.getBleboxData(device, "switchExtendedState");
                        schedule.scheduleJob("*/10 * * * *", function () {
                            iob.getBleboxData(device, "deviceUptime");
                        });
                        this.subscribeStates(device.name + ".command.*");
                        break;
                    case "tempsensor":
                        tempsensor.init();
                        this.getBleboxData(device, "deviceState");
                        this.getBleboxData(device, "tempsensorExtendedState");
                        schedule.scheduleJob("*/10 * * * * *", function () {
                            iob.getBleboxData(device, "tempsensorExtendedState");
                            iob.getBleboxData(device, "deviceUptime");
                        });
                        break;
                    default:
                        break;
                }
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
        this.log.info("getDeviceByName # name : " + JSON.stringify(name));
        this.config.devices.forEach(device => {
            this.log.info("getDeviceByName # device : " + JSON.stringify(device));
            if (device.name == name) {
                this.log.info("getDeviceByName # return device : " + JSON.stringify(device));
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
            switch (device.type) {
                case "shutterbox":
                    switch (id) {
                        case this.namespace + "." + name + ".command.move":
                            switch (state.val) {
                                case "d":
                                    this.log.info("moving down");
                                    response = await this.getSimpleObject(device, "shutterSendDown", null);
                                    response["command.move"] = "";
                                    await this.setIobStates(response);
                                    this.getBleboxData(device, "shutterState");
                                    break;
                                case "u":
                                    this.log.info("moving up");
                                    response = await this.getSimpleObject(device, "shutterSendUp", null);
                                    response["command.move"] = "";
                                    await this.setIobStates(response);
                                    this.getBleboxData(device, "shutterState");
                                    break;
                                case "s":
                                    this.log.info("moving up");
                                    response = await this.getSimpleObject(device, "shutterSendStop", null);
                                    response["command.move"] = "";
                                    await this.setIobStates(response);
                                    this.getBleboxData(device, "shutterState");
                                    break;
                            }
                            break;
                        case this.namespace + "." + name + ".command.tilt":
                            if ((state.val != "") && (state.val >= 0) && (state.val <= 100)) {
                                this.log.info(`tilt: ${state.val}`);
                                response = await this.getSimpleObject(device, "shutterTilt", state.val);
                                response["command.tilt"] = "";
                                await this.setIobStates(response);
                                this.getBleboxData(device, "shutterState");
                            }
                            break;
                        case this.namespace + "." + name + ".command.favorite":
                            if ((state.val >= 1) && (state.val <= 4)) {
                                this.log.info(`favorite: ${state.val}`);
                                response = await this.getSimpleObject(device, "shutterFavorite", state.val);
                                response["command.favorite"] = "";
                                await this.setIobStates(response);
                                this.getBleboxData(device, "shutterState");
                            }
                            break;
                        case this.namespace + "." + name + ".command.position":
                            if ((state.val != "") && (state.val >= 0) && (state.val <= 100)) {
                                this.log.info(`position: ${state.val}`);
                                response = await this.getSimpleObject(device, "shutterPosition", state.val);
                                response["command.position"] = "";
                                await this.setIobStates(response);
                                this.getBleboxData(device, "shutterState");
                            }
                            break;
                        default:
                            this.log.error(`state ${id} not processed`);
                    }
                    break;
                case "switchbox":
                    switch (id) {
                        case this.namespace + "." + name + ".command.relay":
                            this.log.info("set relay to " + state.val);
                            response = await this.getSimpleObject(device, "switchSetRelay", state.val);
                            response["command.relay"] = "";
                            await this.setIobStates(response);
                            this.getBleboxData(device, "switchState");

                            break;
                        case this.namespace + "." + name + ".command.setRelayForTime":
                            this.log.info("set relayForTime to " + state.val);
                            response = await this.getSimpleObject(device, "switchSetRelayForTime", state.val);
                            response["command.setRelayForTime"] = "";
                            await this.setIobStates(response);
                            this.getBleboxData(device, "switchState");

                            break;

                        default:
                            break;
                    }
                    break;
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
        let values = {};
        this.log.info("getBleboxData : device : " + JSON.stringify(device) + " type: " + type);
        values = await this.getSimpleObject(device, type, null);
        await this.setIobStates(device, values);
        return true;
    }

    /**
     * 
     * @param {string} type apiPart to GET data from
     */
    async getSimpleObject(device, type, val) {
        let values = {};
        const locationUrl = new Array();
        // General
        locationUrl["deviceState"] = "/api/device/state";
        locationUrl["deviceUptime"] = "/api/device/uptime";
        locationUrl["settingsState"] = "/api/settings/state";
        locationUrl["shutterSendUp"] = "/s/u";
        locationUrl["shutterSendDown"] = "/s/d";
        locationUrl["shutterSendStop"] = "/s/s";
        locationUrl["shutterFavorite"] = "/s/f/" + val;
        locationUrl["shutterPosition"] = "/s/p/" + val;
        locationUrl["shutterTilt"] = "/s/t/" + val;
        locationUrl["shutterState"] = "/api/shutter/state";
        locationUrl["switchState"] = "/state";
        locationUrl["switchSetRelay"] = "/s/" + val;
        locationUrl["switchSetRelayForTime"] = "/s/1/forTime/" + val + "/ns/0";
        locationUrl["switchExtendedState"] = "/state/extended";
        locationUrl["tempsensorExtendedState"] = "/api/tempsensor/state";
        this.log.info("getSimpleObject : " + type + " URL: " + locationUrl[type] + " device: " + JSON.stringify(device));
        values = await this.simpleObjectUrlGetter(device, locationUrl[type]);
        return values;
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
        try {
            response = await axios.default.get(res);
            this.log.info("body:" + JSON.stringify(response.data));
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
    async initIobStates(name, datapoints) {
        this.log.info("initIobStates start: " + JSON.stringify(name) + " = " + JSON.stringify(datapoints));
        for (const key in datapoints) {
            this.log.info("initIobStates key: " + JSON.stringify(key));
            if (Object.prototype.hasOwnProperty.call(datapoints, key)) {
                const path = name + "." + datapoints[key].path;
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
    async setIobStates(device, values) {
        this.log.info("setIobStates device: " + JSON.stringify(device));
        this.log.info("setIobStates values: " + JSON.stringify(values));
        for (const key in values) {
            this.log.info("setIobStates key: " + key);
            this.log.info("setIobStates datapoints: " + JSON.stringify(datapoints[device.name]));
            if (Object.prototype.hasOwnProperty.call(datapoints[device.name], key)) {
                const deviceDatapoints = datapoints[device.name];
                const path = deviceDatapoints[key].path;
                this.log.info("setIobStates path: " + path);
                const value = values[key];
                this.log.info("setIobStates: " + JSON.stringify(device.name + "." + path) + " = " + JSON.stringify(value));
                if (path) {
                    this.setState(device.name + "." + path, value);
                }
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