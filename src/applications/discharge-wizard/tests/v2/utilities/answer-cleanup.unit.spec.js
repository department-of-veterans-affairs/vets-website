import { expect } from 'chai';
import sinon from 'sinon';
import { cleanUpAnswers } from '../../../utilities/answer-cleanup';
import {
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';

const { DISCHARGE_YEAR } = SHORT_NAME_MAP;

const { ARMY } = RESPONSES;

describe('answer cleanup utilities', () => {
  it('should call the updateCleanedFormStore action with the correct arguments', () => {
    const responsesInStore = {
      SERVICE_BRANCH: ARMY,
      DISCHARGE_YEAR: 2009,
      DISCHARGE_MONTH: '2',
    };
    const updateCleanedFormStoreSpy = sinon.spy();
    const currentQuestionName = DISCHARGE_YEAR;

    cleanUpAnswers(
      responsesInStore,
      updateCleanedFormStoreSpy,
      currentQuestionName,
    );

    expect(
      updateCleanedFormStoreSpy.calledWith({
        SERVICE_BRANCH: ARMY,
        DISCHARGE_YEAR: 2009,
        DISCHARGE_MONTH: null,
        FAILURE_TO_EXHAUST: null,
      }),
    ).to.be.true;
  });
});
