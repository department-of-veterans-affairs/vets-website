import { expect } from 'chai';
import sinon from 'sinon';

import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import {
  pushToRoute,
  determineErrorMessage,
  determineLabel,
} from '../../utilities/shared';
import { ROUTES } from '../../constants';

const pushSpy = sinon.spy();

const router = {
  push: pushSpy,
};

describe('Shared Utilities', () => {
  describe('pushToRoute', () => {
    it('should correctly push to the given route', () => {
      pushToRoute(SHORT_NAME_MAP.DISCHARGE_MONTH, router);

      expect(pushSpy.firstCall.calledWith(ROUTES.DISCHARGE_MONTH)).to.be.true;
    });
  });

  describe('determineErrorMessage', () => {
    it('should correctly return the right error message', () => {
      expect(determineErrorMessage(SHORT_NAME_MAP.DISCHARGE_YEAR)).to.be.equal(
        'Enter a valid 4 digit year.',
      );
    });
    it('should correctly return the default error message if no mapped value', () => {
      expect(determineErrorMessage(SHORT_NAME_MAP.DISCHARGE_TYPE)).to.be.equal(
        'Select a response.',
      );
    });
  });

  describe('determineLabel', () => {
    it('should correctly return the right label', () => {
      expect(determineLabel(SHORT_NAME_MAP.DISCHARGE_YEAR)).to.be.equal('Year');
    });
    it('should correctly return an empty string if no mapped value', () => {
      expect(determineLabel(SHORT_NAME_MAP.DISCHARGE_TYPE)).to.be.equal('');
    });
  });
});
