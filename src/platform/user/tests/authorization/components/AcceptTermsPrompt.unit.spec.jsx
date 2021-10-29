import { expect } from 'chai';
import { findDOMNode } from 'react-dom';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import SkinDeep from 'skin-deep';

import AcceptTermsPrompt from '../../../authorization/components/AcceptTermsPrompt';
import { axeCheck } from '../../helpers';

const defaultProps = {
  terms: {
    termsContent: 'content',
    name: 'mhvac',
  },
  onAccept: sinon.spy(),
};

describe('<AcceptTermsPrompt>', () => {
  before(() => {
    window.dataLayer = [];
    window.scrollTo = () => {};
  });

  it('should be an empty div if there is no content', () => {
    const tree = SkinDeep.shallowRender(<AcceptTermsPrompt terms={{}} />);
    expect(tree.toString()).to.equal('<div />');
  });

  it('should call onAccept correctly', () => {
    const acceptTermsPrompt = ReactTestUtils.renderIntoDocument(
      <AcceptTermsPrompt {...defaultProps} />,
    );

    acceptTermsPrompt.handleSubmit();
    expect(defaultProps.onAccept.calledWith('mhvac')).to.be.true;
  });

  it('submit button should be disabled by default', () => {
    const tree = SkinDeep.shallowRender(
      <AcceptTermsPrompt {...defaultProps} />,
    );

    const submitButton = tree.subTree('.usa-button-disabled');
    expect(submitButton).to.be.ok;
    expect(submitButton.props.disabled).to.be.true;
  });

  it('submit button should be enabled if state is valid', () => {
    const acceptTermsPrompt = ReactTestUtils.renderIntoDocument(
      <AcceptTermsPrompt {...defaultProps} />,
    );

    acceptTermsPrompt.setState({
      yesSelected: true,
      scrolledToBottom: true,
    });

    const submitButton = findDOMNode(
      ReactTestUtils.findRenderedDOMComponentWithClass(
        acceptTermsPrompt,
        'submit-button',
      ),
    );

    expect(submitButton).to.be.ok;
    expect(submitButton.disabled).to.be.false;
    expect(submitButton.className).to.eq('usa-button submit-button');
  });

  it('passes aXe check when Submit button is disabled', () => {
    axeCheck(<AcceptTermsPrompt {...defaultProps} />);
  });

  it('passes aXe check when Submit button is enabled', () => {
    const acceptTermsPrompt = <AcceptTermsPrompt {...defaultProps} />;
    const acceptTermsPromptState = {
      yesSelected: true,
      scrolledToBottom: true,
    };

    axeCheck(acceptTermsPrompt, acceptTermsPromptState);
  });

  it('should render the correct default h level', () => {
    const tree = SkinDeep.shallowRender(
      <AcceptTermsPrompt {...defaultProps} />,
    );

    const title = tree.subTree('h1');
    expect(title).to.exist;
  });

  it('should render the correct h level', () => {
    const defaultPropsWithLevel = {
      ...defaultProps,
      level: 3,
    };
    const tree = SkinDeep.shallowRender(
      <AcceptTermsPrompt {...defaultPropsWithLevel} />,
    );

    const title = tree.subTree('h3');
    expect(title).to.exist;
  });
});
