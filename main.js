"use strict";

const utils = require("@iobroker/adapter-core");
const req = require("request");
const fs = require("fs");
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

		await this.initDatapoints();
		await this.getDeviceState();
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

	async initDatapoints() {
		let dp = null;
		let dp_value = null;
		for (dp in tools.datapoints) {
			dp_value = tools.datapoints[dp];
			this.log.info(dp + " = " + JSON.stringify(dp_value));
			await this.setObjectAsync(dp, {
				type: dp_value.type,
				common: {
					name: dp_value.name,
					type: dp_value.type,
					role: dp_value.role,
					read: dp_value.read,
					write: dp_value.write,
				},
				native: {},
			});

		}
	}
	async getDeviceState() {
		let buf = new Buffer("");
		let resp = "";
		if (mock) {
			buf = fs.readFileSync(__dirname + "/test/shutterbox/api_device_state.json");
			resp = buf.toString("UTF-8");
		} else {
			req("http://" + this.config.host + ":" + this.config.port + "/api/device/state", function (error, response, body) {
				console.log("error:", error);
				console.log("statusCode:", response && response.statusCode);
				console.log("body:", body);
				resp = body;
			});
		}
		this.log.info("Response: " + resp);
		const state_response = JSON.parse(resp);

		let dp = null;
		for (const attr in state_response.device) {
			if (state_response.device.hasOwnProperty(attr)) {
				dp = tools.getDatapoint("deviceState", attr);
				this.log.debug(dp + " = " + state_response.device[attr]);
				await this.setStateAsync(dp, state_response.device[attr]);
			}
		}
	}

	async getUptime() {
		let buf = new Buffer("");
		let resp = "";
		if (mock) {
			buf = fs.readFileSync(__dirname + "/test/shutterbox/api_device_uptime.json");
			resp = buf.toString("UTF-8");
		} else {
			req("http://" + this.config.host + ":" + this.config.port + "/api/device/uptime", function (error, response, body) {
				console.log("error:", error);
				console.log("statusCode:", response && response.statusCode);
				console.log("body:", body);
				resp = body;
			});
		}
		this.log.info("Response: " + resp);
		const response = JSON.parse(resp);

		let dp = null;
		for (const attr in response) {
			if (response.hasOwnProperty(attr)) {
				dp = tools.getDatapoint("deviceUptime", attr);
				this.log.debug(dp + " = " + response[attr]);
				await this.setStateAsync(dp, response[attr]);
			}
		}

	}

	async getSettings() {
		let buf = new Buffer("");
		let resp = "";
		if (mock) {
			buf = fs.readFileSync(__dirname + "/test/shutterbox/api_settings_state.json");
			resp = buf.toString("UTF-8");
		} else {
			req("http://" + this.config.host + ":" + this.config.port + "/api/settings/state", function (error, response, body) {
				console.log("error:", error);
				console.log("statusCode:", response && response.statusCode);
				console.log("body:", body);
				resp = body;
			});
		}
		this.log.info("Response: " + resp);
		const response = JSON.parse(resp);

		// TODO: Parse Object
		/*let dp = null;
		for (const attr in response) {
			if (response.hasOwnProperty(attr)) {
				dp = tools.getDatapoint("settingsState", attr);
				this.log.debug(dp + " = " + response[attr]);
				await this.setStateAsync(dp, response[attr]);
			}
		}*/

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