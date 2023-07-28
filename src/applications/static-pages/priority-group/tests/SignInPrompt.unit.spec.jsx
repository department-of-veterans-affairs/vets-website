import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import SignInPrompt from '../components/SignInPrompt';

const setup = (props = {}) => render(<SignInPrompt {...props} />);

describe('SignInPrompt Component', () => {
  it('renders', () => {
    const wrapper = setup();
    expect(wrapper).to.exist;
  });

  it('has the appropriate headline content', () => {
    const wrapper = setup();
    const headlineContent = 'You might already have an assigned priority group';
    expect(wrapper.findByText(headlineContent)).to.exist;
  });

  it('has a Sign In button that calls props.handleSignInClick', () => {
    const props = {
      handleSignInClick: sinon.spy(),
    };
    const wrapper = setup(props);
    const button = wrapper.getByRole('button', /Sign in/);
    expect(button).to.exist;
    fireEvent.click(button);
    expect(props.handleSignInClick.calledOnce).to.be.true;
  });
});
