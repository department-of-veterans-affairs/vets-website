import { expect } from 'chai';
import { processList } from '../../../util/helpers';
import { FIELD_NONE_NOTED } from '../../../util/constants';

describe('processList function', () => {
  it('returns an array of strings, separated by a period and a space, when there is more than 1 item in the list', () => {
    const list = ['a', 'b', 'c'];
    const result = processList(list);
    expect(result).to.eq('a. b. c');
  });
  it('returns the single item as string, when there is only 1 item in the list', () => {
    const list = ['a'];
    const result = processList(list);
    expect(result).to.eq('a');
  });
  it('returns FIELD_NONE_NOTED value if there are no items in the list', () => {
    const list = [];
    const result = processList(list);
    expect(result).to.eq(FIELD_NONE_NOTED);
  });
});
