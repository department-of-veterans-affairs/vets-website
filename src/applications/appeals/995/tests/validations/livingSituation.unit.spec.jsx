import { expect } from 'chai';

import {
  livingSituationChoices,
  livingSituationError,
} from '../../content/livingSituation';

import { livingSituationNone } from '../../validations/livingSituation';

describe('livingSituationNone', () => {
  let errorList = [];
  const errors = {
    errorList,
    addError: message => errorList.push(message),
  };
  const keys = Object.keys(livingSituationChoices);

  beforeEach(() => {
    errorList = [];
  });

  it('should not have an error if only "none" is set', () => {
    const data = { livingSituation: { none: true } };
    livingSituationNone(errors, {}, data);

    expect(errorList.length).to.eq(0);
  });
  it('should not have an error if all but "none" is set', () => {
    const livingSituation = keys
      .filter(key => key !== 'none')
      .reduce((list, key) => ({ ...list, [key]: true }), {});
    livingSituationNone(errors, {}, { livingSituation });

    expect(errorList.length).to.eq(0);
  });
  it('should return an error if "none" and any other choice is set', () => {
    const data = { livingSituation: { none: true, [keys[0]]: true } };
    livingSituationNone(errors, {}, data);

    expect(errorList[0]).to.eq(livingSituationError);
  });
});
