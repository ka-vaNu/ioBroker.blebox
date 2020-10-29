const datapoints = {
    "command.relay": {
        type: "state", common: { name: "set state off (0) or on (1) or toggle (2)", type: "string", role: "text", read: true, write: true }
    },
    "command.setRelayForTime": {
        type: "state", common: { name: "set relay on for this number of seconds", type: "number", role: "text", read: true, write: true }
    },
    "device.deviceName": {
        type: "state", common: { name: "Devicename", type: "string", role: "text", read: true, write: false }
    },
    "device.type": {
        type: "state", common: { name: "Type", type: "string", role: "text", read: true, write: false }
    },
    "device.fv": {
        type: "state", common: { name: "Firmwareversion", type: "string", role: "text", read: true, write: false }
    },
    "device.hv": {
        type: "state", common: { name: "Hardwareversion", type: "string", role: "text", read: true, write: false }
    },
    "device.apiLevel": {
        type: "state", common: { name: "ApiLevel", type: "string", role: "text", read: true, write: false }
    },
    "device.id": {
        type: "state", common: { name: "ID", type: "string", role: "text", read: true, write: false }
    },
    "device.ip": {
        type: "state", common: { name: "IP-Adress", type: "string", role: "text", read: true, write: false }
    },
    "uptimeS": {
        type: "state", common: { name: "Uptime in seconds", type: "number", role: "text", read: true, write: true }
    },
    "settings.device": {
        type: "state", common: { name: "Device name.", type: "string", role: "text", read: true, write: false }
    },
    "settings.statusLed.enabled": {
        type: "state", common: { name: "Status led enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: false }
    },
    "settings.tunnel.enabled": {
        type: "state", common: { name: "Tunnel enabled (0 - disabled, 1 - enabled)", type: "boolean", role: "text", read: true, write: false }
    },
    "settings.shutter.controlType": {
        type: "state", common: { name: "Type of controlled appliance. Where: 1 - segmented shutter, 2 - appliance without positioning, 3 - tilt shutter, 4 - window opener, 5, material shutter, 6 - awning, 7 - screen.", type: "number", role: "text", read: true, write: false }
    },
    "settings.shutter.moveTimeoutMs": {
        type: "state", common: { name: "Max time moving shutter in any direction in miliseconds.", type: "number", role: "text", read: true, write: false }
    },
    "settings.shutter.moveDirectionSwap": {
        type: "state", common: { name: "Move direction swap. Where: 0 - false, 1 - true.", type: "number", role: "text", read: true, write: false }
    },
    "settings.shutter.inputsSwap": {
        type: "state", common: { name: "Inputs swap. Where: 0 - false, 1 - true.", type: "number", role: "text", read: true, write: false }
    },
    "settings.shutter.calibrationParameters.isCalibarted": {
        type: "state", common: { name: "Information about shutter calibration. Where: 0 - not calibrated, 1 - calibrated.", type: "number", role: "text", read: true, write: false }
    },
    "settings.shutter.calibrationParameters.maxTiltTimeDownMs": {
        type: "state", common: { name: "Max tilt time up in miliseconds.", type: "number", role: "text", read: true, write: false }
    },
    "settings.shutter.calibrationParameters.maxTiltTimeUpMs": {
        type: "state", common: { name: "Max tilt time down in miliseconds.", type: "number", role: "text", read: true, write: false }
    },
    "relays.relay": {
        type: "state", common: { name: "ID - relay number", type: "number", role: "text", read: true, write: false }
    },
    "relays.state": {
        type: "state", common: { name: "State of relay, 0 - OFF, 1 - ON", type: "number", role: "text", read: true, write: false }
    },
    "relays.stateAfterRestart": {
        type: "state", common: { name: "State of relay after reebot/reset, 0 - OFF, 1 - ON, 2 - Last State, 3 - Opposed state", type: "number", role: "text", read: true, write: false }
    },
    "relays.defaultForTime": {
        type: "state", common: { name: "Time in seconds for button \"turn on for time\" in wBox App, where 0 == disabled button", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.enabled": {
        type: "state", common: { name: "Indicates whether the function is disabled or enabled, 0 - disabled, 1 - enabled", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.powerConsumption[0].periodS": {
        type: "state", common: { name: "Period of measurement in seconds - applies to the \"value\" field", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.powerConsumption[0].value": {
        type: "state", common: { name: "Energy consuption in kWh. Always 3 decimal places", type: "number", role: "text", read: true, write: false }
    },
    "powerMeasuring.sensors[0].type": {
        type: "state", common: { name: "Type of power measurement", type: "string", role: "text", read: true, write: false }
    },
    "powerMeasuring.sensors[0].value": {
        type: "state", common: { name: "Current value of measurement - power of connected device (active power counted in Watt)", type: "number", role: "text", read: true, write: false }
    }
};

function init() {
    
}


module.exports = {
    datapoints,
    init
};