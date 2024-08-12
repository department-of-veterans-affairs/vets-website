import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { within } from '@testing-library/dom';
import reducer from '../../../reducers';
import ReplyDrafts from '../../../components/ComposeForm/ReplyDrafts';
import threadWithOneDraft from '../../fixtures/reducers/thread-with-one-draft-reducer.json';
import threadWithMultipleDrafts from '../../fixtures/reducers/thread-with-multiple-drafts-reducer.json';

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

  it('renders draft with multiple drafts', async () => {
    const customProps = {
      drafts: threadWithMultipleDrafts.threadDetails.drafts,
      cannotReply: false,
      isSaving: false,
      replyToName: threadWithOneDraft.threadDetails.replyToName,
      replyMessage: threadWithMultipleDrafts.threadDetails.messages[0],
      setLastFocusableElement: () => {},
      signature: 'signature',
      isEditing: true,
      setIsEditing: () => {},
    };
    const customState = {
      sm: {
        folders: { folder: { folderId: 0 } },
        threadDetails: {
          drafts: threadWithMultipleDrafts.threadDetails.drafts.map(d => {
            return {
              ...d,
              isSaving: false,
              saveError: null,
              lastSaveTime: null,
            };
          }),
          isSaving: false,
        },
      },
    };
    const { getByText } = setup({
      initialState: customState,
      props: customProps,
    });

    const replyToLabel = getByText('[Draft 3]').nextElementSibling;
    expect(replyToLabel.textContent).to.include('Draft 3 To: DOCTOR, FREEMAN');
    const textarea = replyToLabel.nextElementSibling.nextElementSibling;
    expect(textarea).to.have.attribute('value', customProps.drafts[0].body);
    const attachments = textarea.nextElementSibling;
    expect(attachments.textContent).to.include('Attachments');
    const buttons = attachments.nextElementSibling;
    expect(buttons.querySelector('va-button[text="Send draft 3"]')).to.exist;
    expect(within(buttons).getByTestId('save-draft-button-3')).to.exist;
    expect(within(buttons).getByTestId('delete-draft-button-3')).to.exist;
    expect(getByText('[Draft 2]')).to.exist;
    expect(getByText('[Draft 1]')).to.exist;

    const replyToLabel2 = getByText('[Draft 2]').nextElementSibling;
    expect(replyToLabel2.textContent).to.include('Draft 2 To: DOCTOR, FREEMAN');
    const textarea2 = replyToLabel2.nextElementSibling.nextElementSibling;
    expect(textarea2).to.have.attribute('value', customProps.drafts[1].body);
    const attachments2 = textarea2.nextElementSibling;
    expect(attachments2.textContent).to.include('Attachments');
    const buttons2 = attachments2.nextElementSibling;
    expect(buttons2.querySelector('va-button[text="Send draft 2"]')).to.exist;
    expect(within(buttons2).getByTestId('save-draft-button-2')).to.exist;
    expect(within(buttons2).getByTestId('delete-draft-button-2')).to.exist;
    expect(getByText('[Draft 3]')).to.exist;
    expect(getByText('[Draft 1]')).to.exist;
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

  it('renders draft with multiple drafts and cannotReply is true', async () => {
    const customProps = {
      ...defaultProps,
      cannotReply: true,
      drafts: threadWithMultipleDrafts.threadDetails.drafts,
      replyMessage: threadWithMultipleDrafts.threadDetails.messages[0],
      isEditing: true,
      setIsEditing: () => {},
    };
    const customState = {
      sm: {
        folders: { folder: { folderId: 0 } },
        threadDetails: {
          drafts: threadWithMultipleDrafts.threadDetails.drafts.map(d => {
            return {
              ...d,
              isSaving: false,
              saveError: null,
              lastSaveTime: null,
            };
          }),
          isSaving: false,
        },
      },
    };
    const { getByText } = setup({
      initialState: customState,
      props: customProps,
    });

    const replyToLabel = getByText('[Draft 3]').nextElementSibling;
    expect(replyToLabel.textContent).to.include('Draft 3 To: DOCTOR, FREEMAN');
    const textarea = replyToLabel.nextElementSibling.nextElementSibling;
    expect(textarea.getAttribute('class')).to.contain('old-reply-message-body');
    expect(within(textarea).getByText('Message body.')).to.have.attribute(
      'class',
      'sr-only',
    );
    expect(within(textarea).getByText(customProps.drafts[0].body)).to.exist;

    const buttons = textarea.nextElementSibling;
    expect(buttons.querySelector('va-button[text="Send"]')).to.not.exist;
    expect(within(buttons).queryByTestId('save-draft-button')).to.not.exist;
    expect(within(buttons).getByTestId('delete-draft-button-3')).to.exist;
    expect(getByText('[Draft 2]')).to.exist;
    expect(getByText('[Draft 1]')).to.exist;

    const replyToLabel2 = getByText('[Draft 2]').nextElementSibling;
    expect(replyToLabel2.textContent).to.include('Draft 2 To: DOCTOR, FREEMAN');
    const textarea2 = replyToLabel2.nextElementSibling.nextElementSibling;
    expect(textarea2.getAttribute('class')).to.contain(
      'old-reply-message-body',
    );
    expect(within(textarea2).getByText('Message body.')).to.have.attribute(
      'class',
      'sr-only',
    );
    expect(within(textarea2).getByText(customProps.drafts[1].body)).to.exist;

    const buttons2 = textarea2.nextElementSibling;
    expect(buttons2.querySelector('va-button[text="Send draft 2"]')).to.not
      .exist;
    expect(within(buttons2).queryByTestId('save-draft-button')).to.not.exist;
    expect(within(buttons2).getByTestId('delete-draft-button-2')).to.exist;
    expect(getByText('[Draft 3]')).to.exist;
    expect(getByText('[Draft 1]')).to.exist;
  });
});
