const datapoints = {
    "command.relay": {
        path: "command.relay", type: "state", common: { name: "set state off (0) or on (1) or toggle (2)", type: "string", role: "text", read: true, write: true }
    },
    "command.setRelayForTime": {
        path: "command.setRelayForTime", type: "state", common: { name: "set relay on for this number of seconds", type: "number", role: "text", read: true, write: true }
    },
    "device.deviceName": {
        path: "device.deviceName", type: "state", common: { name: "Devicename", type: "string", role: "text", read: true, write: false }
    },
    "device.type": {
        path: "device.type", type: "state", common: { name: "Type", type: "string", role: "text", read: true, write: false }
    },
    "device.product": {
        type: "state", common: { name: "Product", type: "string", role: "text", read: true, write: false }
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
    "settings.tunnel.enabled": {
        path: "settings.tunnel.enabled", type: "state", common: { name: "Tunnel enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: false }
    },
    "settings.statusLed.enabled": {
        path: "settings.statusLed.enabled", type: "state", common: { name: "Status led enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: false }
    },
    "settings.relays[0].stateAfterRestart": {
        path: "settings.relays.0.stateAfterRestart", type: "state", common: { name: "State of relay after reebot/reset. Where: 0 - OFF, 1 - ON, 2 - Last state, 3 - Opposite state.", type: "number", role: "text", read: true, write: false }
    },
    "settings.relays[0].defaultForTime": {
        path: "settings.relays.0.defaultForTime", type: "state", common: { name: "Time in seconds for button \"turn on for time\" in wBox App, where 0 == disabled button", type: "number", role: "text", read: true, write: false }
    },
    "settings.relays[0].powerMeasuring.enabled": {
        path: "settings.relays.0.powerMeasuring.enabled", type: "state", common: { name: "Allows to enable or disable power measuring module (powerConsumption and activePower sensor). If hardware doesn't support power measuring then this object doesn't exist. 0 - disabled, 1 - enabled", type: "number", role: "text", read: true, write: false }
    },
    "relays[0].relay": {
        path: "relays.0.relay", type: "state", common: { name: "ID - relay number", type: "number", role: "text", read: true, write: false }
    },
    "relays[0].state": {
        path: "relays.0.state", type: "state", common: { name: "State of relay, 0 - OFF, 1 - ON", type: "number", role: "text", read: true, write: false }
    },
    "relays[0].stateAfterRestart": {
        path: "relays.0.stateAfterRestart", type: "state", common: { name: "State of relay after reebot/reset, 0 - OFF, 1 - ON, 2 - Last State, 3 - Opposed state", type: "number", role: "text", read: true, write: false }
    },
    "relays[0].defaultForTime": {
        path: "relays.0.defaultForTime", type: "state", common: { name: "Time in seconds for button \"turn on for time\" in wBox App, where 0 == disabled button", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.enabled": {
        path: "powerMeasuring.enabled", type: "state", common: { name: "Indicates whether the function is disabled or enabled, 0 - disabled, 1 - enabled", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.powerConsumption[0].periodS": {
        path: "powerMeasuring.powerConsumption.0.periodS", type: "state", common: { name: "Period of measurement in seconds - applies to the \"value\" field", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.powerConsumption[0].value": {
        path: "powerMeasuring.powerConsumption.0.value", type: "state", common: { name: "Energy consuption in kWh. Always 3 decimal places", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.sensors[0].type": {
        path: "powerMeasuring.sensors.0.type", type: "state", common: { name: "Type of power measurement", type: "string", role: "text", read: true, write: false }
    },
    "powerMeasuring.sensors[0].value": {
        path: "powerMeasuring.sensors.0.value", type: "state", common: { name: "Current value of measurement - power of connected device (active power counted in Watt)", type: "number", role: "text", read: true, write: false }
    }
};

function init() {

}


module.exports = {
    datapoints,
    init
};