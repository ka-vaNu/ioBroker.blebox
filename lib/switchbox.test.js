/* eslint-disable no-undef */
'use strict';
const switchbox = require('./switchbox');

const { expect } = require('chai');

const datapointRelayCommand = {
    path: 'command.relay',
    type: 'state',
    common: {
        name: 'set state off (0) or on (1) or toggle (2)',
        type: 'string',
        role: 'text',
        read: true,
        write: true,
        states: { 0: 'Off', 1: 'On', 2: 'Toggle' },
    },
};

describe('test switchbox.getDatapoints', () => {
    const result = switchbox.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['switchbox#command.relay'])).to.equal(JSON.stringify(datapointRelayCommand));
    });
});

describe('test switchbox.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/state/extended';
        expect(switchbox.getApiUrl('switchExtendedState')).to.be.equal(result);
    });

    it('expect false on unsupported call', () => {
        expect(switchbox.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test switchbox.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            switchbox: 'switchbox',
            switchBoxD: 'switchbox',
            switchBoxDC: 'switchbox',
            switchBox_DIN: 'switchbox',
            switchBoxD_DIN: 'switchbox',
            switchBoxT_PRO: 'switchbox',
        };

        expect(JSON.stringify(switchbox.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
