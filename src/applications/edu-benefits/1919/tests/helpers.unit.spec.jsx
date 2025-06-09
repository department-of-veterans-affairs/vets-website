import { expect } from 'chai';
import sinon from 'sinon';
import {
  arrayBuilderOptions,
  cardDescription,
  showConflictOfInterestText,
} from '../helpers';

describe('helpers ', () => {
  describe('cardDescription', () => {
    it('should return firth and last name from full name', () => {
      expect(
        cardDescription({
          allProprietarySchoolsEmployeeInfo: {
            first: 'John',
            last: 'Doe',
          },
        }),
      ).to.equal('John Doe');
    });
    it('should return "this individual" when first or last name is missing', () => {
      expect(
        cardDescription({
          allProprietarySchoolsEmployeeInfo: {
            first: '',
            last: 'Doe',
          },
        }),
      ).to.equal('this individual');

      expect(
        cardDescription({
          allProprietarySchoolsEmployeeInfo: {
            first: 'John',
            last: '',
          },
        }),
      ).to.equal('this individual');

      expect(
        cardDescription({
          allProprietarySchoolsEmployeeInfo: {},
        }),
      ).to.equal('this individual');
    });
  });
  describe('arrayBuilderOptions', () => {
    it('should return correct card description using getItemName', () => {
      const item = {
        allProprietarySchoolsEmployeeInfo: {
          first: 'Jane',
          last: 'Smith',
          title: 'Director',
        },
      };
      expect(arrayBuilderOptions.text.getItemName(item)).to.equal('Jane Smith');
    });

    it('should return correct card description using cardDescription', () => {
      const item = {
        allProprietarySchoolsEmployeeInfo: {
          first: 'Jane',
          last: 'Smith',
          title: 'Director',
        },
      };
      expect(arrayBuilderOptions.text.cardDescription(item)).to.equal(
        'Director',
      );
    });
  });
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
});
