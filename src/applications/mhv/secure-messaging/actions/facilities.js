import { getFacilitiesByIds } from '../api/facilitiesApi';
import { Actions } from '../util/actionTypes';

export const getAllFacilities = facilities => async dispatch => {
  if (facilities?.length > 0) {
    const ids = facilities.map(facility => `vha_${facility.facilityId}`);
    getFacilitiesByIds(ids).then(response => {
      dispatch({
        type: Actions.Facilities.GET_FACILITIES,
        payload: response,
      });

      const cernerFacilities = facilities.filter(facility => facility.isCerner);

      if (cernerFacilities.length > 0) {
        const cernerFacilitiesFullInfo = response.data.filter(facility =>
          cernerFacilities.some(
            cernerFacility =>
              cernerFacility.facilityId === facility.attributes.uniqueId,
          ),
        );
        dispatch({
          type: Actions.Facilities.GET_CERNER_FACILITIES,
          payload: cernerFacilitiesFullInfo,
        });
      }
    });
  }
  try {
    const response = await getFacilitiesByIds(facilities);
    if (response.data) {
      dispatch({
        type: Actions.Facilities.GET_FACILITIES,
        response,
      });
    }
  } catch (error) {
    dispatch({
      type: Actions.Facilities.GET_FACILITIES_ERROR,
      response: error,
    });
  }
};

export const getCernerFacilitiesByIds = facilityIDs => async dispatch => {
  try {
    const response = await getFacilitiesByIds(facilityIDs);
    if (response.data) {
      dispatch({
        type: Actions.Facilities.GET_CERNER_FACILITIES,
        response,
      });
    }
  } catch (error) {
    dispatch({
      type: Actions.Facilities.GET_CERNER_FACILITIES_ERROR,
      response: error,
    });
  }
};
