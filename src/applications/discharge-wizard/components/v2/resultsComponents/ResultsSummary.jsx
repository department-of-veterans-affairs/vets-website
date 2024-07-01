// import React from 'react';
// import PropTypes from 'prop-types';
// import {
//   branchOfService,
//   board,
//   deriveIsAirForceAFRBAPortal,
//   formData,
// } from '../../../helpers';

// import {
//   SHORT_NAME_MAP,
//   QUESTION_MAP,
//   RESPONSES,
// } from '../../../constants/question-data-map';

// const ResultsSummary = ({ formResponses }) => {
//   const forReconsideration =
//     [
//       RESPONSES.PREV_APPLICATION_TYPE_3A,
//       RESPONSES.PREV_APPLICATION_TYPE_3B,
//     ].includes(formResponses[QUESTION_MAP.PREV_APPLICATION_TYPE]) &&
//     ![
//       RESPONSES.FAILURE_TO_EXHAUST_1A,
//       RESPONSES.FAILURE_TO_EXHAUST_1B,
//     ].includes(formResponses[QUESTION_MAP.FAILURE_TO_EXHAUST]);

//   const airForceAFRBAPortal =

//   deriveIsAirForceAFRBAPortal(formValues);

//   let summary = `Based on your answers, you need to complete Department of Defense (DoD) Form ${
//     formData(formValues).num
//   } and send it to the ${board(formValues).name} for the ${branchOfService(
//     formValues['1_branchOfService'],
//   )}${forReconsideration ? ' for reconsideration' : ''}.`;

//   if (airForceAFRBAPortal) {
//     summary =
//       'Based on your answers, you need to complete an Application for Correction of Military Record (DD 149). You can download this form from the Air Force Review Boards Agency Website and Portal.';
//   }

//   return (
//     <section className="va-introtext">
//       <p>{summary}</p>
//     </section>
//   );
// };

// ResultsSummary.propTypes = {
//   formValues: PropTypes.object.isRequired,
// };

// export default ResultsSummary;
