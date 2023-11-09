// import { getFacilitiesByIds } from '../api/facilitiesApi';
// import { Actions } from '../util/actionTypes';

// const getAllFacilitiesByIds = facilityIDs => async dispatch => {
//   try {
//     const response = await getFacilitiesByIds(facilityIDs);
//     if (response.data) {
//       dispatch({
//         type: Actions.Facilities.GET,
//         response,
//       });
//     }
//   } catch (error) {
//     dispatch({
//       type: Actions.Facilities.GET_FACILITIES_ERROR,
//       response: error,
//     });
//   }
// };

// const getCernerFacilitiesByIds = facilityIDs => async dispatch => {
//   try {
//     const response = await getFacilitiesByIds(facilityIDs);
//     if (response.data) {
//       dispatch({
//         type: Actions.Facilities.GET_CERNER_FACILITIES,
//         response,
//       });
//     }
//   } catch (error) {
//     dispatch({
//       type: Actions.Facilities.GET_CERNER_FACILITIES_ERROR,
//       response: error,
//     });
//   }
// };
