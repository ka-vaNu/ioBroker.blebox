const datapoints = {
  'gatebox#command.move': {
    path: 'command.move', type: 'state', common: { name: 'primary action (p), secondary action (s), open (o), close (c)', type: 'string', role: 'text', read: true, write: true, states: { p: 'Primary', s: 'Secondary', o: 'Open', c: 'Close' } }
  },
  'gatebox#device.deviceName': {
    path: 'device.deviceName', type: 'state', common: { name: 'Devicename', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.type': {
    path: 'device.type', type: 'state', common: { name: 'Type', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.product': {
    path: 'device.product', type: 'state', common: { name: 'Product', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.fv': {
    path: 'device.fv', type: 'state', common: { name: 'Firmwareversion', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.hv': {
    path: 'device.hv', type: 'state', common: { name: 'Hardwareversion', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.apiLevel': {
    path: 'device.apiLevel', type: 'state', common: { name: 'ApiLevel', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.id': {
    path: 'device.id', type: 'state', common: { name: 'ID', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#device.ip': {
    path: 'device.ip', type: 'state', common: { name: 'IP-Adress', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#upTimeS': {
    path: 'uptimeS', type: 'state', common: { name: 'Uptime in seconds', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.deviceName': {
    path: 'settings.deviceName', type: 'state', common: { name: 'Device name.', type: 'string', role: 'text', read: true, write: true }
  },
  'gatebox#settings.statusLed.enabled': {
    path: 'settings.statusLed.enabled', type: 'state', common: { name: 'Status led enabled (0 - disabled, 1 - enabled)', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.tunnel.enabled': {
    path: 'settings.tunnel.enabled', type: 'state', common: { name: 'Tunnel enabled (0 - disabled, 1 - enabled)', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.gateType': {
    path: 'settings.gate.gateType', type: 'state', common: { name: 'Type of controlled appliance. Where: 0 - sliding door, 1 - garage door, 2 - over door, 3 - door.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.gatePulseTimeMs': {
    path: 'settings.gate.gatePulseTimeMs', type: 'state', common: { name: 'Gate output pulse time in ms.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.gateRelayNumber': {
    path: 'settings.gate.gateRelayNumber', type: 'state', common: { name: 'Gate relay number, where: 0 - O1, 1 - O2.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.gateInvert': {
    path: 'settings.gate.gateInvert', type: 'state', common: { name: 'Inputs swap. Where: 0 - non-invert, 1 - invert.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.extraButtonType': {
    path: 'settings.gate.gateInvert', type: 'state', common: { name: 'Type of extra button, where: 0 - disabled, 1 - stop, 2 - walk-in, 3 - other.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.extraButtonPulseTimeMs': {
    path: 'settings.gate.extraButtonPulseTimeMs', type: 'state', common: { name: 'Extra button output pulse time in ms', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.extraButtonInvert': {
    path: 'settings.gate.extraButtonInvert', type: 'state', common: { name: 'Invert output signal on gate output. Where: 0 - non-invert, 1 - invert.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.extraButtonRelayNumber': {
    path: 'settings.gate.extraButtonRelayNumber', type: 'state', common: { name: 'Extra button relay number, where: 0 - O1, 1 - O2.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.inputsType': {
    path: 'settings.gate.inputsType', type: 'state', common: { name: 'Inputs type. Where: 0 - Method 1, 1 - Method 2, 2 - Method 3.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.openLimitSwitchInputNumber': {
    path: 'settings.gate.openLimitSwitchInputNumber', type: 'state', common: { name: 'Open input number, where: 0 - IN1, 1 - IN2.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#settings.gate.closeLimitSwitchInputNumber': {
    path: 'settings.gate.closeLimitSwitchInputNumber', type: 'state', common: { name: 'Close input number, where: 0 - IN1, 1 - IN2.', type: 'number', role: 'value', read: true, write: true }
  },
  'gatebox#gate.currentPos': {
    path: 'gate.currentPos', type: 'state', common: { name: 'Current position is the open percent of the gate. 0 - fully closed, 50 - somewhere between open and close, 100 - fully close.', type: 'number', role: 'value', read: true, write: true }
  }
}

function init () {

}

// eslint-disable-next-line no-unused-vars
function getApiUrl (type, value) {
  switch (type) {
    case 'deviceUptime':
      return '/api/device/uptime'
    case 'settingsState':
      return '/api/settings/state'
    case 'gateExtendedState':
      return '/api/gate/extended/state'
    case 'deviceState':
      return '/api/device/state'
    case 'gatePrimary':
      return '/s/p'
    case 'gateSecondary':
      return '/s/s'
    case 'gateOpen':
      return '/s/o'
    case 'gateClose':
      return '/s/c'
    default:
      break
  }
}

module.exports = {
  datapoints,
  init,
  getApiUrl
}
