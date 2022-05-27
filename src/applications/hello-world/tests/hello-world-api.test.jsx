import { expect } from 'chai';
import sinon from 'sinon';
import {getMessage2} from '../api/HelloWorldApi';
import * as apiHelpers from '../../../platform/utilities/api/index';

describe('HelloWorldApi', () => {
    it('should call apiRequest', async () => {
        const apiRequest = sinon.stub(apiHelpers, 'apiRequest');
        await getMessage2();
        expect(apiRequest.called).to.be.true;
    });

    it('should return a value', async () => {
        const res = await getMessage2();
        expect(res.message).to.equal('Hello World');
        expect(res.status).to.equal('ok');
    });
});