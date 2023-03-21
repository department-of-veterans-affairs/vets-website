import React from 'react';
import '@testing-library/react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MessageFAQs from '../../containers/MessageFAQs';

describe('Message FAQ container', () => {
  const authUser = true;
  const unAuthUser = false;

  it('Contains `Messages FAQs` heading and unauthorized user component: `Sign in` to secure messages', () => {
    const screen = renderWithStoreAndRouter(
      <MessageFAQs isLoggedIn={unAuthUser} />,
      {
        path: '/faq',
      },
    );

    expect(screen.findByText('Messages FAQs')).to.exist;
    expect(screen.getByText('Sign in to send secure messages')).to.exist;
  });

  it('Loads FAQs component on authorized user screen', () => {
    const screen = renderWithStoreAndRouter(
      <MessageFAQs isLoggedIn={authUser} />,
      {
        path: '/faq',
      },
    );

    const FAQs = screen.getByText('Questions about using messages');
    expect(FAQs).to.exist;
  });
});
