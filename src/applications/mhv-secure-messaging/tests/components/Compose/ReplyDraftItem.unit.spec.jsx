import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../../reducers';
import ReplyDraftItem from '../../../components/ComposeForm/ReplyDraftItem';
import thread from '../../fixtures/reducers/thread-with-multiple-drafts-reducer.json';
import categories from '../../fixtures/categories-response.json';
import { dateFormat } from '../../../util/helpers';
import * as messagesActions from '../../../actions/messages';

describe('ReplyDraftItem component', () => {
  let sandbox;
  let sendReplySpy;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sendReplySpy = sandbox.spy(messagesActions, 'sendReply');
  });

  afterEach(() => {
    sendReplySpy.restore();
    sandbox.restore();
  });
  const draft = thread.threadDetails.drafts[0];
  const replyMessage = thread.threadDetails.messages[0];
  const { replyToName } = thread.threadDetails;

  const defaultProps = {
    draft,
    drafts: [draft],
    cannotReply: false,
    editMode: true,
    signature: undefined,
    draftsCount: 1,
    draftsequence: 1,
    replyMessage,
    replyToName,
    draftId: draft.messageId,
    isSaving: false,
    isModalVisible: false,
    confirmedDeleteClicked: false,
  };
  const defaultState = {
    sm: {
      folders: { folder: { folderId: 0 } },
      threadDetails: {
        drafts: [
          {
            ...draft,
            isSaving: false,
            saveError: null,
            lastSaveTime: null,
          },
        ],
        isSaving: false,
      },
      recipients: {
        allRecipients: [
          {
            triageTeamId: 1013155,
            name: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
            stationNumber: '989',
          },
        ],
      },
      alerts: { alertList: [] },
    },
  };

  const setup = ({ initialState = defaultState, props = defaultProps }) =>
    renderWithStoreAndRouter(
      <ReplyDraftItem
        {...props}
        draftId={draft.messageId}
        categories={categories}
        setIsSending={() => {}}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );

  it('renders single draft without errors', async () => {
    const { getByText, getByTestId, findByTestId } = setup({});
    expect(
      getByText(`To: ${replyToName} (Team: ${replyMessage.triageGroupName})`),
    );
    const messageBody = await findByTestId('message-body-field');
    expect(messageBody).to.have.attribute('value', draft.body);
    expect(document.querySelector('.attachments-section')).to.exist;
    expect(getByText('Attachments')).to.exist;
    expect(getByText('Attachments input')).to.exist;
    expect(getByTestId('attach-file-input')).to.exist;
    expect(getByTestId('send-button')).to.exist;
    expect(getByText('Save draft', { selector: 'button' })).to.exist;
    expect(getByText('Delete draft', { selector: 'button' })).to.exist;
  });

  it('renders uneditable draft when cannotReply is true', async () => {
    const customProps = {
      ...defaultProps,
      cannotReply: true,
    };
    const { getByText, queryByTestId } = setup({ props: customProps });
    expect(
      getByText(`To: ${replyToName} (Team: ${replyMessage.triageGroupName})`),
    );
    expect(getByText('Message body.', { selector: 'h3' })).to.exist;
    expect(getByText(draft.body, { selector: 'pre' })).to.exist;
    expect(queryByTestId('message-body-field')).to.not.exist;
    expect(getByText('Delete draft', { selector: 'button' })).to.exist;
    expect(queryByTestId('attach-file-input')).to.not.exist;
    expect(queryByTestId('send-button')).to.not.exist;
  });

  it('dispays "Saving..." message on draft save', async () => {
    const customState = {
      sm: {
        folders: { folder: { folderId: 0 } },
        threadDetails: {
          drafts: [
            {
              ...draft,
              isSaving: true,
              saveError: null,
              lastSaveTime: null,
            },
          ],
          isSaving: true,
          isEditing: true,
        },
      },
    };

    const customProps = {
      ...defaultProps,
      isModalVisible: false,
      draftId: null,
    };

    const { getByText } = setup({
      initialState: customState,
      props: customProps,
    });

    expect(getByText('Saving...').parentNode).to.have.attribute(
      'visible',
      'true',
    );
  });

  it('displays "Your message was saved on..." message on draft save', async () => {
    const lastSaveTime = '2021-04-01T19:20:30.000Z';
    const customState = {
      sm: {
        folders: { folder: { folderId: 0 } },
        threadDetails: {
          drafts: [
            {
              ...draft,
              isSaving: false,
              saveError: null,
              lastSaveTime,
            },
          ],
          isSaving: false,
          lastSaveTime,
        },
      },
    };

    const { getByText } = setup({
      initialState: customState,
    });
    expect(
      getByText(
        `Your message was saved on ${dateFormat(
          lastSaveTime,
          'MMMM D, YYYY [at] h:mm a z',
        )}.`,
      ),
    ).to.exist;
  });

  it('triggers refreshThreadCallback on draft delete', async () => {
    const refreshThreadCallbackSpy = sandbox.spy(
      messagesActions,
      'retrieveMessageThread',
    );

    const customProps = {
      ...defaultProps,
      draftsCount: 2,
    };
    const { getByText, findByTestId } = setup({ props: customProps });
    fireEvent.click(getByText('Delete draft'));
    const deleteDraftModal = await findByTestId('delete-draft-modal');
    const deleteConfirmButton = deleteDraftModal.querySelector(
      'va-button[text="Delete draft"]',
    );
    mockApiRequest({ status: 204, method: 'DELETE' }, true);
    await waitFor(() => {
      fireEvent.click(deleteConfirmButton);
    });
    await waitFor(() => {
      expect(refreshThreadCallbackSpy.calledOnce).to.be.true;
    });
  });

  it('calls sendReply callback on send button click', async () => {
    const customProps = {
      ...defaultProps,
      cannotReply: false,
      editMode: true,
    };
    const { getByTestId } = setup({ props: customProps });
    const sendButton = getByTestId('send-button');
    mockApiRequest({ status: 200, body: {} }, true);
    fireEvent.click(sendButton);
    waitFor(() => {
      expect(sendReplySpy.calledOnce).to.be.true;
      expect(sendReplySpy.lastCall.args[0]).to.include({
        replyToId: 3190971,
        message:
          '{"category":"APPOINTMENTS","body":"draft test postman #1","subject":"Test","draft_id":3190971,"recipient_id":1013155,"station_number":"989"}',
        attachments: false,
        ohTriageGroup: undefined,
      });
    });
  });

  it('calls sendReply callback with ohTriageGroup on send button click', async () => {
    const replyMessageWithOhTriage = {
      ...replyMessage,
      isOhMessage: true,
    };
    const customProps = {
      ...defaultProps,
      replyMessage: replyMessageWithOhTriage,
      cannotReply: false,
      editMode: true,
    };
    const { getByTestId } = setup({ props: customProps });

    const sendButton = getByTestId('send-button');

    mockApiRequest({ status: 200, body: {} }, true);
    fireEvent.click(sendButton);

    waitFor(() => {
      expect(sendReplySpy.calledOnce).to.be.true;
      expect(sendReplySpy.lastCall.args[0]).to.include({
        replyToId: 3190971,
        message:
          '{"category":"APPOINTMENTS","body":"draft test postman #1","subject":"Test","draft_id":3190971,"recipient_id":1013155,"station_number":"989"}',
        attachments: false,
        ohTriageGroup: true,
      });
    });
  });
});
