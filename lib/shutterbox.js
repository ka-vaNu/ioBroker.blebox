const datapoints = {
    "shutterbox#command.move": {
        path: "command.move", type: "state", common: { name: "move up (u), down (d), stop (s)", type: "string", role: "text", read: true, write: true, states: { u: "Up", d: "Down", s: "Stop" } }
    },
    "shutterbox#command.favorite": {
        path: "command.favorite", type: "state", common: { name: "move to favorite-position 1-4", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#command.position": {
        path: "command.position", type: "state", common: { name: "move to position 0-100", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#command.tilt": {
        path: "command.tilt", type: "state", common: { name: "tilt-command", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.deviceName": {
        path: "device.deviceName", type: "state", common: { name: "Devicename", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.type": {
        path: "device.type", type: "state", common: { name: "Type", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.product": {
        path: "device.product", type: "state", common: { name: "Product", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.fv": {
        path: "device.fv", type: "state", common: { name: "Firmwareversion", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.hv": {
        path: "device.hv", type: "state", common: { name: "Hardwareversion", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.apiLevel": {
        path: "device.apiLevel", type: "state", common: { name: "ApiLevel", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.id": {
        path: "device.id", type: "state", common: { name: "ID", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#device.ip": {
        path: "device.ip", type: "state", common: { name: "IP-Adress", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#uptimeS": {
        path: "uptimeS", type: "state", common: { name: "Uptime in seconds", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.deviceName": {
        path: "settings.deviceName", type: "state", common: { name: "Device name.", type: "string", role: "text", read: true, write: true }
    },
    "shutterbox#settings.statusLed.enabled": {
        path: "settings.statusLed.enabled", type: "state", common: { name: "Status led enabled (0 - disabled, 1 - enabled)", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.tunnel.enabled": {
        path: "settings.tunnel.enabled", type: "state", common: { name: "Tunnel enabled (0 - disabled, 1 - enabled)", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.controlType": {
        path: "settings.shutter.controlType", type: "state", common: { name: "Type of controlled appliance. Where: 1 - segmented shutter, 2 - appliance without positioning, 3 - tilt shutter, 4 - window opener, 5, material shutter, 6 - awning, 7 - screen.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.moveTimeoutMs": {
        path: "settings.shutter.moveTimeoutMs", type: "state", common: { name: "Max time moving shutter in any direction in miliseconds.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.moveDirectionSwap": {
        path: "settings.shutter.moveDirectionSwap", type: "state", common: { name: "Move direction swap. Where: 0 - false, 1 - true.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.inputsSwap": {
        path: "settings.shutter.inputsSwap", type: "state", common: { name: "Inputs swap. Where: 0 - false, 1 - true.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.calibrationParameters.isCalibarted": {
        path: "settings.shutter.calibrationParameters.isCalibarted", type: "state", common: { name: "Information about shutter calibration. Where: 0 - not calibrated, 1 - calibrated.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.calibrationParameters.maxTiltTimeDownMs": {
        path: "settings.shutter.calibrationParameters.maxTiltTimeDownMs", type: "state", common: { name: "Max tilt time up in miliseconds.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#settings.shutter.calibrationParameters.maxTiltTimeUpMs": {
        path: "settings.shutter.calibrationParameters.maxTiltTimeUpMs", type: "state", common: { name: "Max tilt time down in miliseconds.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.state": {
        path: "shutter.state", type: "state", common: { name: "Current shutter state. Where: 0 - Moving down, 1 - Moving up, 2 - Manually stopped, 3 - Lower limit, 4 - Upper limit.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.currentPos.position": {
        path: "shutter.currentPos.position", type: "state", common: { name: "Current shutter position. Value from 0 to 100 or -1 - unknown.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.currentPos.tilt": {
        path: "shutter.currentPos.tilt", type: "state", common: { name: "Current tilt. Value from 0 to 100 or -1 - unknown.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.desiredPos.position": {
        path: "shutter.desiredPos.position", type: "state", common: { name: "Desired shutter position. Value from 0 to 100 or -1 - unknown.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.desiredPos.tilt": {
        path: "shutter.desiredPos.tilt", type: "state", common: { name: "Desired tilt. Value from 0 to 100 or -1 - unknown.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.favPos.position": {
        path: "shutter.favPos.position", type: "state", common: { name: "Favorite shutter position. Value from 0 to 100 or -1 - unknown.", type: "number", role: "value", read: true, write: true }
    },
    "shutterbox#shutter.favPos.tilt": {
        path: "shutter.favPos.tilt", type: "state", common: { name: "Favorite tilt. Value from 0 to 100 or -1 - unknown.", type: "number", role: "value", read: true, write: true }
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
        case "shutterSendUp":
            return "/s/u";
        case "shutterSendDown":
            return "/s/d";
        case "shutterSendStop":
            return "/s/s";
        case "shutterFavorite":
            return "/s/f/" + value;
        case "shutterTilt":
            return "/s/t/" + value;
        case "shutterPosition":
            return "/s/p/" + value;
        case "shutterExtendedState":
            return "/api/shutter/extended/state";
        default:
            break;
    }
}

module.exports = {
    datapoints,
    init,
    getApiUrl
};
