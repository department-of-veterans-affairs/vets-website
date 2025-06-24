import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  allProprietaryProfitConflictsArrayOptions,
  getCardTitle,
  getCardDescription,
  showConflictOfInterestText,
  getTitle,
} from '../helpers';

describe('helpers ', () => {
  describe('showConflictOfInterestText', () => {
    it('should push event to dataLayer', () => {
      const dataLayerPushSpy = sinon.spy();

      global.window = { dataLayer: { push: dataLayerPushSpy } };
      showConflictOfInterestText();

      expect(dataLayerPushSpy.calledOnce).to.be.true;
      expect(dataLayerPushSpy.firstCall.args[0]).to.deep.equal({
        event: 'edu-1919--form-help-text-clicked',
        'help-text-label': 'Review the conflict of interest policy',
      });
    });
  });

  describe('getCardTitle', () => {
    it('should return first and last name from full name', () => {
      expect(
        getCardTitle({
          certifyingOfficial: {
            first: 'John',
            last: 'Doe',
          },
        }),
      ).to.equal('John Doe');
    });

    it('should handle when the first or last name is missing', () => {
      expect(
        getCardTitle({
          certifyingOfficial: {
            first: '',
            last: 'Doe',
          },
        }),
      ).to.equal('Certifying Doe');

      expect(
        getCardTitle({
          certifyingOfficial: {
            first: 'John',
            last: '',
          },
        }),
      ).to.equal('John Official');

      expect(
        getCardTitle({
          certifyingOfficial: {},
        }),
      ).to.equal('Certifying Official');
    });

    it('should handle when the given item is null', () => {
      expect(getCardTitle(null)).to.equal(null);
    });
  });

  describe('getCardDescription', () => {
    it('should return a full description of details from the given card details', () => {
      const card = {
        certifyingOfficial: { title: 'Official' },
        fileNumber: '123456AB',
        enrollmentPeriod: {
          from: '2024-03-10',
          to: '2025-04-27',
        },
      };

      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-title').innerHTML).to.include('Official');
      expect(getByTestId('card-file-number').innerHTML).to.include('123456AB');
      expect(getByTestId('card-enrollment-period').innerHTML).to.include(
        '03/10/2024 - 04/27/2025',
      );
    });

    it('should handle when each card field is empty', () => {
      const card = {
        certifyingOfficial: { title: '' },
        fileNumber: '',
        enrollmentPeriod: {
          from: '',
          to: '',
        },
      };

      const description = getCardDescription(card);
      const { getByTestId, queryByTestId } = render(description);

      expect(getByTestId('card-title').innerHTML).to.include('Title');
      expect(getByTestId('card-file-number').innerHTML).to.include(
        'File number',
      );
      expect(queryByTestId('card-enrollment-period')).to.equal(null);
    });
  });

  describe('allProprietaryProfitConflictsArrayOptions', () => {
    it('should return correct card description using getItemName', () => {
      const item = {
        certifyingOfficial: {
          first: 'Jane',
          last: 'Smith',
          title: 'Director',
        },
      };
      expect(
        allProprietaryProfitConflictsArrayOptions.text.getItemName(item),
      ).to.equal('Jane Smith');
    });

    it('should have text fields set for custom messages', () => {
      expect(
        allProprietaryProfitConflictsArrayOptions.text.cancelAddYes,
      ).to.equal('Yes, cancel');
      expect(
        allProprietaryProfitConflictsArrayOptions.text.cancelAddNo,
      ).to.equal('No, continue adding information');
      expect(
        allProprietaryProfitConflictsArrayOptions.text.summaryTitle,
      ).to.equal(
        'Review the individuals with a potential conflict of interest that receive VA educational benefits',
      );
    });
  });

  describe('getTitle', () => {
    it('should return "Certifying official" for certifyingOfficial role', () => {
      const role = { level: 'certifyingOfficial' };
      expect(getTitle(role)).to.equal('Certifying official');
    });

    it('should return "Owner" for owner role', () => {
      const role = { level: 'owner' };
      expect(getTitle(role)).to.equal('Owner');
    });

    it('should return "Officer" for officer role', () => {
      const role = { level: 'officer' };
      expect(getTitle(role)).to.equal('Officer');
    });

    it('should return custom title when other is provided', () => {
      const role = { other: 'Custom Title' };
      expect(getTitle(role)).to.equal('Custom Title');
    });

    it('should prioritize other over level when both are provided', () => {
      const role = { level: 'owner', other: 'Custom Title' };
      expect(getTitle(role)).to.equal('Custom Title');
    });

    it('should return undefined for unknown role level', () => {
      const role = { level: 'unknown' };
      expect(getTitle(role)).to.equal(undefined);
    });

    it('should handle empty role object', () => {
      const role = {};
      expect(getTitle(role)).to.equal(undefined);
    });
  });
});
