import { api } from '../config';

export const SAVE_DRAFT_SUCCESS = 'SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_FAILURE = 'SAVE_DRAFT_FAILURE';

const baseUrl = `${api.url}/message_drafts`;

export function saveDraft(message) {
  const payload = {
    messageDraft: {
      category: message.category,
      subject: message.subject,
      body: message.body,
      recipientId: message.recipientId
    }
  };

  // Save the message as a new draft if it doesn't have an id yet.
  // Update the draft if it does have an id.
  const isNewDraft = message.messageId === undefined;

  const url = isNewDraft
            ? baseUrl
            : `${baseUrl}/${message.messageId}`;

  const defaultSettings = isNewDraft
                        ? api.settings.post
                        : api.settings.put;
  
  const settings = Object.assign({}, defaultSettings, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(url, settings)
    .then(res => res.json())
    .then(
      data => {
        let action = { type: SAVE_DRAFT_SUCCESS, data };

        if (data.errors) {
          action = {
            type: SAVE_DRAFT_FAILURE,
            errors: data.errors
          };
        }

        return dispatch(action);
      },
      err => dispatch({ type: SAVE_DRAFT_FAILURE, err })
    );
  };
}
