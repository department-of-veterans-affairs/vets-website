import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { App } from './App';

const initialProps = {
  handleSignInClick: () => {},
  isSignedIn: false,
};

const setup = (props = {}) => render(<App {...initialProps} {...props} />);

const mockApi = (path, data) => {
  const url = `${environment.API_URL}${path}`;
  const server = setupServer(
    rest.get(url, (_, res, ctx) => res(ctx.json(data))),
  );
  server.listen();
  return server;
};

describe('Priority Group Alert Widget', () => {
  it('displays <SignInPrompt /> when the user is signed out', () => {
    const wrapper = setup();
    const headerContent = 'You might already have an assigned priority group';
    expect(wrapper.findByText(headerContent)).to.exist;
    const buttonContent = 'Sign in to view your priority group';
    expect(wrapper.findByRole('button', buttonContent)).to.exist;
  });

  it('displays <PriorityGroup /> when the user is signed in', () => {
    const path = '/v0/health_care_applications/enrollment_status';
    const enrollmentStatus = {
      effectiveDate: '2019-01-02T21:58:55.000-06:00',
      priorityGroup: 'Group 8G',
    };
    const server = mockApi(path, enrollmentStatus);
    const wrapper = setup({ isSignedIn: true });
    expect(wrapper.findByText('Your assigned priority group is Group 8G')).to
      .exist;
    server.close();
  });

  it('displays <Loading /> when loading', () => {
    const wrapper = setup({ loading: true });
    expect(wrapper.findByText('Loading...')).to.exist;
  });

  it("displays <Error /> when the API just can't even", () => {
    const wrapper = setup({ error: true });
    expect(wrapper.findByText("Sorry, we couldn't find that")).to.exist;
  });
});
