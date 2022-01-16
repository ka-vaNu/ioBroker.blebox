const datapoints = {
    "tempsensor#device.deviceName": {
        path: "device.deviceName", type: "state", common: { name: "Devicename", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.type": {
        path: "device.type", type: "state", common: { name: "Type", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.product": {
        path: "device.product", type: "state", common: { name: "Product", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.fv": {
        path: "device.fv", type: "state", common: { name: "Firmwareversion", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.hv": {
        path: "device.hv", type: "state", common: { name: "Hardwareversion", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.apiLevel": {
        path: "device.apiLevel", type: "state", common: { name: "ApiLevel", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.id": {
        path: "device.id", type: "state", common: { name: "ID", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#device.ip": {
        path: "device.ip", type: "state", common: { name: "IP-Adress", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#uptimeS": {
        path: "uptimeS", type: "state", common: { name: "Uptime in seconds", type: "number", role: "text", read: true, write: true }
    },
    "tempsensor#settings.deviceName": {
        path: "settings.deviceName", type: "state", common: { name: "Device name.", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#settings.statusLed.enabled": {
        path: "settings.statusLed.enabled", type: "state", common: { name: "Status led enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: true }
    },
    "tempsensor#settings.tunnel.enabled": {
        path: "settings.tunnel.enabled", type: "state", common: { name: "Tunnel enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: true }
    },
    "tempsensor#tempSensor.sensors[0].elapsedTimeS": {
        path: "tempSensor.sensors.0.elapsedTimeS", type: "state", common: { name: "Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data", type: "number", role: "text", read: true, write: true }
    },
    "tempsensor#tempSensor.sensors[0].state": {
        path: "tempSensor.sensors.0.state", type: "state", common: { name: "Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error", type: "number", role: "text", read: true, write: true }
    },
    "tempsensor#tempSensor.sensors[0].trend": {
        path: "tempSensor.sensors.0.trend", type: "state", common: { name: "Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward", type: "number", role: "text", read: true, write: true }
    },
    "tempsensor#tempSensor.sensors[0].value": {
        path: "tempSensor.sensors.0.value", factor: 0.01, type: "state", common: { name: "Value of measured data, where null = Error and Temperature in Celsius degrees.", type: "number", role: "value.temperature", read: true, write: true, unit: "°C" }
    },
    "tempsensor#tempSensor.sensors[0].type": {
        path: "tempSensor.sensors.0.type", type: "state", common: { name: "Type of measured value", type: "string", role: "text", read: true, write: true }
    },
    "tempsensor#tempSensor.sensors[0].id": {
        path: "tempSensor.sensors.0.id", type: "state", common: { name: "ID of internal sensor", type: "string", role: "text", read: true, write: true }
    }
};

function init() {

}

// eslint-disable-next-line no-unused-vars
function getApiUrl(type, value) {
    switch (type) {
        case "deviceState":
            return "/api/device/state";
        case "deviceUptime":
            return "/api/device/uptime";
        case "settingsState":
            return "/api/settings/state";
        case "tempsensorExtendedState":
            return "/api/tempsensor/state";
        default:
            break;
    }
}

module.exports = {
    datapoints,
    init,
    getApiUrl
};