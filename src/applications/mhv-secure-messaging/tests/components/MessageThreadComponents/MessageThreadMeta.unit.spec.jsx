import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducer from '../../../reducers';
import messageResponse from '../../fixtures/message-response.json';
import { dateFormat } from '../../../util/helpers';
import MessageThreadMeta from '../../../components/MessageThread/MessageThreadMeta';
import { DefaultFolders } from '../../../util/constants';

describe('Message thread item', () => {
  const setup = (
    message = messageResponse,
    state = {},
    sentMessage = false,
    printMessage = false,
  ) => {
    return renderWithStoreAndRouter(
      <MessageThreadMeta
        message={message}
        isSent={sentMessage}
        forPrint={printMessage}
      />,
      {
        reducers: reducer,
        initialState: state,
      },
    );
  };

  it('renders without errors (message received, read receipt disabled)', () => {
    const screen = setup();

    expect(screen.getByTestId('message-date').textContent).to.equal(
      `Date: ${dateFormat(
        messageResponse.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`,
    );

    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName} (${
        messageResponse.triageGroupName
      })`,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.recipientName}`,
    );
    expect(screen.getByTestId('message-id').textContent).to.equal(
      `Message ID: ${messageResponse.messageId}`,
    );
  });

  it('renders without errors (message sent, read receipt disabled)', () => {
    const screen = setup(undefined, undefined, true);

    expect(screen.getByTestId('message-date').textContent).to.equal(
      `Date: ${dateFormat(
        messageResponse.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`,
    );

    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName}`,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.recipientName}`,
    );
    expect(screen.getByTestId('message-id').textContent).to.equal(
      `Message ID: ${messageResponse.messageId}`,
    );
  });

  it('renders without errors (message sent & unopened, read receipt enabled)', () => {
    const customState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingReadReceipts]: true,
      },
    };
    const message = {
      ...messageResponse,
      folderId: DefaultFolders.SENT.id,
      readReceipt: null,
    };
    const screen = setup(message, customState, true);

    expect(screen.getByTestId('message-date').textContent).to.equal(
      `Date: ${dateFormat(
        messageResponse.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`,
    );

    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName}`,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.recipientName}`,
    );
    expect(screen.getByText('Not yet opened by your care team')).to.exist;
  });

  it('renders without errors (message sent & opened, read receipt enabled)', () => {
    const customState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingReadReceipts]: true,
      },
    };
    const message = {
      ...messageResponse,
      folderId: DefaultFolders.SENT.id,
    };
    const screen = setup(message, customState, true);

    expect(screen.getByTestId('message-date').textContent).to.equal(
      `Date: ${dateFormat(
        messageResponse.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`,
    );

    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName}`,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.recipientName}`,
    );
    expect(screen.getByText('Opened by your care team')).to.exist;
    expect(screen.findByTestId('message-id').textContent).to.not.exist;
  });
});
