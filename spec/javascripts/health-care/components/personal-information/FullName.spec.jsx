import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import FullName from '../../../../../_health-care/_js/components/personal-information/FullName';

describe('<FullName>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <FullName name={{ first: 'William', last: 'Shakespeare' }} onUserInput={(_update) => {}}/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(3);

    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });

  it('sets and removes error css on blank name', () => {
    // Initial state should be valid.
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);

    // Empty first and last name renders error.
    component.refs.first.value = '';
    component.refs.last.value = '';
    ReactTestUtils.Simulate.change(component.refs.last);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(2);

    // Present first and last name removes error.
    component.refs.first.value = 'a';
    component.refs.last.value = 'b';
    ReactTestUtils.Simulate.change(component.refs.last);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);
  });

  it('validate first and last name are present', () => {
    // Present first name and blank last name should render error.
    component.refs.first.value = 'a';
    component.refs.last.value = '';
    ReactTestUtils.Simulate.change(component.refs.last);
    expect(component.state.hasError).to.be.true;

    // Present first and last should have no error.
    component.refs.first.value = 'a';
    component.refs.last.value = 'b';
    ReactTestUtils.Simulate.change(component.refs.last);
    expect(component.state.hasError).to.be.false;

    // Blank first and last should render error.
    component.refs.first.value = '';
    component.refs.last.value = '';
    ReactTestUtils.Simulate.change(component.refs.last);
    expect(component.state.hasError).to.be.true;

    // Blank middle name should not render error.
    component.refs.first.value = 'a';
    component.refs.middle.value = '';
    component.refs.last.value = 'b';
    ReactTestUtils.Simulate.change(component.refs.last);
    expect(component.state.hasError).to.be.false;

    // Blank suffix should not render error.
    component.refs.first.value = 'a';
    component.refs.last.value = 'b';
    component.refs.suffix.value = '';
    ReactTestUtils.Simulate.change(component.refs.suffix);
    expect(component.state.hasError).to.be.false;
  });
});
