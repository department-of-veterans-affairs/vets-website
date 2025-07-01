import { subMonths } from 'date-fns';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { Actions } from '../util/actionTypes';
import {
  getAllRecipients,
  updatePreferredRecipients,
  searchFolderAdvanced,
} from '../api/SmApi';
import { getIsPilotFromState } from '.';
import { addAlert } from './alerts';
import {
  ALERT_TYPE_ERROR,
  ALERT_TYPE_SUCCESS,
  Alerts,
  DefaultFolders,
} from '../util/constants';

const isSignatureRequired = recipient => {
  const regex = /.*\s*(Privacy Issue|Privacy Issues|Release of Information Medical Records|Record Amendment)\s*_*\s*Admin/i;
  return regex.test(recipient.attributes.name);
};

export const getAllTriageTeamRecipients = () => async (dispatch, getState) => {
  const isPilot = getIsPilotFromState(getState);
  const ehrDataByVhaId = selectEhrDataByVhaId(getState());
  try {
    const response = await getAllRecipients(isPilot);
    const updatedResponse = {
      ...response,
      data: response.data.map(recipient => {
        return {
          ...recipient,
          attributes: {
            ...recipient.attributes,
            signatureRequired: isSignatureRequired(recipient),
            healthCareSystemName:
              recipient.attributes.healthCareSystemName ||
              getVamcSystemNameFromVhaId(
                ehrDataByVhaId,
                recipient.attributes.stationNumber,
              ),
          },
        };
      }),
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

export const getRecentRecipients = (numberOfMonths = 6) => async (
  dispatch,
  getState,
) => {
  try {
    // Define default date range (last 6 months)
    const toDateTime = new Date().toISOString();
    const fromDateTime = subMonths(new Date(), numberOfMonths).toISOString();

    const query = {
      fromDate: fromDateTime,
      toDate: toDateTime,
    };

    const isPilot = getIsPilotFromState(getState);

    // Optionally use the response or dispatch an action with it
    const response = await searchFolderAdvanced(
      DefaultFolders.SENT.id,
      query,
      isPilot,
    );

    // Extract and return up to 4 unique recipientId values from the response (array of messages)
    const recentRecipients = [
      ...new Set((response?.data || []).map(msg => msg.attributes.recipientId)),
    ];
    dispatch({
      type: Actions.AllRecipients.GET_RECENT,
      response: recentRecipients,
    });
  } catch (error) {
    dispatch({
      type: Actions.AllRecipients.GET_RECENT_ERROR,
    });
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
