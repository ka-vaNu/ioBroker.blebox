'use strict';

const utils = require('@iobroker/adapter-core');

let apiMapping = {};

const tools = require('./lib/tools');
const schedule = require('node-schedule');
const airsensor = require('./lib/airsensor');
const gatebox = require('./lib/gatebox');
const shutterbox = require('./lib/shutterbox');
const switchbox = require('./lib/switchbox');
const switchboxD = require('./lib/switchboxD');
const tempsensor = require('./lib/tempsensor');
const multisensor = require('./lib/multisensor');
const saunabox = require('./lib/saunabox');
const tvlift = require('./lib/tvlift');

addSupportedAPI(gatebox.getDeviceTypeMapping());
addSupportedAPI(shutterbox.getDeviceTypeMapping());
addSupportedAPI(switchbox.getDeviceTypeMapping());
addSupportedAPI(switchboxD.getDeviceTypeMapping());
addSupportedAPI(airsensor.getDeviceTypeMapping());
addSupportedAPI(tempsensor.getDeviceTypeMapping());
addSupportedAPI(multisensor.getDeviceTypeMapping());
addSupportedAPI(saunabox.getDeviceTypeMapping());
addSupportedAPI(tvlift.getDeviceTypeMapping());

function addSupportedAPI(api) {
    apiMapping = Object.assign({}, apiMapping, api);
}

class Blebox extends utils.Adapter {
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */

