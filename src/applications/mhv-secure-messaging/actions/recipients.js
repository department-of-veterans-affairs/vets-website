import { Actions } from '../util/actionTypes';
import { getAllRecipients, updatePreferredRecipients } from '../api/SmApi';
import { addAlert } from './alerts';
import {
  ALERT_TYPE_ERROR,
  ALERT_TYPE_SUCCESS,
  Alerts,
} from '../util/constants';

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

export const updateTriageTeamRecipients = recipients => async dispatch => {
  try {
    await updatePreferredRecipients(recipients);

    dispatch(getAllTriageTeamRecipients());
    dispatch(
      addAlert(
        ALERT_TYPE_SUCCESS,
        null,
        Alerts.Message.SAVE_CONTACT_LIST_SUCCESS,
      ),
    );
  } catch (error) {
    dispatch({
      type: Actions.AllRecipients.UPDATE_PREFERRED_ERROR,
    });
    dispatch(addAlert(ALERT_TYPE_ERROR, null, Alerts.ContactList.CANNOT_SAVE));
  }
};

export const setActiveCareSystem = selectedCareSystem => dispatch => {
  dispatch({
    type: Actions.AllRecipients.SELECT_HEALTH_CARE_SYSTEM,
    payload: {
      careSystem: selectedCareSystem,
    },
  });
};

export const setActiveCareTeam = selectedCareTeam => dispatch => {
  dispatch({
    type: Actions.AllRecipients.SELECT_CARE_TEAM,
    payload: {
      careTeam: selectedCareTeam,
    },
  });
};

export const setActiveDraftId = draftId => dispatch => {
  dispatch({
    type: Actions.AllRecipients.SET_ACTIVE_DRAFT_ID,
    payload: {
      activeDraftId: draftId,
    },
  });
};
