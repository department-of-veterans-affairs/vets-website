import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import ReplyForm from '../../../components/ComposeForm/ReplyForm';
import reducer from '../../../reducers';
import threadDetailsReducer from '../../fixtures/threads/reply-draft-thread-reducer.json';
import folders from '../../fixtures/folder-inbox-response.json';
import signatureReducers from '../../fixtures/signature-reducers.json';
import { ErrorMessages } from '../../../util/constants';
import { inputVaTextInput } from '../../../util/testUtils';
import saveDraftResponse from '../../e2e/fixtures/draftsResponse/drafts-single-message-response.json';

describe('Reply form component', () => {
  const { signature } = signatureReducers.signatureEnabled;
  const initialState = {
    sm: {
      preferences: { signature },
      folders: {
        folder: folders.inbox,
      },
      threadDetails: {
        ...threadDetailsReducer.threadDetails,
      },
    },
  };
  const { threadDetails } = threadDetailsReducer;
  const replyMessage = threadDetails.drafts[0];
  const { category, subject, senderName, triageGroupName } = replyMessage;

  const render = (state = initialState, props = {}) => {
    return renderWithStoreAndRouter(
      <ReplyForm replyMessage={replyMessage} {...props} />,
      {
        initialState: state,
        reducers: reducer,
        path: `/reply/7171715`,
      },
    );
  };

  it('renders without errors', async () => {
    const screen = render();
    expect(screen).to.exist;
  });

  it('adds beforeunload event listener', () => {
    const screen = render();
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;
    fireEvent.input(screen.getByTestId('message-body-field'), {
      target: { innerHTML: 'test beforeunload event' },
    });

    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
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

    expect(patientSafetyNotice).to.exist;

    expect(draftToLabel.textContent).to.equal(
      `(Draft) To: ${senderName}\n(Team: ${triageGroupName})`,
    );

    expect(getByText('Attachments'))
      .to.have.attribute('class')
      .to.contain('message-body-attachments-label');

    expect(actionButtons).to.exist;
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

  it('renders the attachments component when adding a file', async () => {
    const screen = render();
    const fileName = 'test.png';
    const file = new File(['(⌐□_□)'], fileName, { type: 'image/png' });

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(uploader.files[0].name).to.equal('test.png');
    expect(uploader.files.length).to.equal(1);
    fireEvent.click(screen.getByTestId('Save-Draft-Button'));
    await waitFor(() => {
      expect(
        document.querySelector(
          `va-modal[modal-title="${
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.title
          }"]`,
        ),
      ).to.have.attribute('visible', 'true');
    });
  });

  it('renders success message on new reply draft save', async () => {
    const customState = {
      sm: {
        ...initialState.sm,
        messagedetails: {
          message: replyMessage,
        },
      },
    };

    const screen = render(customState);
    await waitFor(() => {
      screen.getByTestId('message-body-field');
    });
    fireEvent.focus(screen.getByTestId('message-body-field'));
    inputVaTextInput(screen.container, 'Test draft message', 'va-textarea');
    mockApiRequest(saveDraftResponse);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('Save-Draft-Button'));
      expect(screen.getByText('Your message was saved', { exact: false }));
    });
  });
});