    constructor(options) {
        super({
            ...options,
            name: 'blebox',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
        tools.setIob(this);
        this.datapoints = {};
        this.refreshTimer = {};
    }

    // Sentry aktivieren
    if(Sentry) {
        Sentry.init(this);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        try {
            this.log.debug(`Full config: ${JSON.stringify(this.config)}`);
            this.log.debug(`Full mapping: ${JSON.stringify(apiMapping)}`);
            if (Object.prototype.hasOwnProperty.call(this.config, 'devices')) {
                this.config.devices.forEach(device => {
                    this.log.info(`device name: ${device.dev_name}`);
                    this.log.info(`device smart_name: ${device.smart_name}`);
                    this.log.info(`device type: ${device.dev_type}`);
                    this.log.info(`device ip: ${device.dev_ip}`);
                    this.log.info(`device port: ${device.dev_port}`);
                    device.api_type = apiMapping[device.dev_type];
                    this.log.info(`device api: ${device.dev_type} => ${device.api_type}`);
                    tools.initCommon(device.dev_name, device.api_type);
                    tools.getBleboxData(device, 'deviceUptime');
                    this.refreshTimer[device.dev_name] = {};
                    switch (device.api_type) {
                        case 'shutterbox':
                            shutterbox.init();
                            tools.getBleboxData(device, 'settingsState');
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'shutterExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'shutterExtendedState')
                                        .then(data => this.log.debug('shutterExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei shutterExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            break;
                        case 'tvlift':
                            tvlift.init();
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'deviceNetwork');
                            tools.getBleboxData(device, 'tvliftExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                }, device.polling * 1000);
                            }
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            break;
                        case 'gatebox':
                            gatebox.init();
                            tools.getBleboxData(device, 'settingsState');
                            tools.getBleboxData(device, 'deviceState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'gateExtendedState')
                                        .then(data => this.log.debug('gateExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei gateExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            break;
                        case 'switchbox':
                            this.log.debug(`device api: ${device.dev_type} => ${device.api_type}`);
                            switchbox.init();
                            tools.getBleboxData(device, 'settingsState');
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'switchExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'switchExtendedState')
                                        .then(data => this.log.debug('switchExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei switchExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            this.log.debug(`subscribeStates: ${device.dev_name}.command.*`);
                            break;
                        case 'switchboxD':
                            switchboxD.init();
                            tools.getBleboxData(device, 'settingsState');
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'switchExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', JSON.stringify(data)))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'switchExtendedState')
                                        .then(data => this.log.debug('switchExtendedState:', JSON.stringify(data)))
                                        .catch(err =>
                                            this.log.error('Fehler bei switchExtendedState:', JSON.stringify(err)),
                                        );
                                }, device.polling * 1000);
                            }
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            this.log.debug(`subscribeStates: ${device.dev_name}.command.*`);
                            break;
                        case 'airsensor':
                            airsensor.init();
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'airsensorExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'airsensorExtendedState')
                                        .then(data => this.log.info('airsensorExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei airsensorExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            this.log.debug(`subscribeStates: ${device.dev_name}.command.*`);
                            break;
                        case 'tempsensor':
                            tempsensor.init();
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'tempsensorExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'tempsensorExtendedState')
                                        .then(data => this.log.debug('tempsensorExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei tempsensorExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            break;
                        case 'multisensor':
                            multisensor.init();
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'multisensorExtendedState');
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'multisensorExtendedState')
                                        .then(data => this.log.debug('multisensorExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei multisensorExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            break;
                        case 'saunabox':
                            saunabox.init();
                            tools.getBleboxData(device, 'deviceState');
                            tools.getBleboxData(device, 'saunaboxExtendedState');
                            this.subscribeStates(`${device.dev_name}.command.*`);
                            if (device.polling > 0) {
                                this.refreshTimer[device.dev_name].intervall = setInterval(() => {
                                    tools
                                        .getBleboxData(device, 'deviceUptime')
                                        .then(data => this.log.debug('deviceUptime:', data))
                                        .catch(err => this.log.error('Fehler bei deviceUptime:', err));
                                    tools
                                        .getBleboxData(device, 'saunaboxExtendedState')
                                        .then(data => this.log.debug('saunaboxExtendedState:', data))
                                        .catch(err => this.log.error('Fehler bei saunaboxExtendedState:', err));
                                }, device.polling * 1000);
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        } catch (error) {
            if (utils.supportsFeature && utils.supportsFeature('PLUGINS')) {
                const sentryInstance = utils.getPluginInstance('sentry');
                if (sentryInstance) {
                    sentryInstance.getSentryObject().captureException(error);
                }
            }
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback  function to callback
     */
    onUnload(callback) {
        this.log.info('Shutting down...');
        for (const device of this.config.devices) {
            if (device.polling > 0) {
                clearInterval(this.refreshTimer[device.dev_name].intervall);
            }
        }
        try {
            schedule.gracefulShutdown();
            this.log.info('All Jobs shutted down...');
            callback();
        } catch (e) {
            this.log.error(`onUnload: ${JSON.stringify(e)}`);
            callback();
        }
    }

    /**
     * Is called if a subscribed object changes
     *
     * @param id        id of the change object
     * @param obj       the object itself
     */
    onObjectChange(id, obj) {
        this.log.info('onObjectChange');
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
     * @param name : Name of device as defined in Config
     */
    getDeviceByName(name) {
        let ret = {};
        this.log.debug(`getDeviceByName # name : ${name}`);
        this.config.devices.forEach(device => {
            this.log.debug(`getDeviceByName # device : ${device.dev_name}`);
            if (device.dev_name === name) {
                this.log.debug(`getDeviceByName # return device : ${device}`);
                ret = {
                    name: device.name,
                    api_type: device.api_type,
                    dev_type: device.dev_type,
                    polling: device.polling,
                    smart_name: device.smart_name,
                    dev_ip: device.dev_ip,
                    dev_port: device.dev_port,
                };
            }
        });
        return ret;
    }

    /**
     * Is called if a subscribed state changes
     *
     * @param id        id of the subscribed object
     * @param state     the current state
     */
    async onStateChange(id, state) {
        const name = id.split('.')[2];
        const device = this.getDeviceByName(name);
        this.log.debug(`onStateChange: ${JSON.stringify(device)}`);
        const lDatapoint = this.datapoints[device.dev_type];
        this.log.info(
            `onStateChange state ${id} changed: ${state.val} (ack = ${state.ack}) name: ${name} api_type: ${device.api_type}`,
        );
        this.log.debug(`onStateChange datapoint : ${JSON.stringify(lDatapoint)}`);
        this.log.debug(`onStateChange device : ${device}`);
        if (state.ack === false) {
            let response = {};
            // The state was changed
            switch (device.api_type) {
                case 'shutterbox':
                    // eslint-disable-next-line no-case-declarations
                    let shutterboxRefreshJob = {};
                    switch (id) {
                        case `${this.namespace}.${name}.command.move`:
                            switch (state.val) {
                                case 'd':
                                    this.log.info('moving down');
                                    response = await this.getSimpleObject(device, 'shutterSendDown', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'shutterExtendedState');
                                    shutterboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 20000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'shutterExtendedState');
                                        },
                                    );
                                    break;
                                case 'u':
                                    this.log.info('moving up');
                                    response = await this.getSimpleObject(device, 'shutterSendUp', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'shutterExtendedState');
                                    shutterboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 45000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'shutterExtendedState');
                                        },
                                    );
                                    break;
                                case 's':
                                    this.log.info('stop moving');
                                    response = await this.getSimpleObject(device, 'shutterSendStop', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'shutterExtendedState');
                                    shutterboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 45000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'shutterExtendedState');
                                        },
                                    );
                                    break;
                            }
                            break;
                        case `${this.namespace}.${name}.command.tilt`:
                            if (state.val !== '' && state.val >= 0 && state.val <= 100) {
                                this.log.info(`tilt: ${state.val}`);
                                response = await this.getSimpleObject(device, 'shutterTilt', state.val);
                                response['command.tilt'] = '';
                                await tools.setIobStates(response);
                                this.setState(id, state, true);
                                tools.getBleboxData(device, 'shutterExtendedState');
                                shutterboxRefreshJob = schedule.scheduleJob(
                                    {
                                        start: new Date(Date.now() + 1000),
                                        end: new Date(Date.now() + 20000),
                                        rule: '*/1 * * * * *',
                                    },
                                    function () {
                                        tools.getBleboxData(device, 'shutterExtendedState');
                                    },
                                );
                            }
                            break;
                        case `${this.namespace}.${name}.command.favorite`:
                            if (state.val >= 1 && state.val <= 4) {
                                this.log.info(`favorite: ${state.val}`);
                                response = await this.getSimpleObject(device, 'shutterFavorite', state.val);
                                response['command.favorite'] = '';
                                await tools.setIobStates(response);
                                this.setState(id, state, true);
                                tools.getBleboxData(device, 'shutterExtendedState');
                                shutterboxRefreshJob = schedule.scheduleJob(
                                    {
                                        start: new Date(Date.now() + 1000),
                                        end: new Date(Date.now() + 20000),
                                        rule: '*/1 * * * * *',
                                    },
                                    function () {
                                        tools.getBleboxData(device, 'shutterExtendedState');
                                    },
                                );
                            }
                            break;
                        case `${this.namespace}.${name}.command.position`:
                            if (state.val !== '' && state.val >= 0 && state.val <= 100) {
                                this.log.info(`position: ${state.val}`);
                                response = await this.getSimpleObject(device, 'shutterPosition', state.val);
                                response['command.position'] = '';
                                await tools.setIobStates(response);
                                this.setState(id, state, true);
                                tools.getBleboxData(device, 'shutterExtendedState');
                                // eslint-disable-next-line
                                shutterboxRefreshJob = schedule.scheduleJob(
                                    {
                                        start: new Date(Date.now() + 1000),
                                        end: new Date(Date.now() + 20000),
                                        rule: '*/1 * * * * *',
                                    },
                                    function () {
                                        tools.getBleboxData(device, 'shutterExtendedState');
                                    },
                                );
                            }
                            break;
                        default:
                            this.log.error(`state ${id} not processed`);
                    }
                    break;
                case 'tvlift':
                    // eslint-disable-next-line no-case-declarations
                    let tvliftRefreshJob = new Object();
                    switch (id) {
                        case `${this.namespace}.${name}.command.move`:
                            switch (state.val) {
                                case 'd':
                                    this.log.info('moving down');
                                    response = await this.getSimpleObject(device, 'tvliftSendDown', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'tvliftExtendedState');
                                    tvliftRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 20000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'tvliftExtendedState');
                                        },
                                    );
                                    break;
                                case 'u':
                                    this.log.info('moving up');
                                    response = await this.getSimpleObject(device, 'tvliftSendUp', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'tvliftExtendedState');
                                    // eslint-disable-next-line
                                    tvliftRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 45000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'tvliftExtendedState');
                                        },
                                    );
                                    break;
                            }
                            break;
                        default:
                            this.log.error(`state ${id} not processed`);
                    }
                    break;
                case 'switchbox':
                    // eslint-disable-next-line no-case-declarations
                    let switchboxRefreshJob = {};
                    switch (id) {
                        case `${this.namespace}.${name}.command.relay`:
                            this.log.info(`set relay to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetRelay', state.val);
                            response['command.relay'] = '';
                            await tools.setIobStates(response);
                            this.setState(id, state, true);
                            tools.getBleboxData(device, 'switchState');
                            break;
                        case `${this.namespace}.${name}.command.setRelayForTime`:
                            this.log.info(`set relayForTime to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetRelayForTime', state.val);
                            response['command.setRelayForTime'] = '';
                            await tools.setIobStates(response);
                            this.setState(id, state, true);
                            tools.getBleboxData(device, 'switchState');
                            // eslint-disable-next-line
                            switchboxRefreshJob = schedule.scheduleJob(
                                {
                                    start: new Date(Date.now() + 1000),
                                    end: new Date(Date.now() + 1000 * state.val + 1000),
                                    rule: '*/10 * * * * *',
                                },
                                function () {
                                    tools.getBleboxData(device, 'switchState');
                                },
                            );
                            break;

                        default:
                            break;
                    }
                    break;
                case 'switchboxD':
                    // eslint-disable-next-line no-case-declarations
                    let switchboxDRefreshJob = {};
                    switch (id) {
                        case `${this.namespace}.${name}.command.relays`:
                            this.log.info(`set all relays to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetAllRelays', state.val);
                            response['command.relays'] = '';
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'switchState');
                            break;
                        case `${this.namespace}.${name}.command.0.relay`:
                            this.log.info(`set relay 0 to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetRelay0', state.val);
                            response['command.0.relay'] = '';
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'switchState');
                            break;
                        case `${this.namespace}.${name}.command.1.relay`:
                            this.log.info(`set relay 1 to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetRelay1', state.val);
                            response['command.1.relay'] = '';
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'switchState');
                            break;
                        case `${this.namespace}.${name}.command.0.setRelayForTime`:
                            this.log.info(`set relay0ForTime to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetRelay0ForTime', state.val);
                            response['command.0.setRelayForTime'] = '';
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'switchState');

                            switchboxDRefreshJob = schedule.scheduleJob(
                                {
                                    start: new Date(Date.now() + 1000),
                                    end: new Date(Date.now() + 1000 * state.val + 1000),
                                    rule: '*/10 * * * * *',
                                },
                                function () {
                                    tools.getBleboxData(device, 'switchState');
                                },
                            );
                            break;
                        case `${this.namespace}.${name}.command.1.setRelayForTime`:
                            this.log.info(`set relay1ForTime to ${state.val}`);
                            response = await this.getSimpleObject(device, 'switchSetRelay0ForTime', state.val);
                            response['command.1.setRelayForTime'] = '';
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'switchState');
                            // eslint-disable-next-line
                            switchboxDRefreshJob = schedule.scheduleJob(
                                {
                                    start: new Date(Date.now() + 1000),
                                    end: new Date(Date.now() + 1000 * state.val + 1000),
                                    rule: '*/10 * * * * *',
                                },
                                function () {
                                    tools.getBleboxData(device, 'switchState');
                                },
                            );
                            break;

                        default:
                            break;
                    }
                    break;
                case 'airsensor':
                    switch (id) {
                        case `${this.namespace}.${name}.command.forceMeasurement`:
                            this.log.info(`force measurement of airsensor`);
                            response = await this.getSimpleObject(device, 'forceMeasurement', state.val);
                            this.log.info(`forceMeasurement of airsensor, response: ${JSON.stringify(response)}`);
                            response['command.forceMeasurement'] = '0';
                            await tools.setIobStates(response);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'gatebox':
                    // eslint-disable-next-line no-case-declarations
                    let gateboxRefreshJob = {};
                    switch (id) {
                        case `${this.namespace}.${name}.command.move`:
                            switch (state.val) {
                                case 'p':
                                    this.log.info('primary action');
                                    response = await this.getSimpleObject(device, 'gatePrimary', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'gateExtendedState');
                                    gateboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 20000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'gateExtendedState');
                                        },
                                    );
                                    break;
                                case 's':
                                    this.log.info('secondary action');
                                    response = await this.getSimpleObject(device, 'gateSecondary', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'gateExtendedState');
                                    gateboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 45000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'gateExtendedState');
                                        },
                                    );
                                    break;
                                case 'o':
                                    this.log.info('open gate');
                                    response = await this.getSimpleObject(device, 'gateOpen', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'gateExtendedState');
                                    gateboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 45000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'gateExtendedState');
                                        },
                                    );
                                    break;
                                case 'c':
                                    this.log.info('close gate');
                                    response = await this.getSimpleObject(device, 'gateClose', null);
                                    response['command.move'] = '';
                                    await tools.setIobStates(response);
                                    this.setState(id, state, true);
                                    tools.getBleboxData(device, 'gateExtendedState');
                                    // eslint-disable-next-line
                                    gateboxRefreshJob = schedule.scheduleJob(
                                        {
                                            start: new Date(Date.now() + 1000),
                                            end: new Date(Date.now() + 45000),
                                            rule: '*/1 * * * * *',
                                        },
                                        function () {
                                            tools.getBleboxData(device, 'gateExtendedState');
                                        },
                                    );
                                    break;
                                default:
                                    break;
                            }
                    }
                    break;

                case 'saunabox':
                    switch (id) {
                        case `${this.namespace}.${name}.command.state`:
                            this.log.info(`set heat to ${state.val}`);
                            response = await this.getSimpleObject(device, 'saunaboxSetHeat', state.val);
                            response['command.state'] = '';
                            this.setState(id, state, true);
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'saunaboxExtendedState');

                            break;
                        case `${this.namespace}.${name}.command.desiredTemp`:
                            this.log.info(`set relayForTime to ${state.val}`);
                            response = await this.getSimpleObject(device, 'saunaboxSetdesiredTemp', state.val * 100);
                            response['command.desiredTemp'] = '';
                            this.setState(id, state, true);
                            await tools.setIobStates(response);
                            tools.getBleboxData(device, 'saunaboxExtendedState');

                            break;
                    }
            }
        }
    }

    /**
     *
     * @param device    device to get data from
     * @param type      apiPart to GET data from
     * @param val       data which is needed to build the request e.g. percentage to open shutter
     */
    async getSimpleObject(device, type, val) {
        let values = {};
        let locationUrl = '';
        // General
        switch (device.api_type) {
            case 'gatebox':
                locationUrl = gatebox.getApiUrl(type, val);
                break;
            case 'saunabox':
                locationUrl = saunabox.getApiUrl(type, val);
                break;
            case 'switchbox':
                locationUrl = switchbox.getApiUrl(type, val);
                break;
            case 'switchboxD':
                locationUrl = switchboxD.getApiUrl(type, val);
                break;
            case 'shutterbox':
                locationUrl = shutterbox.getApiUrl(type, val);
                break;
            case 'tvlift':
                locationUrl = tvlift.getApiUrl(type, val);
                break;
            case 'airsensor':
                locationUrl = airsensor.getApiUrl(type, val);
                break;
            case 'tempsensor':
                locationUrl = tempsensor.getApiUrl(type, val);
                break;
            case 'multisensor':
                locationUrl = multisensor.getApiUrl(type, val);
                break;

            default:
                break;
        }

        this.log.debug(`getSimpleObject : ${type} URL: ${locationUrl} device: ${device}`);
        try {
            values = await tools.simpleObjectUrlGetter(device, locationUrl);
        } catch (error) {
            this.log.error(`getSimpleObject : ${type} URL: ${locationUrl} device: ${device} error: ${error}`);
        }
        return values;
    }
}

// @ts-expect-error parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param options   options for the constructor
     */
    module.exports = options => new Blebox(options);
} else {
    // otherwise start the instance directly

    new Blebox();
}
