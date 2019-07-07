"use strict";

const utils = require("@iobroker/adapter-core");
const axios = require("axios");
const fs = require("fs");
const dot = require("dot-object");
const tools = require(__dirname + "/lib/tools");
const mock = true;

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
		this.log.info("config host: " + this.config.host);
		this.log.info("config port: " + this.config.port);
		this.log.info("config user: " + this.config.user);
		this.log.info("config pass: " + "******");

		await this.getDeviceState();
		await this.getSettingsState();
		await this.getUptime();

		// in this template all states changes inside the adapters namespace are subscribed
		this.subscribeStates("*");

		/*
		setState examples
		you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw ioboker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
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
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
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
	 * get device state of Blebox
	 */
	async getDeviceState() {
		let states = {};
		states = await this.getSimpleObject("deviceState");
		await this.updateStates(states);
	}

	/**
	 * get uptime of Blebox
	 */
	async getUptime() {
		let states = {};
		states = await this.getSimpleObject("deviceUptime");
		await this.updateStates(states);
	}

	/**
	 * get settings of Blebox
	 */
	async getSettingsState() {
		let states = {};
		states = await this.getSimpleObject("settingsState");
		await this.updateStates(states);
	}

	/**
	 * 
	 * @param {string} type apiPart to GET data from
	 */
	async getSimpleObject(type) {
		let states = {};
		switch (type) {
			case "deviceState":
				if (mock) {
					states = await this.simpleObjectFileGetter("/test/shutterbox/api_device_state.json");
				} else {
					states = this.simpleObjectUrlGetter("/api/device/state");
				}
				return states;
			case "deviceUptime":
				if (mock) {
					states = await this.simpleObjectFileGetter("/test/shutterbox/api_device_uptime.json");
				} else {
					states = this.simpleObjectUrlGetter("/api/device/uptime");
				}
				return states;
			case "settingsState":
				if (mock) {
					states = await this.simpleObjectFileGetter("/test/shutterbox/api_settings_state.json");
				} else {
					states = this.simpleObjectUrlGetter("/api/settings/state");
				}
				return states;

			default:
				return {};
		}
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
		resp = buf.toString("UTF-8");
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
		const iob = this;
		await axios.default.get("http://" + this.config.host + ":" + this.config.port + url)
			.then(function (response) {
				console.log("body:", response.data);
				const state_response = JSON.parse(response.data);
				try {
					states = dot.dot(state_response);
				} catch (error) {
					iob.log.error("simpleObjectUrlGetter: " + error);
				}
				return states;
			})
			.then(function (error) {
				console.log("error:", error);
			});
	}

	/**
	 * 
	 * @param {object} states object of dotted styled keys with values e.g. device.ip = 192.168.1.2
	 */
	async updateStates(states) {
		for (const key in states) {
			if (states.hasOwnProperty(key)) {
				const value = states[key];
				this.log.info("updateStates: " + key + " = " + value);
				await this.setObjectAsync(key, {
					type: tools.datapoints[key].type,
					common: {
						name: tools.datapoints[key].name,
						type: tools.datapoints[key].type,
						role: tools.datapoints[key].role,
						read: tools.datapoints[key].read,
						write: tools.datapoints[key].write,
					},
					native: {},
				});
				await this.setStateAsync(key, value);
			}
		}
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