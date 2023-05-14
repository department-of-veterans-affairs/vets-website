import React from 'react';
import { waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import messageResponse from '../../fixtures/message-response.json';
import MessageThreadItem from '../../../components/MessageThread/MessageThreadItem';
import { dateFormat } from '../../../util/helpers';

describe('Message thread item', () => {
  const setup = (message = messageResponse) => {
    return renderWithStoreAndRouter(<MessageThreadItem message={message} />, {
      reducers: reducer,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    const accordion = document.querySelector('va-accordion-item');
    expect(accordion.getAttribute('header')).to.equal(
      dateFormat(messageResponse.sentDate, 'MMMM D, YYYY [at] h:mm a z'),
    );

    waitFor(
      fireEvent.click(
        screen.getByTestId(
          `expand-message-button-${messageResponse.messageId}`,
        ),
      ),
    );
    expect(screen.getByTestId('message-date').textContent).to.equal(
      dateFormat(messageResponse.sentDate, 'MMMM D, YYYY [at] h:mm a z'),
    );
    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName} (${
        messageResponse.triageGroupName
      })`,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.recipientName}`,
    );
    expect(
      accordion
        .querySelector('[data-testid="message-body"]')
        .textContent.trim(),
    ).to.equal(messageResponse.body);
    expect(screen.getByText(messageResponse.attachments[0].name)).to.exist;
  });

  it('message from patient renders without errors', () => {
    const message = {
      ...messageResponse,
      recipientName: messageResponse.triageGroupName,
    };
    const screen = setup(message);
    const accordion = document.querySelector('va-accordion-item');
    expect(
      document.querySelector('va-accordion-item').getAttribute('header'),
    ).to.equal(
      dateFormat(messageResponse.sentDate, 'MMMM D, YYYY [at] h:mm a z'),
    );

    expect(
      document.querySelector('va-accordion-item').getAttribute('subheader'),
    ).to.equal('Me');
    expect(screen.getByTestId('message-date').textContent).to.equal(
      dateFormat(messageResponse.sentDate, 'MMMM D, YYYY [at] h:mm a z'),
    );
    // message from patient, no triage group name in 'from' field
    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName} `,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.triageGroupName}`,
    );
    expect(
      accordion
        .querySelector('[data-testid="message-body"]')
        .textContent.trim(),
    ).to.equal(messageResponse.body);
    expect(screen.getByText(messageResponse.attachments[0].name)).to.exist;
  });
});
