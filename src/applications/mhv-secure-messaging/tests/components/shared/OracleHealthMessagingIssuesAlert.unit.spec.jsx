import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import OracleHealthMessagingIssuesAlert from '../../../components/shared/OracleHealthMessagingIssuesAlert';

describe('OracleHealthMessagingIssuesAlert', () => {
  it('renders the alert with correct content', () => {
    const { getByText, container } = renderWithStoreAndRouter(
      <OracleHealthMessagingIssuesAlert />,
      {
        initialState: {},
        reducers: {},
      },
    );

    expect(getByText('We’re working on messages right now')).to.exist;
    expect(
      getByText(
        'We’re sorry. Some of your messages might not be here. We’re working to fix this.',
      ),
    ).to.exist;
    expect(getByText('To review all your messages, go to My VA Health')).to
      .exist;

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('warning');
    expect(alert.getAttribute('visible')).to.equal('true');
  });

  it('renders the link to My VA Health', () => {
    const { container } = renderWithStoreAndRouter(
      <OracleHealthMessagingIssuesAlert />,
      {
        initialState: {},
        reducers: {},
      },
    );

    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('Go to My VA Health');
    expect(link.getAttribute('href')).to.contain('/pages/messaging/inbox');
  });
});
