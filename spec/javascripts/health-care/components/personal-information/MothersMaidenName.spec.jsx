import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import MothersMaidenName from '../../../../../_health-care/_js/components/personal-information/MothersMaidenName';

describe('<MothersMaidenName>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <MothersMaidenName name={{ name: 'Arden' }} onUserInput={(_unused) => {}}/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs =
        ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(1);
  });

  it('sets and removes error css on invalid name', () => {
    // Initial state should be valid.
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);

    // Name with numbers is invalid.
    component.refs.name.value = 'Henry5';
    ReactTestUtils.Simulate.change(component.refs.name);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(1);

    // Name with non-alphabetical characters is invalid.
    component.refs.name.value = '#$#';
    ReactTestUtils.Simulate.change(component.refs.name);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(1);

    // Name with all alphabetical characters is valid.
    component.refs.name.value = 'Elizabeth';
    ReactTestUtils.Simulate.change(component.refs.name);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);

    // Hyphenated name is valid.
    component.refs.name.value = 'Montague-Capulet';
    ReactTestUtils.Simulate.change(component.refs.name);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);

    // Name with a space is valid.
    component.refs.name.value = 'Vigee Le Brun';
    ReactTestUtils.Simulate.change(component.refs.name);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);

    // Name with an apostrophe is valid.
    component.refs.name.value = 'd\'Arc';
    ReactTestUtils.Simulate.change(component.refs.name);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'uk-input-error')).to.have.length(0);
  });
});
