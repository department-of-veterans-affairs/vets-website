import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SocialSecurityNumber from '../../../../_health-care/_js/_components/social-security-number';

describe('<SocialSecurityNumber>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <SocialSecurityNumber ssn={{ ssn: '999-99-9999' }} onUserInput={(_update) => {}}/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(1);
  });

  xit('sets and removes error css on invalid SSN', () => {
    // Initial state should be valid.
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(0);

    // Valid SSN has no error.
    component.refs.ssn.value = '123-45-6789';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(component.state.hasError).to.be.false;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(0);

    // SSN with alphabetical characters is invalid.
    component.refs.ssn.value = '123-45-678a';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(1);

    // SSN without dashes is invalid.
    component.refs.ssn.value = '123456789';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(1);

    // SSN with too few numbers is invalid.
    component.refs.ssn.value = '123-45-678';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(1);

    // SSN with non-numberic characters is invalid.
    component.refs.ssn.value = '#12-34-5678';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(component.state.hasError).to.be.true;
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error')).to.have.length(1);
  });

  it('includes ErrorMessage component when invalid SSN', () => {
    // ErrorMessage component should not be present when valid.
    component.refs.ssn.value = '123-45-6789';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error-message')).to.have.length(0);

    // ErrorMessage component should be present when invalid.
    component.refs.ssn.value = '123-45-678';
    ReactTestUtils.Simulate.change(component.refs.ssn);
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error-message')).to.have.length(1);
  });
});
