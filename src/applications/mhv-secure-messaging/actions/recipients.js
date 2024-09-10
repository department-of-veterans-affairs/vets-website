import { Actions } from '../util/actionTypes';
import { getAllRecipients, updatePreferredRecipients } from '../api/SmApi';
import { getIsPilotFromState } from '.';

const isSignatureRequired = recipients => {
  const regex = /.*\s*(Privacy Issue|Privacy Issues|Release of Information Medical Records|Record Amendment)\s*_*\s*Admin/i;

  return recipients.map(recipient => {
    if (regex.test(recipient.attributes.name)) {
      return {
        ...recipient,
        attributes: {
          ...recipient.attributes,
          signatureRequired: true,
        },
      };
    }
    return recipient;
  });
};

export const getAllTriageTeamRecipients = () => async (dispatch, getState) => {
  const isPilot = getIsPilotFromState(getState);
  try {
    const response = await getAllRecipients(isPilot);
    const updatedResponse = {
      ...response,
      data: isSignatureRequired(response.data),
    };

    dispatch({
      type: Actions.AllRecipients.GET_LIST,
      response: updatedResponse,
    });
  } catch (error) {
    dispatch({
      type: Actions.AllRecipients.GET_LIST_ERROR,
    });
  }
};

export const updateTriageTeamRecipients = recipients => async dispatch => {
  try {
    const response = await updatePreferredRecipients(recipients);

    if (response === 200) {
      dispatch(getAllTriageTeamRecipients());
    }
  } catch (error) {
    dispatch({
      type: Actions.AllRecipients.UPDATE_PREFERRED_ERROR,
    });
  }
};
