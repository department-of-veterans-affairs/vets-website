import { expect } from 'chai';

import { QUESTION_IDS, getQuestionTextById } from '../questionnaire.questions';

describe('health care questionnaire -- constants -- get questionnaire text by id', () => {
  it('returns undefined on not found', () => {
    const text = getQuestionTextById('not-valid');
    expect(text).equal(undefined);
  });
  it('reason for visit', () => {
    const text = getQuestionTextById(QUESTION_IDS.REASON_FOR_VISIT);
    expect(text).equal('What is the reason for this appointment?');
  });
  it('reason for visit description', () => {
    const text = getQuestionTextById(QUESTION_IDS.REASON_FOR_VISIT_DESCRIPTION);
    expect(text).equal(
      'Are there any additional details you’d like to share with your provider about this appointment?',
    );
  });
  it('life events', () => {
    const text = getQuestionTextById(QUESTION_IDS.LIFE_EVENTS);
    expect(text).equal(
      'Are there any other concerns or changes in your life that are affecting you or your health? (For example, a marriage, divorce, new baby, change in your job, retirement, or other medical conditions)',
    );
  });
  it('addition questions', () => {
    const text = getQuestionTextById(QUESTION_IDS.ADDITIONAL_QUESTIONS);
    expect(text).equal(
      'Do you have a question you want to ask your provider? Please enter your most important question first.',
    );
  });
});
