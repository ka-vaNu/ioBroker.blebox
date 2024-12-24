const datapoints = {
    'tvlift#command.move': {
        path: 'command.move',
        type: 'state',
        common: {
            name: 'move up (u), down (d)',
            type: 'string',
            role: 'text',
            read: true,
            write: true,
            states: { u: 'Up', d: 'Down' },
        },
    },
    'tvlift#device.deviceName': {
        path: 'device.deviceName',
        type: 'state',
        common: { name: 'Devicename', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.type': {
        path: 'device.type',
        type: 'state',
        common: { name: 'Type', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.product': {
        path: 'device.product',
        type: 'state',
        common: { name: 'Product', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.fv': {
        path: 'device.fv',
        type: 'state',
        common: { name: 'Firmwareversion', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.hv': {
        path: 'device.hv',
        type: 'state',
        common: { name: 'Hardwareversion', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.apiLevel': {
        path: 'device.apiLevel',
        type: 'state',
        common: { name: 'ApiLevel', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.id': {
        path: 'device.id',
        type: 'state',
        common: { name: 'ID', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#device.ip': {
        path: 'device.ip',
        type: 'state',
        common: { name: 'IP-Adress', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#ip': {
        path: 'network.ip',
        type: 'state',
        common: { name: 'IP-Adress', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#ssid': {
        path: 'network.ssid',
        type: 'state',
        common: { name: 'SSID', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#bssid': {
        path: 'network.bssid',
        type: 'state',
        common: { name: 'BSSID', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#mac': {
        path: 'network.mac',
        type: 'state',
        common: { name: 'MAC-Adresse', type: 'string', role: 'text', read: true, write: false },
    },
    'tvlift#station_status': {
        path: 'network.station_status',
        type: 'state',
        common: {
            name: 'Status WIFI Connection ( 0 - Not Configured, 1 - Connecting, 2 - Wrong Password, 3 - WiFi network not found, 4 - Communication failed, 5 - Connected',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'tvlift#tunnel_status': {
        path: 'network.tunnel_status',
        type: 'state',
        common: {
            name: 'Status Clound Connection ( 0 - Waiting, 1 - Connecting, 2 - DNS failed, 3 - server not found, 4 - Connection broken, 5 - Connected, 6 - Disabled',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'tvlift#channel': {
        path: 'network.channel',
        type: 'state',
        common: { name: 'WLAN Channel', type: 'number', role: 'value', read: true, write: false },
    },
    'tvlift#tvLift.controlType': {
        path: 'device.controlType',
        type: 'state',
        common: {
            name: 'Type of motor controller ( 0 - Close - Open, 1 - Top - Bottom, 2 - Top - Bottom with Rotation, 3 - Projector Lift, 4 - Close - Open with favorite',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
    },
    'tvlift#uptimeS': {
        path: 'device.uptimeS',
        type: 'state',
        common: { name: 'Uptime in seconds', type: 'number', role: 'value', read: true, write: false },
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
            return '/info';
        case 'deviceNetwork':
            return '/api/device/network';
        case 'deviceUptime':
            return '/api/device/uptime';
        case 'tvliftSendUp':
            return '/s/s';
        case 'tvliftSendDown':
            return '/s/p';
        case 'tvliftExtendedState':
            return '/state/extended';
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
        tvlift: 'tvlift',
    };
    return supportedApiTypes;
}

module.exports = {
    datapoints,
    init,
    getApiUrl,
    getDeviceTypeMapping,
};
