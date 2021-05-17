const datapoints = {
    "command.state": {
        path: "command.state", type: "state", common: { name: "0 - turn off regulator, 1 - turn on regulator", type: "number", role: "text", read: true, write: true }
    },
    "command.desiredTemp": {
        path: "command.desiredTemp", type: "state", common: { name: "temperature in celsius * 100 (format xxxx as xx.xx degrees). It should be value between max&min from settings", type: "number", role: "text", read: true, write: true }
    },
    "device.deviceName": {
        path: "device.deviceName", type: "state", common: { name: "Devicename", type: "string", role: "text", read: true, write: false }
    },
    "device.type": {
        path: "device.type", type: "state", common: { name: "Type", type: "string", role: "text", read: true, write: false }
    },
    "device.product": {
        path: "device.product", type: "state", common: { name: "Product", type: "string", role: "text", read: true, write: false }
    },
    "device.fv": {
        path: "device.fv", type: "state", common: { name: "Firmwareversion", type: "string", role: "text", read: true, write: false }
    },
    "device.hv": {
        path: "device.hv", type: "state", common: { name: "Hardwareversion", type: "string", role: "text", read: true, write: false }
    },
    "device.apiLevel": {
        path: "device.apiLevel", type: "state", common: { name: "ApiLevel", type: "string", role: "text", read: true, write: false }
    },
    "device.id": {
        path: "device.id", type: "state", common: { name: "ID", type: "string", role: "text", read: true, write: false }
    },
    "device.ip": {
        path: "device.ip", type: "state", common: { name: "IP-Adress", type: "string", role: "text", read: true, write: false }
    },
    "uptimeS": {
        path: "uptimeS", type: "state", common: { name: "Uptime in seconds", type: "number", role: "text", read: true, write: true }
    },
    "settings.deviceName": {
        path: "settings.deviceName", type: "state", common: { name: "Device name.", type: "string", role: "text", read: true, write: false }
    },
    "settings.statusLed.enabled": {
        path: "settings.statusLed.enabled", type: "state", common: { name: "Status led enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: false }
    },
    "settings.tunnel.enabled": {
        path: "settings.tunnel.enabled", type: "state", common: { name: "Tunnel enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: false }
    },
    "settings.heat.minimumTemp": {
        path: "settings.heat.minimumTemp", type: "state", common: { name: "saunaBox's minimal Temperature for regulator (format xxxx as xx.xx degrees), minimum value: -5500", type: "number", role: "text", read: true, write: false }
    },
    "settings.heat.maximumTemp": {
        path: "settings.heat.maximumTemp", type: "state", common: { name: "saunaBox's maximal Temperature for regulator (format xxxx as xx.xx degrees), maximum value: 12500", type: "number", role: "text", read: true, write: false }
    },
    "heat.state": {
        path: "heat.state", type: "state", common: { name: "state of regulator (0 - off, 1 - on)", type: "number", role: "text", read: true, write: false }
    },
    "heat.desiredTemp": {
        path: "heat.desiredTemp", type: "state", common: { name: "regulator's desired temperature (format xxxx as xx.xx degrees), value between max&min from settings", type: "number", role: "text", read: true, write: false }
    },
    "heat.sensors[0].type": {
        path: "heat.sensors.0.type", type: "state", common: { name: "Type of measured value", type: "string", role: "text", read: true, write: false }
    },
    "heat.sensors[0].id": {
        path: "heat.sensors.0.id", type: "state", common: { name: "ID of internal sensor", type: "string", role: "text", read: true, write: false }
    },
    "heat.sensors[0].value": {
        path: "heat.sensors.0.value", type: "state", common: { name: "Value of measured data, where null = Error and xxxx as xx.xx (Temperature in Celsius degrees. Value need to be divided by 100)", type: "number", role: "text", read: true, write: false }
    },
    "heat.sensors[0].trend": {
        path: "heat.sensors.0.trend", type: "state", common: { name: "Trend of measured data, where 0 = no data, 1 = sidewave, 2 = Downward, 3 = Upward", type: "number", role: "text", read: true, write: false }
    },
    "heat.sensors[0].state": {
        path: "heat.sensors.0.state", type: "state", common: { name: "Status of sensor, where 1 = Measure in progress, 2 = Active Mode, 3 = Error", type: "number", role: "text", read: true, write: false }
    },
    "heat.sensors[0].elapsedTimeS": {
        path: "heat.sensors.0.elapsedTimeS", type: "state", common: { name: "Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data", type: "number", role: "text", read: true, write: false }
    }
};

function init() {
    
}


module.exports = {
    datapoints,
    init
};