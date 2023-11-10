import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import Demographics from '../Demographics';

describe('check in', () => {
  describe('Demographics', () => {
    const veteranData = {
      demographics: {
        mailingAddress: {
          street1: '123 Turtle Trail',
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
    it('renders', () => {
      const component = render(
        <CheckInProvider store={{ veteranData }}>
          <Demographics />
        </CheckInProvider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.queryByText('Not available')).to.be.null;
    });

    it('shows "Not available" for unavailable fields', () => {
      const noDataVeteranData = {
        demographics: {
          homeAddress: veteranData.demographics.homeAddress,
          homePhone: veteranData.demographics.homePhone,
          workPhone: veteranData.demographics.workPhone,
        },
      };

      const component = render(
        <CheckInProvider store={{ veteranData: noDataVeteranData }}>
          <Demographics />
        </CheckInProvider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('555-222-3333')).to.exist;
      expect(component.queryByText('123 Turtle Trail')).to.be.null;
      expect(component.queryByText('5553334444')).to.be.null;
      expect(component.getAllByText('Not available')).to.exist;
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
