import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import Confirmation from '../index';
import { URLS } from '../../../../utils/navigation';
import { createMockRouter } from '../../../../tests/unit/mocks/router';
import * as useSendDemographicsFlagsModule from '../../../../hooks/useSendDemographicsFlags';
import { api } from '../../../../api';

describe('check in', () => {
  describe('Confirmation', () => {
    let mockStore = {};
    beforeEach(() => {
      mockStore = {
        appointments: [
          {
            clinicPhone: '555-867-5309',
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
            appointmentIen: '1111',
            stationNo: '1111',
          },
        ],
      };
    });
    it('calls jump to page if appointment does not exist', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        params: {
          appointmentId: '9999-9999',
        },
        push,
      });
      render(
        <CheckInProvider store={mockStore} router={mockRouter}>
          <Confirmation />
        </CheckInProvider>,
      );
      expect(push.calledOnce).to.be.true;
      expect(push.calledWith({ pathname: URLS.APPOINTMENTS })).to.be.true;
    });
    it('calls jump to page if appointment does not exist', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        params: {
          appointmentId: '1111-1111',
        },
        push,
      });
      const component = render(
        <CheckInProvider store={mockStore} router={mockRouter}>
          <Confirmation />
        </CheckInProvider>,
      );
      expect(push.calledOnce).to.be.false;
      expect(push.calledWith({ pathname: URLS.APPOINTMENTS })).to.be.false;
      expect(component.getByTestId('loading-indicator')).to.exist;
    });
    it('calls send check in data', () => {
      const mockRouter = createMockRouter({
        params: {
          appointmentId: '1111-1111',
        },
      });
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      sandbox.stub(v2, 'postCheckInData').resolves({});

      const useSendDemographicsFlagsStub = sinon
        .stub(useSendDemographicsFlagsModule, 'useSendDemographicsFlags')
        .returns({
          isComplete: true,
          demographicsFlagsEmpty: false,
        });

      render(
        <CheckInProvider store={mockStore} router={mockRouter}>
          <Confirmation />
        </CheckInProvider>,
      );

      sandbox.assert.calledOnce(v2.postCheckInData);
      sandbox.restore();
      // Restore the hook
      useSendDemographicsFlagsStub.restore();
    });
    it('successfully calls post check in data', async () => {
      const mockRouter = createMockRouter({
        params: {
          appointmentId: '1111-1111',
        },
      });
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      sandbox.stub(v2, 'postCheckInData').resolves({
        status: 200,
      });

      const useSendDemographicsFlagsStub = sinon
        .stub(useSendDemographicsFlagsModule, 'useSendDemographicsFlags')
        .returns({
          isComplete: true,
          demographicsFlagsEmpty: false,
        });

      const component = render(
        <CheckInProvider store={mockStore} router={mockRouter}>
          <Confirmation />
        </CheckInProvider>,
      );

      sandbox.assert.calledOnce(v2.postCheckInData);
      sandbox.restore();

      await waitFor(() => {
        expect(component.getByTestId('check-in-confirmation-component')).to
          .exist;
      });
      useSendDemographicsFlagsStub.restore();
    });
    it('fails call to post check in data', async () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        params: {
          appointmentId: '1111-1111',
        },
        push,
      });
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      sandbox.stub(v2, 'postCheckInData').resolves({
        status: 500,
      });

      const useSendDemographicsFlagsStub = sinon
        .stub(useSendDemographicsFlagsModule, 'useSendDemographicsFlags')
        .returns({
          isComplete: true,
          demographicsFlagsEmpty: false,
        });

      const component = render(
        <CheckInProvider store={mockStore} router={mockRouter}>
          <Confirmation />
        </CheckInProvider>,
      );

      sandbox.assert.calledOnce(v2.postCheckInData);
      await waitFor(() => {
        expect(component.queryByTestId('check-in-confirmation-component')).not
          .to.exist;
      });
      sandbox.restore();
      useSendDemographicsFlagsStub.restore();
    });
    it('fails call to post check in data', async () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        params: {
          appointmentId: '1111-1111',
        },
        push,
      });
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      sandbox.stub(v2, 'postCheckInData').throws(new Error('Error!'));

      const useSendDemographicsFlagsStub = sinon
        .stub(useSendDemographicsFlagsModule, 'useSendDemographicsFlags')
        .returns({
          isComplete: true,
          demographicsFlagsEmpty: false,
        });

      const component = render(
        <CheckInProvider store={mockStore} router={mockRouter}>
          <Confirmation />
        </CheckInProvider>,
      );
      sandbox.assert.calledOnce(v2.postCheckInData);
      await waitFor(() => {
        expect(component.queryByTestId('check-in-confirmation-component')).not
          .to.exist;
      });
      sandbox.restore();
      useSendDemographicsFlagsStub.restore();
    });
  });
});
