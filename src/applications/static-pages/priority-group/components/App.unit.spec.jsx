import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { App } from './App';

const initialProps = {
  enabled: true,
  error: false,
  fetchEnrollmentStatus: () => {},
  handleSignInClick: () => {},
  loading: false,
  signedIn: false,
};

const setup = (props = {}) => render(<App {...initialProps} {...props} />);

describe('Priority Group Alert Widget', () => {
  it('renders <PactAct /> when the feature is disabled', () => {
    const wrapper = setup({ enabled: false });
    const headerContent = /The PACT Act expands benefit access for Veterans/;
    expect(wrapper.getByText(headerContent)).to.exist;
    const linkName =
      'Learn how the PACT Act may affect your VA benefits and care';
    const link = wrapper.getByRole('link', { name: linkName });
    expect(link).to.exist;
    expect(link.href.endsWith('/resources/the-pact-act-and-your-va-benefits'))
      .to.be.true;
  });

  it('renders a single <SignInPrompt /> when signed out', () => {
    // const wrapper = setup();
    const { container, getByRole, getByText } = setup();
    expect(container.children.length).to.eq(1);
    const headerContent = 'You might already have an assigned priority group';
    expect(getByText(headerContent)).to.exist;
    const buttonContent = 'Sign in to view your priority group';
    expect(getByRole('button', buttonContent)).to.exist;
  });

  it('renders a single <UnknownGroup /> when priorityGroup is not set', () => {
    const enrollmentStatus = {};
    const wrapper = setup({ signedIn: true, enrollmentStatus });
    expect(wrapper.container.children.length).to.eq(1);
    const message = 'You have not yet been assigned to a priority group';
    expect(wrapper.getByText(message)).to.exist;
  });

  it('renders a single <PriorityGroup /> when priorityGroup is set', () => {
    const enrollmentStatus = {
      effectiveDate: '2019-01-02T21:58:55.000-06:00',
      priorityGroup: 'Group 8G',
    };
    const wrapper = setup({ signedIn: true, enrollmentStatus });
    expect(wrapper.container.children.length).to.eq(1);
    const message = 'Your assigned priority group is 8G as of January 2, 2019';
    expect(wrapper.getByText(message)).to.exist;
  });

  it('renders a single <Loading /> when loading', () => {
    const wrapper = setup({ loading: true });
    expect(wrapper.container.children.length).to.eq(1);
    expect(wrapper.getByTestId('priority-group-alert-loading')).to.exist;
  });

  it("renders a single <ApiError /> when the API just can't even", () => {
    const wrapper = setup({ error: true });
    expect(wrapper.container.children.length).to.eq(1);
    const message = "We can't access your priority group information";
    expect(wrapper.getByText(message)).to.exist;
  });
});
