import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import _ from 'lodash';

import DateInput from '../../../../../_health-care/_js/components/form-elements/DateInput';

describe('<DateInput>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <DateInput date={{ month: '1', day: '2', year: '1900' }} onUserInput={(_update) => {}}/>
      );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(3);
  });

  it('sets and removes error css on invalid date', () => {
    // Initial state should be valid.
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(0);

    // Smarch is not a real month.
    component.refs.month.value = 13;
    ReactTestUtils.Simulate.change(component.refs.month);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(1);

    // December is a real month though.
    component.refs.month.value = 12;
    ReactTestUtils.Simulate.change(component.refs.month);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(0);
  });

  it('validate february here cause its a special snowflake', () => {
    // 28 should work always.
    component.refs.month.value = 2;
    component.refs.day.value = 28;
    component.refs.year.value = 2015;
    ReactTestUtils.Simulate.change(component.refs.year);
    expect(component.state.hasError).to.be.false;

    // 2015 is not a leap year.
    component.refs.month.value = 2;
    component.refs.day.value = 29;
    component.refs.year.value = 2015;
    ReactTestUtils.Simulate.change(component.refs.year);
    expect(component.state.hasError).to.be.true;

    // 2016 is a leap year.
    component.refs.month.value = 2;
    component.refs.day.value = 29;
    component.refs.year.value = 2016;
    ReactTestUtils.Simulate.change(component.refs.month);
    ReactTestUtils.Simulate.change(component.refs.day);
    ReactTestUtils.Simulate.change(component.refs.year);
    expect(component.state.hasError).to.be.false;

    // 30 is always bad.
    component.refs.month.value = 2;
    component.refs.day.value = 30;
    component.refs.year.value = 2016;
    ReactTestUtils.Simulate.change(component.refs.year);
    expect(component.state.hasError).to.be.true;

    // 1 is always fine.
    component.refs.month.value = 2;
    component.refs.day.value = 1;
    component.refs.year.value = 2016;
    ReactTestUtils.Simulate.change(component.refs.year);
    expect(component.state.hasError).to.be.false;

    // 0 is always bad.
    component.refs.month.value = 2;
    component.refs.day.value = 0;
    component.refs.year.value = 2016;
    ReactTestUtils.Simulate.change(component.refs.year);
    expect(component.state.hasError).to.be.true;
  });

  it('ensure valid days vary with the month', () => {
    // Our calendar system make no frigging sense. :(
    const months31 = [1, 3, 5, 7, 8, 10, 12];
    const months30 = [4, 6, 9, 11];

    _.each(months31, (month) => {
      component.refs.month.value = month;
      component.refs.day.value = 31;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.false;

      component.refs.month.value = month;
      component.refs.day.value = 32;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.true;

      component.refs.month.value = month;
      component.refs.day.value = 1;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.false;

      component.refs.month.value = month;
      component.refs.day.value = 0;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.true;
    });

    _.each(months30, (month) => {
      component.refs.month.value = month;
      component.refs.day.value = 30;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.false;

      component.refs.month.value = month;
      component.refs.day.value = 31;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.true;

      component.refs.month.value = month;
      component.refs.day.value = 1;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.false;

      component.refs.month.value = month;
      component.refs.day.value = 0;
      ReactTestUtils.Simulate.change(component.refs.day);
      expect(component.state.hasError).to.be.true;
    });
  });
});
