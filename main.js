// @ts-nocheck
"use strict";

const utils = require("@iobroker/adapter-core");
const axios = require("axios");
const fs = require("fs");
const dot = require("dot-object");
const tools = require(__dirname + "/lib/tools");
const schedule = require("node-schedule");
const shutterbox = require("./lib/shutterbox");

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
        this.log.info("config type: " + this.config.type);
        this.log.info("config host: " + this.config.host);
        this.log.info("config port: " + this.config.port);

        this.subscribeStates("command.*");

        let result = await this.checkPasswordAsync("admin", "iobroker");
        this.log.info("check user admin pw ioboker: " + result);
        result = await this.checkGroupAsync("admin", "admin");
        this.log.info("check group user admin group admin: " + result);

        this.initCommon(this.config.type);
        switch (this.config.type) {
            case "shutterbox":
                this.getBleboxData("deviceUptime");
                this.getBleboxData("settingsState");
                this.getBleboxData("deviceState");
                this.getBleboxData("shutterState");
                break;

            default:
                break;
        }


        const iob = this;
        schedule.scheduleJob("*/10 * * * *", function () {
            iob.getBleboxUptime();
        });
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
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    async onStateChange(id, state) {
        if (state) {
            let response = {};
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            switch (id) {
                case this.namespace + ".command.move":
                    switch (state.val) {
                        case "d":
                            this.log.info("moving down");
                            response = await this.getSimpleObject("sendDown", null);
                            response["command.move"] = "";
                            await this.setIobStates(response);
                            this.getBleboxShutterState();
                            break;
                        case "u":
                            this.log.info("moving up");
                            response = await this.getSimpleObject("sendUp", null);
                            response["command.move"] = "";
                            await this.setIobStates(response);
                            this.getBleboxShutterState();
                            break;
                    }
                    break;
                case this.namespace + ".command.tilt":
                    if ((state.val != "") && (state.val >= 0) && (state.val <= 100)) {
                        this.log.info(`tilt: ${state.val}`);
                        response = await this.getSimpleObject("tilt", state.val);
                        response["command.tilt"] = "";
                        await this.setIobStates(response);
                        this.getBleboxShutterState();
                    }
                    break;
                case this.namespace + ".command.favorite":
                    if ((state.val >= 1) && (state.val <= 4)) {
                        this.log.info(`favorite: ${state.val}`);
                        response = await this.getSimpleObject("favorite", state.val);
                        response["command.favorite"] = "";
                        await this.setIobStates(response);
                        this.getBleboxShutterState();
                    }
                    break;
                case this.namespace + ".command.position":
                    if ((state.val != "") && (state.val >= 0) && (state.val <= 100)) {
                        this.log.info(`position: ${state.val}`);
                        response = await this.getSimpleObject("position", state.val);
                        response["command.position"] = "";
                        await this.setIobStates(response);
                        this.getBleboxShutterState();
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
    async getBleboxData(type) {
        let states = {};
        states = await this.getSimpleObject(type, null);
        await this.setIobStates(states);
        return true;
    }

    /**
     * 
     * @param {string} type apiPart to GET data from
     */
    async getSimpleObject(type, val) {
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
        this.log.info("getSimpleObject : " + type + " URL: " + locationUrl[type]);
        states = await this.simpleObjectUrlGetter(locationUrl[type]);
        return states;
    }

    /**
     * 
     * @param {string} path Path to json-File containing mock-data
     * 					
     * returns object of dotted styled keys with values e.g. device.ip = 192.168.1.2
     */
    async simpleObjectFileGetter(path) {
        let buf = new Buffer("");
        let resp = "";
        buf = fs.readFileSync(__dirname + path);
        resp = buf.toString("utf8");
        const state_response = JSON.parse(resp);
        let states = {};
        try {
            states = dot.dot(state_response);
        } catch (error) {
            this.log.error("simpleObjectFileGetter: " + error);
        }
        return states;
    }

    /**
     * 
     * @param {string} url URL to GET data from
     *
     * returns object of dotted styled keys with values e.g. device.ip = 192.168.1.2
     */
    async simpleObjectUrlGetter(url) {
        let states = {};
        let response = {};
        const iob = this;
        const res = "http://" + this.config.host + ":" + this.config.port + url;
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
    async initIobStates(states) {
        for (const key in states) {
            if (Object.prototype.hasOwnProperty.call(states, "key")) {
                const value = states[key];
                this.log.info("initIobStates: " + JSON.stringify(key) + " = " + JSON.stringify(value));
                this.setObject(key, {
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
    async setIobStates(states) {
        for (const key in states) {
            if (Object.prototype.hasOwnProperty.call(states, "key")) {
                const value = states[key];
                this.log.info("setIobStates: " + JSON.stringify(key) + " = " + JSON.stringify(value));
                this.setState(key, value);
            }
        }
    }

    async initCommon(typ) {
        datapoints = tools.getDatapoints(typ);
        await this.initIobStates(datapoints);
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