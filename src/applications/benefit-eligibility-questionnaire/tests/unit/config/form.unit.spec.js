import { expect } from 'chai';
import { isOnReviewPage, isOnConfirmationPage } from '../../../config/form';

describe('Questionnaire Form', () => {
  describe('isOnReviewPage', () => {
    it('should return true if it is the review page', () => {
      const input = {
        pathname: '/review-and-submit',
      };
      expect(isOnReviewPage(input)).to.be.true;
    });
    it('should return false if it is not the review page', () => {
      const input = {
        pathname: '/introduction',
      };
      expect(isOnReviewPage(input)).to.be.false;
    });
  });

  describe('isOnConfirmationPage', () => {
    it('should return true if it is the confirmation page', () => {
      const input = {
        pathname: '/confirmation',
      };
      expect(isOnConfirmationPage(input)).to.be.true;
    });
    it('should return false if it is not the confirmation page', () => {
      const input = {
        pathname: '/introduction',
      };
      expect(isOnConfirmationPage(input)).to.be.false;
    });
  });
});
