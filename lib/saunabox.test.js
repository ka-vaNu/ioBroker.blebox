/* eslint-disable no-undef */
'use strict';
const saunabox = require('./saunabox');

const { expect } = require('chai');

const datapointDesiredTemp = {
    path: 'command.desiredTemp',
    type: 'state',
    common: {
        name: 'temperature in celsius. It should be value between max&min from settings',
        type: 'number',
        role: 'value',
        read: true,
        write: true,
    },
};

describe('test saunabox.getDatapoints', () => {
    const result = saunabox.datapoints;
    it(`expect saunabox#command.desiredTemp object`, () => {
        expect(JSON.stringify(result['saunabox#command.desiredTemp'])).to.equal(JSON.stringify(datapointDesiredTemp));
    });
});

describe('test saunabox.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/api/heat/extended/state';
        expect(saunabox.getApiUrl('saunaboxExtendedState')).to.be.equal(result);
    });
    it('expect false on unsupported call', () => {
        expect(saunabox.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test saunabox.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            saunabox: 'saunabox',
        };

        expect(JSON.stringify(saunabox.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
