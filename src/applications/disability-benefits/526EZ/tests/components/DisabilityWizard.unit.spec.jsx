import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import createCommonStore from 'platform/startup/store';

import { DisabilityWizard } from '../../components/DisabilityWizard';
import { layouts } from '../../wizardHelpers';

const { chooseUpdate, applyGuidance } = layouts;

const defaultStore = createCommonStore();

const defaultProps = {
  isLoggedIn: false,
  isVerified: false,
};

describe('<DisabilityWizard>', () => {
  it('should show button and no questions', () => {
    const tree = mount(<DisabilityWizard {...defaultProps} />);

    expect(tree.find('button')).not.to.be.false;
    expect(tree.find('#wizardOptions').props().className).to.contain(
      'wizard-content-closed',
    );
    tree.unmount();
  });
  it('should show status page', () => {
    const tree = mount(<DisabilityWizard {...defaultProps} />);

    expect(tree.find('input').length).to.equal(3);
    expect(tree.find('a').href).to.be.undefined;
    tree.unmount();
  });
  it('should validate status page on submit', () => {
    const tree = mount(<DisabilityWizard {...defaultProps} />);
    tree
      .find('ButtonContainer')
      .find('button')
      .simulate('click');

    expect(tree.find('.usa-input-error-message').exists()).to.equal(true);
    tree.unmount();
  });
  it('should show update page', () => {
    const tree = mount(<DisabilityWizard {...defaultProps} />);

    expect(tree.find('input').length).to.equal(3);
    tree.setState({ disabilityStatus: 'update', currentLayout: chooseUpdate });
    expect(tree.find('input').length).to.equal(2);
    tree.unmount();
  });
  it('should validate update page on submit', () => {
    const tree = mount(<DisabilityWizard {...defaultProps} />);

    tree.setState({ disabilityStatus: 'update', currentLayout: chooseUpdate });
    tree
      .find('ButtonContainer')
      .find('.usa-button-primary')
      .simulate('click');
    expect(tree.find('.usa-input-error-message').exists()).to.equal(true);
    tree.unmount();
  });
  it('should show ebenefits guidance page for first claims', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <DisabilityWizard {...defaultProps} />
      </Provider>,
    );

    tree
      .find(DisabilityWizard)
      .instance()
      .setState({ disabilityStatus: 'first', currentLayout: applyGuidance });
    tree.update();
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
    expect(tree.find('p').text()).to.equal(
      'To file your first disability claim, please go to our eBenefits website.',
    );
    tree.unmount();
  });
  it('should show ebenefits guidance page for new claims', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <DisabilityWizard {...defaultProps} />
      </Provider>,
    );

    tree
      .find(DisabilityWizard)
      .instance()
      .setState({ disabilityStatus: 'add', currentLayout: applyGuidance });
    tree.update();
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
    expect(tree.find('p').text()).to.equal(
      'Since you have a new condition to add to your rated disability claim, you’ll need to file your disability claim on eBenefits.',
    );
    tree.unmount();
  });
  it('should show ebenefits guidance page for new and increase claims', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <DisabilityWizard {...defaultProps} />
      </Provider>,
    );

    tree
      .find(DisabilityWizard)
      .instance()
      .setState({
        disabilityStatus: 'addAndIncrease',
        currentLayout: applyGuidance,
      });
    tree.update();
    expect(tree.find('a').text()).to.equal('Go to eBenefits »');
    expect(tree.find('p').text()).to.equal(
      'Since you have a new condition and a condition that has gotten worse, you’ll need to file your disability claim on eBenefits.',
    );
    tree.unmount();
  });
  it('should show appeals guidance page', () => {
    const tree = mount(<DisabilityWizard {...defaultProps} />);

    tree.setState({ disabilityStatus: 'appeal', currentLayout: applyGuidance });
    expect(tree.find('a').text()).to.equal('Learn how to file an appeal');
    expect(tree.find('p').text()).to.equal(
      'If you disagree with our decision on your disability claim, you can appeal it. Learn how to file an appeal',
    );
    tree.unmount();
  });
  it('should show unauthenticated increase guidance page', () => {
    const tree = mount(
      <DisabilityWizard {...defaultProps} isLoggedIn={false} />,
    );

    tree.setState({
      disabilityStatus: 'increase',
      currentLayout: applyGuidance,
    });
    expect(tree.text()).to.contain('Sign in and verify your identity »');
    expect(tree.find('p').text()).to.equal(
      'Since you have a condition that’s gotten worse to add to your claim, you’ll need to file a claim for increased disability. To apply for a disability increase, you’ll need to sign in and verify your account.',
    );
    tree.unmount();
  });
  it('should show authenticated increase guidance page', () => {
    const tree = mount(
      <DisabilityWizard {...defaultProps} isLoggedIn isVerified={false} />,
    );

    tree.setState({
      disabilityStatus: 'increase',
      currentLayout: applyGuidance,
    });
    expect(tree.text()).to.contain('Verify your identity »');
    expect(
      tree
        .find('p')
        .at(0)
        .text(),
    ).to.contain(
      'Since you have a condition that’s gotten worse to add to your claim, you’ll need to file a claim for increased disability.',
    );
    tree.unmount();
  });
  it('should show authenticated and verified increase guidance page', () => {
    const tree = mount(<DisabilityWizard isLoggedIn isVerified />);

    tree.setState({
      disabilityStatus: 'increase',
      currentLayout: applyGuidance,
    });
    tree.setProps({ user: { profile: { verified: true } } });
    expect(tree.text()).to.contain('Apply for Claim for Increase »');
    expect(
      tree
        .find('p')
        .at(0)
        .text(),
    ).to.contain(
      'Since you have a condition that’s gotten worse to add to your claim, you’ll need to file a claim for increased disability.',
    );
    tree.unmount();
  });
});
