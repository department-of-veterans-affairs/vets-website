import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { getVARequestMock, getVAFacilityMock } from '../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../mocks/helpers';

import reducers from '../../reducers';
import FutureAppointmentsList from '../../components/FutureAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: express care requests', () => {
  describe('when shown in Upcoming appointments tab', () => {
    it('should show appropriate information', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        purposeOfVisit: 'New Issue',
        bestTimetoCall: ['Morning'],
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        typeOfCareId: 'CR1',
        reasonForVisit: 'Back pain',
        facility: {
          ...appointment.attributes.facility,
          facilityCode: '983GC',
        },
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });
      const facility = {
        id: 'vha_442GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '442GC',
          name: 'Cheyenne VA Medical Center',
          address: {
            physical: {
              zip: '82001-5356',
              city: 'Cheyenne',
              state: 'WY',
              address1: '2360 East Pershing Boulevard',
            },
          },
          phone: {
            main: '307-778-7550',
          },
        },
      };
      mockFacilitiesFetch('vha_442GC', [facility]);

      const { baseElement, findByText } = renderInReduxProvider(
        <FutureAppointmentsList />,
        {
          initialState,
          reducers,
        },
      );

      const showMoreButton = await findByText(/Cheyenne VA Medical Center/i);
      expect(baseElement).not.to.contain.text('in the morning');
      expect(baseElement).not.to.contain.text('Back pain');
      expect(baseElement).not.to.contain.text('Cheyenne, WY');
      expect(baseElement).not.to.contain.text('2360 East Pershing Boulevard');

      fireEvent.click(showMoreButton);
      await findByText(/Reason for appointment/i);

      expect(baseElement).to.contain.text('Call morning');
      expect(baseElement).to.contain.text('Back pain');
      expect(baseElement).to.contain.text('Your contact details');
      expect(baseElement).to.contain.text('patient.test@va.gov');
      expect(baseElement).to.contain.text('5555555566');
    });
  });
});
