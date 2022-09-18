const datapoints = {
    "saunabox#command.state": {
        path: "command.state", type: "state", common: { name: "0 - turn off regulator, 1 - turn on regulator", type: "number", role: "value", read: true, write: true, states: { 0: "Off", 1: "On" } }
    },
    "saunabox#command.desiredTemp": {
        path: "command.desiredTemp", type: "state", common: { name: "temperature in celsius. It should be value between max&min from settings", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#device.deviceName": {
        path: "device.deviceName", type: "state", common: { name: "Devicename", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.type": {
        path: "device.type", type: "state", common: { name: "Type", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.product": {
        path: "device.product", type: "state", common: { name: "Product", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.fv": {
        path: "device.fv", type: "state", common: { name: "Firmwareversion", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.hv": {
        path: "device.hv", type: "state", common: { name: "Hardwareversion", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.apiLevel": {
        path: "device.apiLevel", type: "state", common: { name: "ApiLevel", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.id": {
        path: "device.id", type: "state", common: { name: "ID", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#device.ip": {
        path: "device.ip", type: "state", common: { name: "IP-Adress", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#uptimeS": {
        path: "uptimeS", type: "state", common: { name: "Uptime in seconds", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#settings.deviceName": {
        path: "settings.deviceName", type: "state", common: { name: "Device name.", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#settings.statusLed.enabled": {
        path: "settings.statusLed.enabled", type: "state", common: { name: "Status led enabled (0 - disabled, 1 - enabled)", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#settings.tunnel.enabled": {
        path: "settings.tunnel.enabled", type: "state", common: { name: "Tunnel enabled (0 - disabled, 1 - enabled)", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#heat.minimumTemp": {
        path: "heat.minimumTemp", factor: 0.01, type: "state", common: { name: "saunaBox's minimal Temperature for regulator, minimum value: -55", type: "number", role: "value.temperature", read: true, write: true, unit: "°C" }
    },
    "saunabox#heat.maximumTemp": {
        path: "heat.maximumTemp", factor: 0.01, type: "state", common: { name: "saunaBox's maximal Temperature for regulator, maximum value: 125", type: "number", role: "value.temperature", read: true, write: true, unit: "°C" }
    },
    "saunabox#heat.state": {
        path: "heat.state", type: "state", common: { name: "state of regulator (0 - off, 1 - on)", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#heat.desiredTemp": {
        path: "heat.desiredTemp", factor: 0.01, type: "state", common: { name: "regulator's desired temperature, value between max&min from settings", type: "number", role: "value.temperature", read: true, write: true, unit: "°C" }
    },
    "saunabox#heat.sensors[0].type": {
        path: "heat.sensors.0.type", type: "state", common: { name: "Type of measured value", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#heat.sensors[0].id": {
        path: "heat.sensors.0.id", type: "state", common: { name: "ID of internal sensor", type: "string", role: "text", read: true, write: true }
    },
    "saunabox#heat.sensors[0].value": {
        path: "heat.sensors.0.value", factor: 0.01, type: "state", common: { name: "Value of measured data, where null = Error and Temperature in Celsius degrees.", type: "number", role: "value.temperature", read: true, write: true, unit: "°C" }
    },
    "saunabox#heat.sensors[0].trend": {
        path: "heat.sensors.0.trend", type: "state", common: { name: "Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#heat.sensors[0].state": {
        path: "heat.sensors.0.state", type: "state", common: { name: "Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error", type: "number", role: "value", read: true, write: true }
    },
    "saunabox#heat.sensors[0].elapsedTimeS": {
        path: "heat.sensors.0.elapsedTimeS", type: "state", common: { name: "Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data", type: "number", role: "value", read: true, write: true }
    }
};

function init () {

}

function getApiUrl (type, value) {
    switch (type) {
        case "deviceState":
            return "/api/device/state";
        case "deviceUptime":
            return "/api/device/uptime";
        case "settingsState":
            return "/api/settings/state";
        case "saunaboxExtendedState":
            return "/api/heat/extended/state";
        case "saunaboxSetHeat":
            return "/s/" + value;
        case "saunaboxSetdesiredTemp":
            return "/s/t/" + value;
        default:
            break;
    }
}

module.exports = {
    datapoints,
    init,
    getApiUrl
};
