import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import VAAppointmentSection from '../../components/review/VAAppointmentSection';
import { VHA_FHIR_ID } from '../../utils/constants';

const defaultData = {
  reasonForAppointment: 'routine-follow-up',
  reasonAdditionalInfo: 'additional information',
  calendarData: {
    selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
  },
  vaParent: '983',
  vaFacility: '983GB',
  typeOfCareId: '323',
};

const facility = {
  id: 'var983GB',
  identifier: [
    {
      system: VHA_FHIR_ID,
      value: '984GB',
    },
  ],
  name: 'CHYSHR-Sidney VA Clinic',
  address: {
    city: 'Sidney',
    state: 'NE',
  },
  legacyVAR: {
    institutionTimezone: 'America/Denver',
  },
};

const clinic = {
  clinicFriendlyLocationName: '',
};

const contact = {
  email: 'joeblow@gmail.com',
  phoneNumber: '123456789',
};

describe('VAOS <VAAppointmentSection>', () => {
  describe('Accessibility', () => {
    const data = {
      ...defaultData,
    };
    let tree;

    beforeEach(() => {
      tree = mount(
        <VAAppointmentSection
          data={data}
          facility={facility}
          clinic={clinic}
          contact={contact}
        />,
      );
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should have aria labels to hide HR from screen reader', () => {
      expect(tree.find('hr[aria-hidden="true"]').exists()).to.be.true;
      expect(tree.find('hr[aria-hidden="true"]').length).to.equal(4);
    });
  });
});
