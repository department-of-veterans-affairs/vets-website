import React from 'react';
import skinDeep from 'skin-deep';
import { expect } from 'chai';
import MhvSignIn from '../../containers/MhvSignIn';

describe('MhvSignIn Component', () => {
  it('should render all elements correctly', () => {
    const tree = skinDeep.shallowRender(<MhvSignIn />);

    const h1 = tree.subTree('h1');
    expect(h1.text()).to.equal('My HealtheVet test account');

    const description = tree.subTree('p');
    expect(description.text()).to.contain(
      'My HealtheVet test accounts are available for VA and Oracle Health staff only.',
    );

    const emailInput = tree.subTree('va-text-input');
    expect(emailInput.props.label).to.equal('Your VA email');
    expect(emailInput.props.required).to.be.true;

    const checkbox = tree.subTree('va-checkbox');
    expect(checkbox.props.label).to.equal(
      'I’m using My HealtheVet for official VA testing, training, or development purposes.',
    );
    expect(checkbox.props.required).to.be.true;

    const loginButton = tree.subTree('LoginButton');
    expect(loginButton.props.csp).to.equal('mhv');
  });
  it('should handle invalid email correctly', () => {
    const tree = skinDeep.shallowRender(<MhvSignIn />);
    const emailInput = tree.subTree('va-text-input');
    expect(emailInput).to.exist;

    emailInput.props.onInput({ target: { value: 'invalidemail' } });
    const updatedEmailInput = tree.subTree('va-text-input');
    expect(updatedEmailInput.props.error).to.equal(
      'Please enter a valid VA or Oracle Health email',
    );
  });

  it('should handle valid VA email correctly', () => {
    const tree = skinDeep.shallowRender(<MhvSignIn />);
    const emailInput = tree.subTree('va-text-input');
    expect(emailInput).to.exist;

    emailInput.props.onInput({ target: { value: 'user@va.gov' } });
    const updatedEmailInput = tree.subTree('va-text-input');
    expect(updatedEmailInput.props.error).to.be.null;
  });

  it('should handle valid Oracle email correctly', () => {
    const tree = skinDeep.shallowRender(<MhvSignIn />);
    const emailInput = tree.subTree('va-text-input');
    expect(emailInput).to.exist;

    emailInput.props.onInput({ target: { value: 'user@oracle.com' } });
    const updatedEmailInput = tree.subTree('va-text-input');
    expect(updatedEmailInput.props.error).to.be.null;
  });

  it('should pass the correct props to the checkbox', () => {
    const tree = skinDeep.shallowRender(<MhvSignIn />);
    const checkbox = tree.subTree('va-checkbox');

    checkbox.props.onChange({ target: { checked: true } });

    tree.reRender();
    const updatedCheckbox = tree.subTree('va-checkbox');
    expect(updatedCheckbox.props.checked).to.be.true;

    updatedCheckbox.props.onChange({ target: { checked: false } });

    tree.reRender();
    const revertedCheckbox = tree.subTree('va-checkbox');
    expect(revertedCheckbox.props.checked).to.be.false;
  });
});
