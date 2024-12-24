/* eslint-disable no-undef */
'use strict';
const gatebox = require('./gatebox');

const { expect } = require('chai');

const datapointMoveCommand = {
    path: 'command.move',
    type: 'state',
    common: {
        name: 'primary action (p), secondary action (s), open (o), close (c)',
        type: 'string',
        role: 'text',
        read: true,
        write: true,
        states: { p: 'Primary', s: 'Secondary', o: 'Open', c: 'Close' },
    },
};

describe('test gatebox.getDatapoints', () => {
    const result = gatebox.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['gatebox#command.move'])).to.equal(JSON.stringify(datapointMoveCommand));
    });
});

describe('test gatebox.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/state/extended';
        expect(gatebox.getApiUrl('gateExtendedState')).to.be.equal(result);
    });
    it('expect false on unsupported call', () => {
        expect(gatebox.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test gatebox.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            gatebox: 'gatebox',
        };

        expect(JSON.stringify(gatebox.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
