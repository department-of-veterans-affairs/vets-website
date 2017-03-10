import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ErrorableCurrentOrPastDate from '../../../../src/js/common/components/form-elements/ErrorableCurrentOrPastDate';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<ErrorableCurrentOrPastDate>', () => {
  it('passes in failed validation object', () => {
    const date = {
      day: makeField('3'),
      month: makeField('5'),
      year: makeField('2100')
    };
    date.year.dirty = true;
    date.month.dirty = true;
    date.day.dirty = true;

    const tree = SkinDeep.shallowRender(
      <ErrorableCurrentOrPastDate date={date} onValueChange={(_update) => {}}/>);

    expect(tree.props.validation.valid).to.be.false;
    expect(tree.props.validation.message).to.equal('Please provide a valid date in the past');
  });
});

