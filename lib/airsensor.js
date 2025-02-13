const datapoints = {
    'airsensor#device.deviceName': {
        path: 'device.deviceName',
        type: 'state',
        common: {
            name: 'Devicename',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.type': {
        path: 'device.type',
        type: 'state',
        common: {
            name: 'Type',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.product': {
        path: 'device.product',
        type: 'state',
        common: {
            name: 'Product',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.fv': {
        path: 'device.fv',
        type: 'state',
        common: {
            name: 'Firmwareversion',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.hv': {
        path: 'device.hv',
        type: 'state',
        common: {
            name: 'Hardwareversion',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.apiLevel': {
        path: 'device.apiLevel',
        type: 'state',
        common: {
            name: 'ApiLevel',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.id': {
        path: 'device.id',
        type: 'state',
        common: {
            name: 'ID',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#device.ip': {
        path: 'device.ip',
        type: 'state',
        common: {
            name: 'IP-Adress',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#uptimeS': {
        path: 'uptimeS',
        type: 'state',
        common: {
            name: 'Uptime in seconds',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#settings.deviceName': {
        path: 'settings.deviceName',
        type: 'state',
        common: {
            name: 'Device name.',
            type: 'string',
            role: 'text',
            read: true,
            write: true,
        },
    },
    'airsensor#settings.tunnel.enabled': {
        path: 'settings.tunnel.enabled',
        type: 'state',
        common: {
            name: 'Tunnel enabled (0 - disabled, 1 - enabled)',
            type: 'number',
            role: 'value',
            read: true,
            write: true,
        },
    },
    'airsensor#settings.statusLed.enabled': {
        path: 'settings.statusLed.enabled',
        type: 'state',
        common: {
            name: 'Status led enabled (0 - disabled, 1 - enabled)',
            type: 'number',
            role: 'value',
            read: true,
            write: true,
        },
    },
    'airsensor#air.airQualityLevel': {
        path: 'air.airQualityLevel',
        type: 'state',
        common: {
            name: 'Air quality level (Polish GIOŚ scale), where null = No data, -1 = No level of quality level for this value (no scale for PM1), 1-6 = Very Good - Very Bad',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[0].type': {
        path: 'air.sensors.0.type',
        type: 'state',
        common: {
            name: 'Type of measured value, pm1 pm2.5 pm10',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[0].value': {
        path: 'air.sensors.0.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data type, where 0 = no data',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'airsensor#air.sensors[0].qualityLevel': {
        path: 'air.sensors.0.qualityLevel',
        type: 'state',
        common: {
            name: 'Air quality level (Polish GIOŚ scale), where null = No data, -1 = No level of quality level for this value (no scale for PM1), 1-6 = Very Good - Very Bad',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[0].trend': {
        path: 'air.sensors.0.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[0].state': {
        path: 'air.sensors.0.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 0 = Idle, 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[0].elapsedTimeS': {
        path: 'air.sensors.0.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where: -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[1].type': {
        path: 'air.sensors.1.type',
        type: 'state',
        common: {
            name: 'Type of measured value, pm1 pm2.5 pm10',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[1].value': {
        path: 'air.sensors.1.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data type, where 0 = no data',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'airsensor#air.sensors[1].qualityLevel': {
        path: 'air.sensors.1.qualityLevel',
        type: 'state',
        common: {
            name: 'Air quality level (Polish GIOŚ scale), where null = No data, -1 = No level of quality level for this value (no scale for PM1), 1-6 = Very Good - Very Bad',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[1].trend': {
        path: 'air.sensors.1.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[1].state': {
        path: 'air.sensors.1.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 0 = Idle, 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[1].elapsedTimeS': {
        path: 'air.sensors.1.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where: -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[2].type': {
        path: 'air.sensors.2.type',
        type: 'state',
        common: {
            name: 'Type of measured value, pm1 pm2.5 pm10',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[2].value': {
        path: 'air.sensors.2.value',
        factor: 0.01,
        type: 'state',
        common: {
            name: 'Value of measured data type, where 0 = no data',
            type: 'number',
            role: 'value.temperature',
            read: true,
            write: false,
            unit: '°C',
        },
    },
    'airsensor#air.sensors[2].qualityLevel': {
        path: 'air.sensors.2.qualityLevel',
        type: 'state',
        common: {
            name: 'Air quality level (Polish GIOŚ scale), where null = No data, -1 = No level of quality level for this value (no scale for PM1), 1-6 = Very Good - Very Bad',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[2].trend': {
        path: 'air.sensors.2.trend',
        type: 'state',
        common: {
            name: 'Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[2].state': {
        path: 'air.sensors.2.state',
        type: 'state',
        common: {
            name: 'Status of sensor, where 0 = Idle, 1 = Measure in progress, 2 = Active Mode, 3 = Error',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#air.sensors[2].elapsedTimeS': {
        path: 'air.sensors.2.elapsedTimeS',
        type: 'state',
        common: {
            name: 'Time in seconds that has elapsed since last valid measurement occurred, where: -1 = Error, 0 = Fresh data',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'airsensor#command.forceMeasurement': {
        path: 'command.forceMeasurement',
        type: 'state',
        common: {
            name: 'Force Measurement (now = 1)',
            type: 'number',
            role: 'value',
            read: true,
            write: true,
            states: { 0: 'Off', 1: 'On' },
        },
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
            return '/state';
        case 'deviceUptime':
            return '/api/device/uptime';
        case 'settingsState':
            return '/api/settings/state';
        case 'airsensorExtendedState':
            return '/state/extended';
        case 'airsensorRuntime':
            // Returns information about run time of internal air quality sensor
            return '/api/air/runtime';
        case 'forceMeasurement':
            // Allows to force measurement immediately
            return '/s/kick';
        default:
            return false;
    }
}

/**
 * Allow multiple devices described by this API
 *
 * @returns Array of supported devices by theis API description
 */
function getDeviceTypeMapping() {
    const supportedApiTypes = {
        airsensor: 'airsensor',
    };
    return supportedApiTypes;
}

module.exports = {
    datapoints,
    init,
    getApiUrl,
    getDeviceTypeMapping,
};
