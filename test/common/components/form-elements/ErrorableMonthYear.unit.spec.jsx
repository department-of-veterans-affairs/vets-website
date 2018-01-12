import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ErrorableMonthYear from '../../../../src/js/common/components/form-elements/ErrorableMonthYear';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<ErrorableMonthYear>', () => {
  it('renders input elements', () => {
    const date = {
      month: makeField(12),
      year: makeField(2010)
    };
    const tree = SkinDeep.shallowRender(
      <ErrorableMonthYear date={date} onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('ErrorableNumberInput')).to.have.lengthOf(1);
    expect(tree.everySubTree('ErrorableSelect')).to.have.lengthOf(1);
  });
  it('displays required message', () => {
    const date = {
      month: makeField(''),
      year: makeField('')
    };
    date.year.dirty = true;
    date.month.dirty = true;

    const tree = SkinDeep.shallowRender(
      <ErrorableMonthYear required date={date} onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Error Please provide a response');
  });
  it('displays invalid message', () => {
    const date = {
      month: makeField(''),
      year: makeField('1890')
    };
    date.year.dirty = true;
    date.month.dirty = true;

    const tree = SkinDeep.shallowRender(
      <ErrorableMonthYear date={date} onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Error Please provide a valid month and/or year');
  });
  it('does not show invalid message for partial date', () => {
    const date = {
      month: makeField('12'),
      year: makeField('')
    };
    date.year.dirty = true;
    date.month.dirty = true;

    const tree = SkinDeep.shallowRender(
      <ErrorableMonthYear date={date} onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-input-error')).to.be.empty;
  });
  it('displays custom message', () => {
    const date = {
      month: makeField(''),
      year: makeField('2010')
    };
    date.year.dirty = true;
    date.month.dirty = true;

    const tree = SkinDeep.shallowRender(
      <ErrorableMonthYear date={date} validation={{ valid: false, message: 'Test' }} onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Error Test');
  });
  it('displays custom message from array', () => {
    const date = {
      month: makeField(''),
      year: makeField('2010')
    };
    date.year.dirty = true;
    date.month.dirty = true;

    const tree = SkinDeep.shallowRender(
      <ErrorableMonthYear
        date={date}
        validation={[
          { valid: true, message: 'NotShownMessage' },
          { valid: false, message: 'Test' }
        ]}
        onValueChange={(_update) => {}}/>
    );

    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Error Test');
  });
});

