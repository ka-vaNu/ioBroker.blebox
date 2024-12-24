/* eslint-disable no-undef */
'use strict';
const tvlift = require('./tvlift');

const { expect } = require('chai');

const datapointMoveCommand = {
    path: 'command.move',
    type: 'state',
    common: {
        name: 'move up (u), down (d)',
        type: 'string',
        role: 'text',
        read: true,
        write: true,
        states: { u: 'Up', d: 'Down' },
    },
};

describe('test tvlift.getDatapoints', () => {
    const result = tvlift.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['tvlift#command.move'])).to.equal(JSON.stringify(datapointMoveCommand));
    });
});

describe('test tvlift.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/state/extended';
        expect(tvlift.getApiUrl('tvliftExtendedState')).to.be.equal(result);
    });

    it('expect false on unsupported call', () => {
        expect(tvlift.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test tvlift.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            tvlift: 'tvlift',
        };

        expect(JSON.stringify(tvlift.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
