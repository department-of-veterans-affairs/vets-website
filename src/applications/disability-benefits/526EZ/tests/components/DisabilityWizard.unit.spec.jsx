import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import createCommonStore from '../../../../../platform/startup/store';
import DisabilityWizard from '../../components/DisabilityWizard';
import { layouts } from '../../helpers';

const { chooseUpdate, applyGuidance } = layouts;

const defaultProps = {
  store: createCommonStore()
};

describe('<DisabilityWizard>', () => {
  it('should show button and no questions', () => {
    const tree = mount(
      <DisabilityWizard {...defaultProps}/>
    );

    expect(tree.find('button')).not.to.be.false;
    expect(tree.find('#wizardOptions').props().className).to.contain('wizard-content-closed');
  });
  it('should show update page', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ open: true });
    expect(tree.find('#wizardOptions').props().className).to.not.contain('wizard-content-closed');
  });
  it('should show status page', () => {
    const tree = mount(
      <DisabilityWizard {...defaultProps}/>
    );

    expect(tree.find('input').length).to.equal(3);
    expect(tree.find('a').href).to.be.undefined;
  });
  it('should validate status page on submit', () => {
    const tree = mount(
      <DisabilityWizard {...defaultProps}/>
    );

    tree.find('a').simulate('click');
    expect(tree.find('.usa-input-error-message').exists()).to.equal(true);
  });
  it('should show update page', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'update', currentLayout: chooseUpdate });
    expect(tree.find('input').length).to.equal(2);
  });
  it('should validate update page on submit', () => {
    const tree = mount(
      <DisabilityWizard {...defaultProps}/>
    );

    tree.setState({ disabilityStatus: 'update', currentLayout: chooseUpdate });
    tree.find('a').simulate('click');
    expect(tree.find('.usa-input-error-message').exists()).to.equal(true);
  });
  it('should show ebenefits guidance page', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'first', currentLayout: applyGuidance });
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
  });
  it('should show ebenefits guidance page for first claims', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'first', currentLayout: applyGuidance });
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
    expect(tree.find('p').text()).to.equal('We’re sorry. We’re not set up to accept original claims on Vets.gov at this time. Since you’re filing your first disability claim, you’ll need to file on eBenefits.');
  });
  it('should show ebenefits guidance page for new claims', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'add', currentLayout: applyGuidance });
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
    expect(tree.find('p').text()).to.equal('Since you have a new condition to add to your rated disability claim, you’ll need to file your disability claim on eBenefits.');
  });
  it('should show ebenefits guidance page for new and increase claims', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'addAndIncrease', currentLayout: applyGuidance });
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
    expect(tree.find('p').text()).to.equal('Since you have both new and worsening conditions, you’ll need to file your disability claim on eBenefits.');
  });
  it('should show appeals guidance page', () => {
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'appeal', currentLayout: applyGuidance });
    expect(tree.find('a').text()).to.equal('Learn how to file an appeal.');
    expect(tree.find('p').text()).to.equal('If you disagree with our decision on your disability claim, you can appeal it. Learn how to file an appeal.');
  });
  it('should show unauthenticated increase guidance page', () => {
    const oldStorage = global.sessionStorage;
    global.sessionStorage = { userToken: '' };
    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'increase', currentLayout: applyGuidance });
    expect(tree.text()).to.contain('Sign In and Verify Your Identity »');
    expect(tree.find('p').text()).to.equal('Since you have a condition that’s gotten worse to add to your claim, you’ll need to file a claim for increased disability. To apply for a disability increase, you’ll need to sign in and verify your account.');
    global.sessionStorage = oldStorage;
  });
  it('should show authenticated increase guidance page', () => {
    const oldStorage = global.sessionStorage;
    global.sessionStorage = { userToken: 'abcdefg' };

    const tree = mount(
      shallow(
        <DisabilityWizard {...defaultProps}/>
      ).get(0)
    );

    tree.setState({ disabilityStatus: 'increase', currentLayout: applyGuidance });
    expect(tree.find('p').at(0).text()).to.contain('Since you have a condition that’s gotten worse to add to your claim, you’ll need to file a claim for increased disability.');
    global.sessionStorage = oldStorage;
  });
});
