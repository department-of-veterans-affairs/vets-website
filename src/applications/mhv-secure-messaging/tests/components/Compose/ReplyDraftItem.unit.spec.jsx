import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../../reducers';
import ReplyDraftItem from '../../../components/ComposeForm/ReplyDraftItem';
import thread from '../../fixtures/reducers/thread-with-multiple-drafts-reducer.json';
import { dateFormat } from '../../../util/helpers';
import * as messagesActions from '../../../actions/messages';

describe('ReplyDraftItem component', () => {
  const draft = thread.threadDetails.drafts[0];
  const replyMessage = thread.threadDetails.messages[0];
  const { replyToName } = thread.threadDetails;

  const defaultProps = {
    draft,
    cannotReply: false,
    editMode: true,
    isSaving: false,
    signature: undefined,
    draftsCount: 1,
    draftsequence: 1,
    replyMessage,
    replyToName,
  };
  const defaultState = { sm: { folders: { folder: { folderId: 0 } } } };

  const setup = ({ initialState = defaultState, props = defaultProps }) =>
    renderWithStoreAndRouter(<ReplyDraftItem {...props} />, {
      initialState,
      reducers: reducer,
    });

  it('renders without errors', async () => {
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
    expect(getByTestId('Send-Button')).to.exist;
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
    expect(queryByTestId('Send-Button')).to.not.exist;
  });

  it('dispays "Saving..." message on draft save', async () => {
    const customState = { sm: { threadDetails: { isSaving: true } } };

    const { getByText } = setup({
      initialState: customState,
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
        threadDetails: {
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
    const refreshThreadCallbackSpy = sinon.spy(
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
});
