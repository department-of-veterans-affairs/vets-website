import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import * as data from '../../util';
import { getRatedDisabilities } from '../../actions';

describe('rated-disabilities actions', () => {
  describe('Actions', () => {
    describe('getRatedDisabilities', () => {
      let dataStub;
      before(() => {
        dataStub = sinon.stub(data, 'getData');
      });
      after(() => {
        dataStub.restore();
      });
      it('should get rated disabilities', async () => {
        dataStub.returns(Promise.resolve({ data: [] }));
        await waitFor(() => {
          getRatedDisabilities();
        });

        expect(dataStub.called).to.be.true;
      });
    });
  });
});
