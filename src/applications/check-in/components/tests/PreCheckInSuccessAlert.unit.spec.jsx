import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { singleAppointment } from '../../tests/unit/mocks/mock-appointments';
import PreCheckInSuccessAlert from '../PreCheckInSuccessAlert';
import * as useSendPreCheckInDataModule from '../../hooks/useSendPreCheckInData';
import { api } from '../../api';
import * as useUpdateErrorModule from '../../hooks/useUpdateError';

describe('unified check-in experience', () => {
  describe('PreCheckInSuccessAlert', () => {
    const singlePhoneAppointment = [...singleAppointment];
    singlePhoneAppointment[0] = {
      ...singlePhoneAppointment[0],
      kind: 'phone',
    };
    const sandbox = sinon.createSandbox();
    const { v2 } = api;
    let store;
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      store = {
        token: '2b87cf8d-aa7d-41a7-805d-d2c0d290a0dc',
        demographicsUpToDate: 'yes',
        emergencyContactUpToDate: 'yes',
        nextOfKinUpToDate: 'yes',
      };
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('displays the pre-check-in-success-alert if the app is pre-check-in and pre check in is complete', () => {
      const mockstore = {
        appointments: singleAppointment,
        app: 'preCheckIn',
      };
      const useSendPreCheckInDataStub = sinon
        .stub(useSendPreCheckInDataModule, 'useSendPreCheckInData')
        .returns({
          isLoading: false,
        });
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      expect(getByTestId('pre-check-in-success-alert')).to.exist;
      useSendPreCheckInDataStub.restore();
    });
    it('displays the correct success message for in person appointments', () => {
      const mockstore = {
        appointments: singleAppointment,
        app: 'preCheckIn',
      };
      const useSendPreCheckInDataStub = sinon
        .stub(useSendPreCheckInDataModule, 'useSendPreCheckInData')
        .returns({
          isLoading: false,
        });
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      expect(getByTestId('pre-check-in-success-alert')).to.exist;
      expect(getByTestId('success-message')).to.contain.text(
        'You can check-in with your smartphone once you arrive for your appointment on',
      );
      useSendPreCheckInDataStub.restore();
    });
    it('displays the correct success message for phone appointments', () => {
      const mockstore = {
        appointments: singlePhoneAppointment,
        app: 'preCheckIn',
      };
      const useSendPreCheckInDataStub = sinon
        .stub(useSendPreCheckInDataModule, 'useSendPreCheckInData')
        .returns({
          isLoading: false,
        });
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      expect(getByTestId('pre-check-in-success-alert')).to.exist;
      expect(getByTestId('success-message')).to.have.text(
        'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
      );
      useSendPreCheckInDataStub.restore();
    });
    it('displays the loading spinner if isLoading is true', () => {
      const mockstore = {
        appointments: singlePhoneAppointment,
        app: 'preCheckIn',
      };
      const useSendPreCheckInDataStub = sinon
        .stub(useSendPreCheckInDataModule, 'useSendPreCheckInData')
        .returns({
          isLoading: true,
        });
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      expect(getByTestId('loading-indicator')).to.exist;
      useSendPreCheckInDataStub.restore();
    });
    it('calls update error if there is a problem completing pre-check-in', () => {
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
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      sandbox.assert.calledOnce(updateError);
    });
    it('calls update error in the catch block', () => {
      sandbox.stub(v2, 'postPreCheckInData').throws({
        error: 'foo',
      });
      const updateErrorStub = () => {};
      const updateError = sandbox
        .stub(useUpdateErrorModule, 'useUpdateError')
        .returns({ updateErrorStub });
      render(
        <CheckInProvider store={store}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      sandbox.assert.calledOnce(updateError);
    });
    it('alert is visable on load', () => {
      const mockstore = {
        appointments: singleAppointment,
        app: 'preCheckIn',
      };
      const useSendPreCheckInDataStub = sinon
        .stub(useSendPreCheckInDataModule, 'useSendPreCheckInData')
        .returns({
          isLoading: false,
        });
      const screen = render(
        <CheckInProvider store={mockstore}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      expect(
        screen.getByTestId('pre-check-in-success-alert'),
      ).to.have.attribute('visible', 'true');
      useSendPreCheckInDataStub.restore();
    });
    it('alert is hidden when value in context is false', () => {
      const mockstore = {
        appointments: singleAppointment,
        app: 'preCheckIn',
        additionalContext: { showPreCheckInSuccess: false },
      };
      const useSendPreCheckInDataStub = sinon
        .stub(useSendPreCheckInDataModule, 'useSendPreCheckInData')
        .returns({
          isLoading: false,
        });
      const screen = render(
        <CheckInProvider store={mockstore}>
          <PreCheckInSuccessAlert />
        </CheckInProvider>,
      );
      expect(
        screen.getByTestId('pre-check-in-success-alert'),
      ).to.have.attribute('visible', 'false');
      useSendPreCheckInDataStub.restore();
    });
  });
});
