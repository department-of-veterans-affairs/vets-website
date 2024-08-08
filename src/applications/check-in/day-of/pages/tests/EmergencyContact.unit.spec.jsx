import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import EmergencyContact from '../EmergencyContact';

describe('check in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('EmergencyContact', () => {
    const veteranData = {
      demographics: {
        emergencyContact: {
          address: {
            street1: '445 Fine Finch Fairway',
            street2: 'Apt 201',
            city: 'Fairfence',
            state: 'Florida',
            zip: '445545',
          },
          name: 'Leslie',
          relationship: 'Aunt',
          phone: '5553334444',
          workPhone: '5554445555',
        },
      },
    };

    it('renders', () => {
      const component = render(
        <CheckInProvider store={{ veteranData }}>
          <EmergencyContact />
        </CheckInProvider>,
      );

      expect(component.getByText('Is this your current emergency contact?')).to
        .exist;
    });

    it('shows emergency contact fields, with message for empty data', () => {
      const updatedVeteranData = {
        demographics: {
          emergencyContact: {
            ...veteranData.demographics.emergencyContact,
            phone: '',
            relationship: '',
          },
        },
      };
      const component = render(
        <CheckInProvider store={{ veteranData: updatedVeteranData }}>
          <EmergencyContact />
        </CheckInProvider>,
      );

      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('Leslie')).to.exists;
      expect(component.queryByText('555-333-4444')).to.be.null;
      expect(component.queryByText('Aunt')).to.be.null;
      expect(component.getAllByText('Not available').length).to.equal(2);
    });

    it('has a clickable no button', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider store={{ veteranData }} router={{ push }}>
          <EmergencyContact />
        </CheckInProvider>,
      );

      component.getByTestId('no-button').click();
      expect(push.calledOnce).to.be.true;
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider store={{ veteranData }} router={{ push }}>
          <EmergencyContact />
        </CheckInProvider>,
      );

      component.getByTestId('yes-button').click();
      expect(push.calledOnce).to.be.true;
    });
  });
});
