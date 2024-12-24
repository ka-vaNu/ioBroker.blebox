/* eslint-disable no-undef */
'use strict';
const shutterbox = require('./shutterbox');

const { expect } = require('chai');

const datapointMoveCommand = {
    path: 'command.move',
    type: 'state',
    common: {
        name: 'move up (u), down (d), stop (s)',
        type: 'string',
        role: 'text',
        read: true,
        write: true,
        states: { u: 'Up', d: 'Down', s: 'Stop' },
    },
};

describe('test shutterbox.getDatapoints', () => {
    const result = shutterbox.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['shutterbox#command.move'])).to.equal(JSON.stringify(datapointMoveCommand));
    });
});

describe('test shutterbox.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/api/shutter/extended/state';
        expect(shutterbox.getApiUrl('shutterExtendedState')).to.be.equal(result);
    });

    it('expect false on unsupported call', () => {
        expect(shutterbox.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test shutterbox.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            shutterbox: 'shutterbox',
            shutterboxDC: 'shutterbox',
            shutterboxDIN: 'shutterbox',
        };

        expect(JSON.stringify(shutterbox.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
