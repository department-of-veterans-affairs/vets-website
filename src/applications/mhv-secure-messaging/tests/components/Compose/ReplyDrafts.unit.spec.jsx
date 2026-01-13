import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import ReplyDrafts from '../../../components/ComposeForm/ReplyDrafts';
import threadWithOneDraft from '../../fixtures/reducers/thread-with-one-draft-reducer.json';

describe('ReplyDrafts component', () => {
  const replyMessage = threadWithOneDraft.threadDetails.messages[0];
  const { drafts, cannotReply, replyToName } = threadWithOneDraft.threadDetails;
  const defaultProps = {
    drafts,
    cannotReply,
    isSaving: false,
    replyToName,
    replyMessage,
    setLastFocusableElement: () => {},
    signature: 'signature',
    isEditing: true,
    setIsEditing: () => {},
  };
  const defaultState = {
    sm: {
      folders: { folder: { folderId: 0 } },
      threadDetails: {
        drafts: drafts.map(d => {
          return { ...d, isSaving: false, saveError: null, lastSaveTime: null };
        }),
        isSaving: false,
      },
    },
  };
  const setup = ({ initialState = defaultState, props = defaultProps }) =>
    renderWithStoreAndRouter(<ReplyDrafts {...props} />, {
      initialState,
      reducers: reducer,
    });
  it('renders draft with one draft', async () => {
    const { getByText, queryByText, findByTestId, getByTestId } = setup({});

    expect(
      getByText(`To: ${replyToName} (Team: ${replyMessage.triageGroupName})`),
    );

    const messageBody = await findByTestId('message-body-field');
    expect(messageBody).to.have.attribute('value', drafts[0].body);
    expect(getByText('Attachments')).to.exist;
    expect(getByText('Attachments input')).to.exist;
    expect(getByTestId('attach-file-input')).to.exist;
    expect(getByTestId('send-button')).to.exist;
    expect(getByText('Save draft', { selector: 'button' })).to.exist;
    expect(getByText('Delete draft', { selector: 'button' })).to.exist;

    expect(queryByText('1 draft')).to.not.exist;
    expect(queryByText('Draft 1')).to.not.exist;
    expect(document.querySelector('va-button[text="Edit draft 2"]')).to.not
      .exist;
    expect(queryByText('Last edited')).to.not.exist;
    expect(document.querySelector('#edit-draft-button')).to.not.exist;
  });

  it('renders draft with one draft and cannotReply is true', async () => {
    const customProps = {
      ...defaultProps,
      cannotReply: true,
    };
    const { getByText, queryByText } = setup({
      props: customProps,
    });
    expect(
      getByText(`To: ${replyToName} (Team: ${replyMessage.triageGroupName})`),
    );
    expect(getByText('Message body.', { selector: 'h3' })).to.exist;
    expect(getByText(drafts[0].body, { selector: 'pre' }).textContent).to.exist;
    expect(queryByText('1 draft')).to.not.exist;
    expect(queryByText('Draft 1')).to.not.exist;
    expect(document.querySelector('va-button[text="Edit draft 2"]')).to.not
      .exist;
    expect(queryByText('Last edited')).to.not.exist;
    expect(document.querySelector('#edit-draft-button')).to.not.exist;
    expect(getByText('Delete draft', { selector: 'button' })).to.exist;
  });
});
