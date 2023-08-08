import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import ReplyForm from '../../../components/ComposeForm/ReplyForm';
import reducer from '../../../reducers';
import { draftDetails } from '../../fixtures/threads/reply-draft-thread-reducer.json';
import folders from '../../fixtures/folder-inbox-response.json';
import signatureReducers from '../../fixtures/signature-reducers.json';

describe('Reply form component', () => {
  const { signature } = signatureReducers.signatureEnabled;
  const initialState = {
    sm: {
      preferences: { signature },
      folders: {
        folder: folders.inbox,
      },
    },
  };
  const replyMessage = draftDetails.draftMessageHistory[0];
  const { category, subject, senderName, triageGroupName } = replyMessage;

  const render = (state = initialState) => {
    return renderWithStoreAndRouter(<ReplyForm replyMessage={replyMessage} />, {
      initialState: state,
      reducers: reducer,
      path: `/reply/7171715`,
    });
  };

  it('renders without errors', async () => {
    const screen = render();
    expect(screen).to.exist;
  });

  it('renders the subject header', async () => {
    const screen = render();
    await waitFor(() => {
      expect(
        screen.queryByText(`${category}: ${subject}`, {
          selector: 'h1',
        }),
      ).to.exist;
    });
  });

  it('renders the reply form', async () => {
    const screen = render();
    const { getByText } = screen;

    const patientSafetyNotice = document.querySelector(
      "[trigger='Only use messages for non-urgent needs']",
    );
    const draftToLabel = document.querySelector('span');
    const actionButtons = document.querySelector('.compose-form-actions');

    expect(getByText('Reply draft edit mode.', { selector: 'h2' }))
      .to.have.attribute('class')
      .to.equal('sr-only');

    expect(patientSafetyNotice).to.exist;

    expect(draftToLabel.textContent).to.equal(
      `(Draft) To: ${senderName}\n(Team: ${triageGroupName})`,
    );

    expect(getByText('Attachments'))
      .to.have.attribute('class')
      .to.contain('message-body-attachments-label');

    expect(actionButtons).to.exist;
  });

  it('renders the message replied to', async () => {
    const screen = render();
    expect(screen.getByText('Message you are replying to.', { selector: 'h2' }))
      .to.have.attribute('class')
      .to.equal('sr-only');
  });

  it('renders the message signature in the textarea if a signature is included', async () => {
    const screen = render();
    expect(screen.getByTestId('message-body-field'))
      .to.have.attribute('value')
      .to.equal(
        `\n\n\n${signature.signatureName}\n${signature.signatureTitle}`,
      );
  });

  it('does not render the message signature in the textarea if a signature is NOT included', async () => {
    const signatureExcluded = signatureReducers.signatureDisabled.signature;
    const customState = {
      sm: {
        ...initialState.sm,
        preferences: { signature: signatureExcluded },
      },
    };
    const screen = render(customState);
    const messageBodyInput = screen.getByTestId('message-body-field');
    expect(messageBodyInput).to.exist;
    expect(messageBodyInput).to.not.have.attribute('value');
  });
});
