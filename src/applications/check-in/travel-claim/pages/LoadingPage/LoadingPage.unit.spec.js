import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as useGetCheckInDataModule from '../../../hooks/useGetCheckInData';
import * as useUpdateErrorModule from '../../../hooks/useUpdateError';
import LoadingPage from '.';

describe('travel-claim', () => {
  const store = {
    formPages: ['loading-appointments', 'travel-pay'],
    app: 'travelClaim',
  };
  describe('LoadingPage', () => {
    it('routes to next page with eligible appointments', () => {
      const push = sinon.spy();
      const sandbox = sinon.createSandbox();
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        checkInDataError: false,
        isComplete: true,
      });
      store.eligibleToFile = [
        {
          stationNo: '500',
        },
      ];
      render(
        <CheckInProvider
          store={store}
          router={{
            push,
            currentPage: '/loading-appointments',
            params: {},
          }}
        >
          <LoadingPage />
        </CheckInProvider>,
      );
      expect(push.calledWith('travel-pay')).to.be.true;
      sandbox.restore();
    });
    it('routes to an error page on fetch error', () => {
      const sandbox = sinon.createSandbox();
      const updateErrorSpy = sinon.spy();
      sandbox.stub(useUpdateErrorModule, 'useUpdateError').returns({
        updateError: updateErrorSpy,
      });
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        checkInDataError: true,
      });
      render(
        <CheckInProvider store={store}>
          <LoadingPage />
        </CheckInProvider>,
      );
      expect(updateErrorSpy.calledOnce).to.be.true;
      sandbox.restore();
    });
    it('routes to error with already filed with no eligible appointments', () => {
      const sandbox = sinon.createSandbox();
      const updateErrorSpy = sinon.spy();
      sandbox.stub(useUpdateErrorModule, 'useUpdateError').returns({
        updateError: updateErrorSpy,
      });
      sandbox.stub(useGetCheckInDataModule, 'useGetCheckInData').returns({
        checkInDataError: false,
        isComplete: true,
      });
      store.eligibleToFile = [];
      render(
        <CheckInProvider store={store}>
          <LoadingPage />
        </CheckInProvider>,
      );
      expect(updateErrorSpy.calledOnce).to.be.true;
      expect(updateErrorSpy.calledWith('already-filed-claim')).to.be.true;
      sandbox.restore();
    });
  });
});
