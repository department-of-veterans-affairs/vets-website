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
});
