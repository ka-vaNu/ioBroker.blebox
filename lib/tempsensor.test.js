/* eslint-disable no-undef */
'use strict';
const tempsensor = require('./tempsensor');

const { expect } = require('chai');

const datapointElapsedTimeS = {
    path: 'tempSensor.sensors.0.elapsedTimeS',
    type: 'state',
    common: {
        name: 'Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data',
        type: 'number',
        role: 'value',
        read: true,
        write: false,
    },
};

describe('test tempsensor.getDatapoints', () => {
    const result = tempsensor.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['tempsensor#tempSensor.sensors[0].elapsedTimeS'])).to.equal(
            JSON.stringify(datapointElapsedTimeS),
        );
    });
});

describe('test tempsensor.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/api/tempsensor/state';
        expect(tempsensor.getApiUrl('tempsensorExtendedState')).to.be.equal(result);
    });
    it('expect false on unsupported call', () => {
        expect(tempsensor.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test tempsensor.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            tempsensor: 'tempsensor',
        };

        expect(JSON.stringify(tempsensor.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
