import { api } from '../config';

export const SAVE_DRAFT_SUCCESS = 'SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_FAILURE = 'SAVE_DRAFT_FAILURE';

const baseUrl = `${api.url}/message_drafts`;

export function saveDraft(message) {
  const payload = {
    messageDraft: {
      category: message.category.value,
      subject: message.subject.value,
      body: message.text.value,
      recipientId: +message.recipient.value
    }
  };

  const settings = Object.assign({}, api.settings.post, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(baseUrl, settings)
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
