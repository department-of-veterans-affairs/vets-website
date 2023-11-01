import React from 'react';
import TestRenderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import { setupI18n, teardownI18n } from '../../../../utils/i18n/i18n';
import Confirmation from '../index';
import { singleAppointment } from '../../../../tests/unit/mocks/mock-appointments';
import PreCheckinConfirmation from '../../../../components/PreCheckinConfirmation';
import { api } from '../../../../api';
import * as useUpdateErrorModule from '../../../../hooks/useUpdateError';
import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';

describe('pre-check-in', () => {
  let i18n;
  beforeEach(() => {
    i18n = setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Confirmation page', () => {
    describe('redux store without friendly name', () => {
      const formData = {
        demographicsUpToDate: 'yes',
        emergencyContactUpToDate: 'yes',
        nextOfKinUpToDate: 'no',
      };

      const store = {
        ...formData,
        appointments: singleAppointment,
        veteranData: { demographics: {} },
        token: '2b87cf8d-aa7d-41a7-805d-d2c0d290a0dc',
      };

      const { v2 } = api;
      const sandbox = sinon.createSandbox();

      afterEach(() => {
        sandbox.restore();
      });

      it('passes the correct props to the pre-checkin confirmation component', () => {
        const testRenderer = TestRenderer.create(
          <CheckInProvider store={store}>
            <Confirmation />
          </CheckInProvider>,
        );
        const testInstance = testRenderer.root;
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.formData
            .demographicsUpToDate,
        ).to.equal('yes');
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.formData
            .emergencyContactUpToDate,
        ).to.equal('yes');
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.formData
            .nextOfKinUpToDate,
        ).to.equal('no');
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.appointments,
        ).to.equal(singleAppointment);
      });

      it('calls updateError if there is a problem with completing pre check in', () => {
        sandbox.stub(v2, 'postPreCheckInData').resolves({
          data: {
            error: 'foo',
          },
        });
        const updateErrorStub = () => {};
        const updateError = sandbox
          .stub(useUpdateErrorModule, 'useUpdateError')
          .returns({ updateErrorStub });
        render(
          <CheckInProvider store={store}>
            <Confirmation />
          </CheckInProvider>,
        );
        sinon.assert.calledOnce(updateError);
      });
      it('calls updateError if there is a problem with the api call', () => {
        sandbox.stub(v2, 'postPreCheckInData').throws();
        const updateErrorStub = () => {};
        const updateError = sandbox
          .stub(useUpdateErrorModule, 'useUpdateError')
          .returns({ updateErrorStub });
        render(
          <CheckInProvider store={store}>
            <Confirmation />
          </CheckInProvider>,
        );
        sinon.assert.calledOnce(updateError);
      });
    });
  });
});
