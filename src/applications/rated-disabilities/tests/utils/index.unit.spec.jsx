import { expect } from 'chai';
import sinon from 'sinon';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';

import { isClientError, isServerError, getData } from '../../util';

describe('rated-disabilities utils', () => {
  describe('getData', () => {
    let apiStub;
    before(() => {
      apiStub = sinon.stub(api, 'apiRequest');
    });
    after(() => {
      apiStub.restore();
    });
    it('should get rated disabilities', () => {
      apiStub.returns(Promise.resolve({ data: [] }));

      getData();
      expect(apiStub.called).to.be.true;
    });
  });
  describe('Error Handling', () => {
    it('should detect a server error', () => {
      expect(isServerError(503)).to.be.true;
      expect(isServerError(400)).to.be.false;
    });

    it('should detect a client error', () => {
      expect(isClientError(404)).to.be.true;
      expect(isClientError(500)).to.be.false;
    });
  });
});
