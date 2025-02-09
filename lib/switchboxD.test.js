/* eslint-disable no-undef */
'use strict';
const switchboxD = require('./switchboxD');

const { expect } = require('chai');

const datapointRelayCommand = {
    path: 'command.relays',
    type: 'state',
    common: {
        name: 'set state off (0) or on (1) or toggle (2) for all relays',
        type: 'string',
        role: 'text',
        read: true,
        write: true,
        states: { 0: 'Off', 1: 'On', 2: 'Toggle' },
    },
};

describe('test switchboxD.getDatapoints', () => {
    const result = switchboxD.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['switchboxD#command.relays'])).to.equal(JSON.stringify(datapointRelayCommand));
    });
});

describe('test switchboxD.getApiUrl', () => {
    it('expect correct URL Extended State', () => {
        const result = '/state/extended';
        expect(switchboxD.getApiUrl('switchExtendedState')).to.be.equal(result);
    });

    it('expect correct URL relay 0 on', () => {
        const result = '/s/0/1';
        expect(switchboxD.getApiUrl('switchSetRelay0', 1)).to.be.equal(result);
    });

    it('expect correct URL relay 1 toggle', () => {
        const result = '/s/1/2';
        expect(switchboxD.getApiUrl('switchSetRelay1', 2)).to.be.equal(result);
    });

    it('expect correct URL relay 0 on 10 sec', () => {
        const result = '/s/0/1/forTime/10/ns/0';
        expect(switchboxD.getApiUrl('switchSetRelay0ForTime', 10)).to.be.equal(result);
    });

    it('expect false on unsupported call', () => {
        expect(switchboxD.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test switchboxD.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            switchBoxD: 'switchboxD',
            switchBoxDC: 'switchboxD',
            switchBoxD_DIN: 'switchboxD',
            switchBoxT_PRO: 'switchboxD',
        };

        expect(JSON.stringify(switchboxD.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
