// @ts-nocheck
"use strict";

const utils = require("@iobroker/adapter-core");

const tools = require("./lib/tools");
const schedule = require("node-schedule");
const gatebox = require("./lib/gatebox");
const shutterbox = require("./lib/shutterbox");
const switchbox = require("./lib/switchbox");
const tempsensor = require("./lib/tempsensor");
const saunabox = require("./lib/saunabox");
const tvlift = require("./lib/tvlift");

class Blebox extends utils.Adapter {
    /**
       * @param {Partial<ioBroker.AdapterOptions>} [options={}]
       */

    constructor (options) {
        super({
            ...options,
            name: "blebox"
        });
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        tools.setIob(this);
        this.datapoints = {};
        this.extLog = {};
    }

    /**
       * Is called when databases are connected and adapter received configuration.
       */
    async onReady () {
        if (this.extLog) this.log.info("Full config: " + JSON.stringify(this.config));
        if (Object.prototype.hasOwnProperty.call(this.config, "devices")) {
            this.extLog = this.config.extLog;
            this.config.devices.forEach(device => {
                this.log.info("Extended logging: " + this.extLog);
                this.log.info("device name: " + device.dev_name);
                this.log.info("device smart_name: " + device.smart_name);
                this.log.info("device type: " + device.dev_type);
                this.log.info("device ip: " + device.dev_ip);
                this.log.info("device port: " + device.dev_port);
                tools.initCommon(device.dev_name, device.dev_type);
                tools.getBleboxData(device, "deviceUptime");
                switch (device.dev_type) {
                    case "shutterbox":
                        shutterbox.init();
                        tools.getBleboxData(device, "settingsState");
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "shutterExtendedState");
                        schedule.scheduleJob("*/10 * * * *", function () {
                            tools.getBleboxData(device, "deviceUptime");
                            tools.getBleboxData(device, "shutterExtendedState");
                        });
                        this.subscribeStates(device.dev_name + ".command.*");
                        break;
                    case "tvlift":
                        tvlift.init();
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "deviceNetwork");
                        tools.getBleboxData(device, "tvliftExtendedState");
                        schedule.scheduleJob("*/10 * * * *", function () {
                            tools.getBleboxData(device, "deviceUptime");
                        });
                        this.subscribeStates(device.name + ".command.*");
                        break;
                    case "gatebox":
                        gatebox.init();
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "settingsState");
                        tools.getBleboxData(device, "gateExtendedState");
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "deviceUptime");
                        schedule.scheduleJob("*/10 * * * *", function () {
                            tools.getBleboxData(device, "deviceUptime");
                            tools.getBleboxData(device, "deviceState");
                            tools.getBleboxData(device, "gateExtendedState");
                        });
                        this.subscribeStates(device.dev_name + ".command.*");
                        break;
                    case "switchbox":
                        switchbox.init();
                        tools.getBleboxData(device, "settingsState");
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "switchExtendedState");
                        schedule.scheduleJob("*/10 * * * *", function () {
                            tools.getBleboxData(device, "deviceUptime");
                            tools.getBleboxData(device, "switchExtendedState");
                        });
                        this.subscribeStates(device.dev_name + ".command.*");
                        break;
                    case "tempsensor":
                        tempsensor.init();
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "tempsensorExtendedState");
                        schedule.scheduleJob("*/10 * * * * *", function () {
                            tools.getBleboxData(device, "tempsensorExtendedState");
                            tools.getBleboxData(device, "deviceUptime");
                        });
                        break;
                    case "saunabox":
                        saunabox.init();
                        tools.getBleboxData(device, "deviceState");
                        tools.getBleboxData(device, "saunaboxExtendedState");
                        this.subscribeStates(device.dev_name + ".command.*");
                        schedule.scheduleJob("*/30 * * * * *", function () {
                            tools.getBleboxData(device, "saunaboxExtendedState");
                            tools.getBleboxData(device, "deviceUptime");
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
    onUnload (callback) {
        this.log.info("Shutting down...");
        try {
            schedule.gracefulShutdown();
            this.log.info("All Jobs shutted down...");
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
    onObjectChange (id, obj) {
        this.log.info("onObjectChange");
        if (obj) {
            // The object was changed
            if (this.extLog) this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        } else {
            // The object was deleted
            if (this.extLog) this.log.info(`object ${id} deleted`);
        }
    }

    /**
       *
       * @param {string} name : Name of device as defined in Config
       */
    getDeviceByName (name) {
        let ret = {};
        if (this.extLog) this.log.info("getDeviceByName # name : " + JSON.stringify(name));
        this.config.devices.forEach(device => {
            if (this.extLog) this.log.info("getDeviceByName # device : " + JSON.stringify(device));
            if (device.dev_name === name) {
                if (this.extLog) this.log.info("getDeviceByName # return device : " + JSON.stringify(device));
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
    async onStateChange (id, state) {
        this.log.info("onStateChange");
        const name = id.split(".")[2];
        const device = this.getDeviceByName(name);
        const lDatapoint = this.datapoints[device.dev_type + "#" + name];
        // if (this.extLog)
        this.log.info(`onStateChange state ${id} changed: ${state.val} (ack = ${state.ack}) name: ${name}`);
        if (this.extLog) this.log.info("onStateChange datapoint : " + JSON.stringify(lDatapoint));
        if (this.extLog) this.log.info("onStateChange device : " + JSON.stringify(device));
        if (state.ack === false) {
            let response = {};
            // The state was changed
            switch (device.dev_type) {
                case "shutterbox":
                    // eslint-disable-next-line no-case-declarations
                    let shutterboxRefreshJob = {};
                    switch (id) {
                        case this.namespace + "." + name + ".command.move":
                            switch (state.val) {
                                case "d":
                                    this.log.info("moving down");
                                    response = await this.getSimpleObject(device, "shutterSendDown", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "shutterExtendedState");
                                    shutterboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 20000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "shutterExtendedState");
                                    });
                                    break;
                                case "u":
                                    this.log.info("moving up");
                                    response = await this.getSimpleObject(device, "shutterSendUp", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "shutterExtendedState");
                                    shutterboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 45000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "shutterExtendedState");
                                    });
                                    break;
                                case "s":
                                    this.log.info("stop moving");
                                    response = await this.getSimpleObject(device, "shutterSendStop", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "shutterExtendedState");
                                    shutterboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 45000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "shutterExtendedState");
                                    });
                                    break;
                            }
                            break;
                        case this.namespace + "." + name + ".command.tilt":
                            if ((state.val !== "") && (state.val >= 0) && (state.val <= 100)) {
                                this.log.info(`tilt: ${state.val}`);
                                response = await this.getSimpleObject(device, "shutterTilt", state.val);
                                response["command.tilt"] = "";
                                await tools.setIobStates(response);
                                tools.getBleboxData(device, "shutterExtendedState");
                                shutterboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 20000), rule: "*/1 * * * * *" }, function () {
                                    tools.getBleboxData(device, "shutterExtendedState");
                                });
                            }
                            break;
                        case this.namespace + "." + name + ".command.favorite":
                            if ((state.val >= 1) && (state.val <= 4)) {
                                this.log.info(`favorite: ${state.val}`);
                                response = await this.getSimpleObject(device, "shutterFavorite", state.val);
                                response["command.favorite"] = "";
                                await tools.setIobStates(response);
                                tools.getBleboxData(device, "shutterExtendedState");
                                shutterboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 20000), rule: "*/1 * * * * *" }, function () {
                                    tools.getBleboxData(device, "shutterExtendedState");
                                });
                            }
                            break;
                        case this.namespace + "." + name + ".command.position":
                            if ((state.val !== "") && (state.val >= 0) && (state.val <= 100)) {
                                this.log.info(`position: ${state.val}`);
                                response = await this.getSimpleObject(device, "shutterPosition", state.val);
                                response["command.position"] = "";
                                await tools.setIobStates(response);
                                tools.getBleboxData(device, "shutterExtendedState");
                                // eslint-disable-next-line no-unused-vars
                                shutterboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 20000), rule: "*/1 * * * * *" }, function () {
                                    tools.getBleboxData(device, "shutterExtendedState");
                                });
                            }
                            break;
                        default:
                            this.log.error(`state ${id} not processed`);
                    }
                    break;
                case "tvlift":
                    // eslint-disable-next-line no-case-declarations, no-new-object
                    let tvliftRefreshJob = new Object();
                    switch (id) {
                        case this.namespace + "." + name + ".command.move":
                            switch (state.val) {
                                case "d":
                                    this.log.info("moving down");
                                    response = await this.getSimpleObject(device, "tvliftSendDown", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "tvliftExtendedState");
                                    tvliftRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 20000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "tvliftExtendedState");
                                    });
                                    break;
                                case "u":
                                    this.log.info("moving up");
                                    response = await this.getSimpleObject(device, "tvliftSendUp", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "tvliftExtendedState");
                                    // eslint-disable-next-line no-unused-vars
                                    tvliftRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 45000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "tvliftExtendedState");
                                    });
                                    break;
                            }
                            break;
                        default:
                            this.log.error(`state ${id} not processed`);
                    }
                    break;
                case "switchbox":
                    // eslint-disable-next-line no-case-declarations
                    let switchboxRefreshJob = {};
                    switch (id) {
                        case this.namespace + "." + name + ".command.relay":
                            this.log.info("set relay to " + state.val);
                            response = await this.getSimpleObject(device, "switchSetRelay", state.val);
                            response["command.relay"] = "";
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, "switchState");
                            break;
                        case this.namespace + "." + name + ".command.setRelayForTime":
                            this.log.info("set relayForTime to " + state.val);
                            response = await this.getSimpleObject(device, "switchSetRelayForTime", state.val);
                            response["command.setRelayForTime"] = "";
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, "switchState");
                            // eslint-disable-next-line no-unused-vars
                            switchboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 1000 * state.val + 1000), rule: "*/10 * * * * *" }, function () {
                                tools.getBleboxData(device, "switchState");
                            });
                            break;

                        default:
                            break;
                    }
                    break;
                case "gatebox":
                    // eslint-disable-next-line no-case-declarations
                    let gateboxRefreshJob = {};
                    switch (id) {
                        case this.namespace + "." + name + ".command.move":
                            switch (state.val) {
                                case "p":
                                    this.log.info("primary action");
                                    response = await this.getSimpleObject(device, "gatePrimary", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "gateExtendedState");
                                    gateboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 20000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "gateExtendedState");
                                    });
                                    break;
                                case "s":
                                    this.log.info("secondary action");
                                    response = await this.getSimpleObject(device, "gateSecondary", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "gateExtendedState");
                                    gateboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 45000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "gateExtendedState");
                                    });
                                    break;
                                case "o":
                                    this.log.info("open gate");
                                    response = await this.getSimpleObject(device, "gateOpen", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "gateExtendedState");
                                    gateboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 45000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "gateExtendedState");
                                    });
                                    break;
                                case "c":
                                    this.log.info("close gate");
                                    response = await this.getSimpleObject(device, "gateClose", null);
                                    response["command.move"] = "";
                                    await tools.setIobStates(response);
                                    tools.getBleboxData(device, "gateExtendedState");
                                    // eslint-disable-next-line no-unused-vars
                                    gateboxRefreshJob = schedule.scheduleJob({ start: new Date(Date.now() + 1000), end: new Date(Date.now() + 45000), rule: "*/1 * * * * *" }, function () {
                                        tools.getBleboxData(device, "gateExtendedState");
                                    });
                                    break;
                                default:
                                    break;
                            }
                    }
                    break;

                case "saunabox":
                    switch (id) {
                        case this.namespace + "." + name + ".command.state":
                            this.log.info("set heat to " + state.val);
                            response = await this.getSimpleObject(device, "saunaboxSetHeat", state.val);
                            response["command.state"] = "";
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, "saunaboxExtendedState");

                            break;
                        case this.namespace + "." + name + ".command.desiredTemp":
                            this.log.info("set relayForTime to " + state.val);
                            response = await this.getSimpleObject(device, "saunaboxSetdesiredTemp", state.val * 100);
                            response["command.desiredTemp"] = "";
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, "saunaboxExtendedState");

                            break;
                    }
            }
        }
    }

    /**
       *
       * @param {string} type apiPart to GET data from
       */
    async getSimpleObject (device, type, val) {
        let values = {};
        let locationUrl = "";
        // General
        switch (device.dev_type) {
            case "gatebox":
                locationUrl = gatebox.getApiUrl(type, val);
                break;
            case "saunabox":
                locationUrl = saunabox.getApiUrl(type, val);
                break;
            case "switchbox":
                locationUrl = switchbox.getApiUrl(type, val);
                break;
            case "shutterbox":
                locationUrl = shutterbox.getApiUrl(type, val);
                break;
            case "tvlift":
                locationUrl = tvlift.getApiUrl(type, val);
                break;
            case "tempsensor":
                locationUrl = tempsensor.getApiUrl(type, val);
                break;

            default:
                break;
        }

        if (this.extLog) this.log.info("getSimpleObject : " + type + " URL: " + locationUrl + " device: " + JSON.stringify(device));
        values = await tools.simpleObjectUrlGetter(device, locationUrl);
        return values;
    }

    /**
       *
       * @param {string} type Type of device to get Datapoints from
       * @returns
       */
    getDatapoints (type) {
        switch (type) {
            case "gatebox":
                return gatebox.datapoints;
            case "shutterbox":
                return shutterbox.datapoints;
            case "tvlift":
                return tvlift.datapoints;
            case "switchbox":
                return switchbox.datapoints;
            case "tempsensor":
                return tempsensor.datapoints;
            case "saunabox":
                return saunabox.datapoints;
            default:
                break;
        }
        return false;
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
    // eslint-disable-next-line no-new
    new Blebox();
}
