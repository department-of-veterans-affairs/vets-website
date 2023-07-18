import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { App } from './App';

const initialProps = {
  error: false,
  handleSignInClick: () => {},
  fetchEnrollmentStatus: () => {},
  isSignedIn: false,
  loading: false,
};

const setup = (props = {}) => render(<App {...initialProps} {...props} />);

describe('Priority Group Alert Widget', () => {
  it('displays <SignInPrompt /> when the user is signed out', () => {
    const wrapper = setup();
    const headerContent = 'You might already have an assigned priority group';
    expect(wrapper.getByText(headerContent)).to.exist;
    const buttonContent = 'Sign in to view your priority group';
    expect(wrapper.getByRole('button', buttonContent)).to.exist;
  });

  it('displays <PriorityGroup /> when the user is signed in', () => {
    const enrollmentStatus = {
      effectiveDate: '2019-01-02T21:58:55.000-06:00',
      priorityGroup: 'Group 8G',
    };
    const wrapper = setup({ isSignedIn: true, enrollmentStatus });
    const message = 'Your assigned priority group is 8G (as of 2019-01-02)';
    expect(wrapper.getByText(message)).to.exist;
  });

  it('displays <Loading /> when loading', () => {
    const wrapper = setup({ loading: true });
    expect(wrapper.getByTestId('priority-group-alert-loading')).to.exist;
  });

  it("displays <Error /> when the API just can't even", () => {
    const wrapper = setup({ error: true });
    expect(wrapper.getByText("Sorry, we couldn't find that")).to.exist;
  });
});
