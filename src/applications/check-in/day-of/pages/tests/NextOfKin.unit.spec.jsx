import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import NextOfKin from '../NextOfKin';

describe('check in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Next of Kin', () => {
    const veteranData = {
      demographics: {
        nextOfKin1: {
          address: {
            street1: '445 Fine Finch Fairway',
            street2: 'Apt 201',
            city: 'Fairfence',
            state: 'Florida',
            zip: '445545',
          },
          name: 'Kin, Next',
          relationship: 'child',
          phone: '5553334444',
          workPhone: '5554445555',
        },
      },
    };

    it('renders', () => {
      const component = render(
        <CheckInProvider store={{ veteranData }}>
          <NextOfKin />
        </CheckInProvider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.queryByText('Not available')).to.be.null;
    });
    it('shows "Not available" for unavailable fields', () => {
      const updatedVeteranData = {
        demographics: {
          nextOfKin1: {
            ...veteranData.demographics.nextOfKin1,
            name: '',
            relationship: '',
            workPhone: '',
          },
        },
      };
      const component = render(
        <CheckInProvider store={{ veteranData: updatedVeteranData }}>
          <NextOfKin />
        </CheckInProvider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('555-333-4444')).to.exist;
      expect(component.queryByText('Kin, Next')).to.be.null;
      expect(component.queryByText('5554445555')).to.be.null;
      expect(component.getAllByText('Not available')).to.exist;
    });

    it('has a clickable no button', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider store={{ veteranData }} router={{ push }}>
          <NextOfKin />
        </CheckInProvider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('no-button').click();
      sinon.assert.calledOnce(push);
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider store={{ veteranData }} router={{ push }}>
          <NextOfKin />
        </CheckInProvider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
      sinon.assert.calledOnce(push);
    });

    it('has a clickable yes button with update page enabled', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider store={{ veteranData }} router={{ push }}>
          <NextOfKin />
        </CheckInProvider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
      sinon.assert.calledOnce(push);
    });
    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider store={{ veteranData }} router={{ push }}>
          <NextOfKin />
        </CheckInProvider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
      sinon.assert.calledOnce(push);
    });
  });
});
