import { Actions } from '../util/actionTypes';
import { getAllRecipients } from '../api/SmApi';
import { triageGroupsROI } from '../util/constants';

const isSignatureRequired = recipients => {
  return recipients.map(recipient => {
    if (
      triageGroupsROI.some(value => recipient.attributes.name.includes(value))
    ) {
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

export const getAllTriageTeamRecipients = () => async dispatch => {
  try {
    const response = await getAllRecipients();
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
