import { expect } from 'chai';
import {
  concatObservationInterpretations,
  dateFormat,
  getObservationValueWithUnits,
  getReactions,
  nameFormat,
  processList,
} from '../../util/helpers';

describe('Name formatter', () => {
  it('formats a name with a first, middle, last, and suffix', () => {
    const nameObj = {
      first: 'John',
      middle: 'Robert',
      last: 'Doe',
      suffix: 'Jr.',
    };
    const formattedName = nameFormat(nameObj);
    expect(formattedName).to.eq('Doe, John Robert, Jr.');
  });
});

describe('Date formatter', () => {
  it('formats a date with no specified format', () => {
    const timeStamp = '2023-09-29T11:04:31.316-04:00';
    const formattedDate = dateFormat(timeStamp);
    expect(formattedDate).to.contain('September');
  });
});

describe('getReactions', () => {
  it('returns an empty array if the record passed has no reactions property', () => {
    const record = {};
    const reactions = getReactions(record);
    expect(reactions.length).to.eq(0);
  });
});

describe('concatObservationInterpretations', () => {
  it('returns interpretation.text as is if it is not found in the interpretationMap', () => {
    const record = { interpretation: [{ text: 'asdf' }] };
    const textFields = concatObservationInterpretations(record);
    expect(textFields).to.eq('asdf');
  });
});

describe('getObservationValueWithUnits', () => {
  it('returns null if observation.valueQuantity does not exist', () => {
    const observation = {};
    const textFields = getObservationValueWithUnits(observation);
    expect(textFields).to.eq(null);
  });
});

describe('processList', () => {
  it('returns an array of strings, separated by a period and a space, when there is more than 1 item in the list', () => {
    const list = ['a', 'b', 'c'];
    const result = processList(list);
    expect(result).to.eq('a. b. c');
  });
  it('returns EMPTY_FIELD value if there are no items in the list', () => {
    const list = [];
    const result = processList(list);
    expect(result).to.eq('None noted');
  });
});
