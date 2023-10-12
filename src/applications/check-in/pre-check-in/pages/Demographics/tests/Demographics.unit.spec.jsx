import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { multipleAppointments } from '../../../../tests/unit/mocks/mock-appointments';
import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import Demographics from '../index';

const veteranData = {
  demographics: {
    nextOfKin1: {
      name: 'VETERAN,JONAH',
      relationship: 'BROTHER',
      phone: '1112223333',
      workPhone: '4445556666',
      address: {
        street1: '123 Main St',
        street2: 'Ste 234',
        street3: '',
        city: 'Los Angeles',
        county: 'Los Angeles',
        state: 'CA',
        zip: '90089',
        zip4: '',
        country: 'USA',
      },
    },
    mailingAddress: {
      street1: '123 Turtle Trail',
      street2: '',
      street3: '',
      city: 'Treetopper',
      state: 'Tennessee',
      zip: '101010',
    },
    homeAddress: {
      street1: '445 Fine Finch Fairway',
      street2: 'Apt 201',
      city: 'Fairfence',
      state: 'Florida',
      zip: '445545',
    },
    homePhone: '5552223333',
    mobilePhone: '5553334444',
    workPhone: '5554445555',
    emailAddress: 'kermit.frog@sesameenterprises.us',
  },
};

describe('pre-check-in', () => {
  describe('Demographics sub message', () => {
    it('renders the sub-message for an in-person appointment', () => {
      const component = render(
        <CheckInProvider
          store={{ appointments: multipleAppointments, veteranData }}
        >
          <Demographics />
        </CheckInProvider>,
      );
      expect(
        component.queryByText(
          'If you need to make changes, please talk to a staff member when you check in.',
        ),
      ).to.exist;
    });
    it('does not render the sub-message for a phone appointment', () => {
      const phoneAppointments = JSON.parse(
        JSON.stringify(multipleAppointments),
      );
      phoneAppointments[0].kind = 'phone';
      const component = render(
        <CheckInProvider
          store={{ appointments: phoneAppointments, veteranData }}
        >
          <Demographics />
        </CheckInProvider>,
      );
      expect(
        component.queryByText(
          'If you need to make changes, please talk to a staff member when you check in.',
        ),
      ).not.to.exist;
    });
    it('renders the sub-message for an in-person appointment if there are no appointments', () => {
      const component = render(
        <CheckInProvider store={{ appointments: [], veteranData }}>
          <Demographics />
        </CheckInProvider>,
      );
      expect(
        component.queryByText(
          'If you need to make changes, please talk to a staff member when you check in.',
        ),
      ).to.exist;
    });
    it('has a clickable no button', () => {
      const push = sinon.spy();
      const router = { push };
      const component = render(
        <CheckInProvider store={{ veteranData }} router={router}>
          <Demographics />
        </CheckInProvider>,
      );
      const noButton = component.getByTestId('no-button');
      expect(noButton).to.exist;
      noButton.click();
      sinon.assert.calledOnce(push);
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const router = { push };
      const component = render(
        <CheckInProvider store={{ veteranData }} router={router}>
          <Demographics />
        </CheckInProvider>,
      );
      const yesButton = component.getByTestId('yes-button');
      expect(yesButton).to.exist;
      yesButton.click();
      sinon.assert.calledOnce(push);
    });
  });
});
