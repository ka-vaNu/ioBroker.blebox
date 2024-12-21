const datapoints = {
    'multisensor#device.deviceName': {
        path: 'device.deviceName',
        type: 'state',
        common: { name: 'Devicename', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.type': {
        path: 'device.type',
        type: 'state',
        common: { name: 'Type', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.product': {
        path: 'device.product',
        type: 'state',
        common: { name: 'Product', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.fv': {
        path: 'device.fv',
        type: 'state',
        common: { name: 'Firmwareversion', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.hv': {
        path: 'device.hv',
        type: 'state',
        common: { name: 'Hardwareversion', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.apiLevel': {
        path: 'device.apiLevel',
        type: 'state',
        common: { name: 'ApiLevel', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.id': {
        path: 'device.id',
        type: 'state',
        common: { name: 'ID', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#device.ip': {
        path: 'device.ip',
        type: 'state',
        common: { name: 'IP-Adress', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#upTimeS': {
        path: 'upTimeS',
        type: 'state',
        common: { name: 'Uptime in seconds', type: 'number', role: 'value', read: true, write: false },
    },
    'multisensor#settings.deviceName': {
        path: 'settings.deviceName',
        type: 'state',
        common: { name: 'Device name.', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#settings.statusLed.enabled': {
        path: 'settings.statusLed.enabled',
        type: 'state',
        common: {
            name: 'Status led enabled (0 - disabled, 1 - enabled)',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#settings.tunnel.enabled': {
        path: 'settings.tunnel.enabled',
        type: 'state',
        common: {
            name: 'Tunnel enabled (0 - disabled, 1 - enabled)',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[0].elapsedTimeS': {
        path: 'multiSensor.sensors.0.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[0].state': {
        path: 'multiSensor.sensors.0.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[0].trend': {
        path: 'multiSensor.sensors.0.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[0].value': {
        path: 'multiSensor.sensors.0.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data, where null = Error and Temperature in Celsius degrees.',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'multisensor#multiSensor.sensors[0].type': {
        path: 'multiSensor.sensors.0.type',
        type: 'state',
        common: { name: 'Type of measured value', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[0].id': {
        path: 'multiSensor.sensors.0.id',
        type: 'state',
        common: { name: 'ID of internal sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[0].iconSet': {
        path: 'multiSensor.sensors.0.iconSet',
        type: 'state',
        common: { name: 'Type of icon', type: 'number', role: 'value', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[0].name': {
        path: 'multiSensor.sensors.0.name',
        type: 'state',
        common: { name: 'Personalized name of the sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[1].elapsedTimeS': {
        path: 'multiSensor.sensors.1.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[1].state': {
        path: 'multiSensor.sensors.1.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[1].trend': {
        path: 'multiSensor.sensors.1.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[1].value': {
        path: 'multiSensor.sensors.1.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data, where null = Error and Temperature in Celsius degrees.',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'multisensor#multiSensor.sensors[1].type': {
        path: 'multiSensor.sensors.1.type',
        type: 'state',
        common: { name: 'Type of measured value', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[1].id': {
        path: 'multiSensor.sensors.1.id',
        type: 'state',
        common: { name: 'ID of internal sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[1].iconSet': {
        path: 'multiSensor.sensors.1.iconSet',
        type: 'state',
        common: { name: 'Type of icon', type: 'number', role: 'value', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[1].name': {
        path: 'multiSensor.sensors.1.name',
        type: 'state',
        common: { name: 'Personalized name of the sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[2].elapsedTimeS': {
        path: 'multiSensor.sensors.2.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[2].state': {
        path: 'multiSensor.sensors.2.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[2].trend': {
        path: 'multiSensor.sensors.2.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[2].value': {
        path: 'multiSensor.sensors.2.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data, where null = Error and Temperature in Celsius degrees.',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'multisensor#multiSensor.sensors[2].type': {
        path: 'multiSensor.sensors.2.type',
        type: 'state',
        common: { name: 'Type of measured value', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[2].id': {
        path: 'multiSensor.sensors.2.id',
        type: 'state',
        common: { name: 'ID of internal sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[2].iconSet': {
        path: 'multiSensor.sensors.2.iconSet',
        type: 'state',
        common: { name: 'Type of icon', type: 'number', role: 'value', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[2].name': {
        path: 'multiSensor.sensors.2.name',
        type: 'state',
        common: { name: 'Personalized name of the sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[3].elapsedTimeS': {
        path: 'multiSensor.sensors.3.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[3].state': {
        path: 'multiSensor.sensors.3.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[3].trend': {
        path: 'multiSensor.sensors.3.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'multisensor#multiSensor.sensors[3].value': {
        path: 'multiSensor.sensors.3.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data, where null = Error and Temperature in Celsius degrees.',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'multisensor#multiSensor.sensors[3].type': {
        path: 'multiSensor.sensors.3.type',
        type: 'state',
        common: { name: 'Type of measured value', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[3].id': {
        path: 'multiSensor.sensors.3.id',
        type: 'state',
        common: { name: 'ID of internal sensor', type: 'string', role: 'text', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[3].iconSet': {
        path: 'multiSensor.sensors.3.iconSet',
        type: 'state',
        common: { name: 'Type of icon', type: 'number', role: 'value', read: true, write: false },
    },
    'multisensor#multiSensor.sensors[3].name': {
        path: 'multiSensor.sensors.3.name',
        type: 'state',
        common: { name: 'Personalized name of the sensor', type: 'string', role: 'text', read: true, write: false },
    },
};

/**
 * init device if needed
 */
function init() {}

/**
 * Generate URLs for requested type and submitted value.
 *
 * @param type     requested type
 * @param _value    value for url-generation
 */
function getApiUrl(type, _value) {
    switch (type) {
        case 'deviceState':
            return '/api/device/state';
        case 'deviceUptime':
            return '/api/device/uptime';
        case 'settingsState':
            return '/api/settings/state';
        case 'multisensorExtendedState':
            return '/state/extended';
        default:
            break;
    }
}

/**
 * Allow multiple devices described by this API
 *
 * @returns Array of supported devices by theis API description
 */
function getDeviceTypeMapping() {
    const supportedApiTypes = {
        multisensor:    'multisensor',
        tempSensor_PRO: 'multisensor',
        tempSensorAC:   'multisensor',
        humiditySensor: 'multisensor',
        windSensor_PRO: 'multisensor',
        rainSensor:     'multisensor',
        floodSensor:    'multisensor',
    };
    return supportedApiTypes;
}

module.exports = {
    datapoints,
    init,
    getApiUrl,
    getDeviceTypeMapping,
};
