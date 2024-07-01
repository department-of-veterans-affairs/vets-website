// import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// import { answerReviewLabel } from '../../helpers';
// import { SHORT_NAME_MAP } from '../../constants/question-data-map';
// import { pageSetup } from '../../utilities/page-setup';
// import { ROUTES } from '../../constants';
// import { navigateBackward } from '../../utilities/page-navigation';

// import ResultsSummary from '../v2/resultsComponents/ResultsSummary';

// const ReviewPage = ({ formResponses, router, viewedIntroPage }) => {
//   const H1 = 'Your Steps for Upgrading Your Discharge';

//   useEffect(
//     () => {
//       pageSetup(H1);
//     },
//     [H1],
//   );

//   useEffect(
//     () => {
//       if (!viewedIntroPage) {
//         router.push(ROUTES.HOME);
//       }
//     },
//     [router, viewedIntroPage],
//   );

//   return (
//     <article className="dw-guidance">
//       <h1>{H1}</h1>
//       <div className="medium-8">
//       <ResultsSummary formResponses={formResponses} />

//         </div>
//     </article>
//   );
// };

// ResultsPage.propTypes = {
//   formResponses: PropTypes.object.isRequired,
//   router: PropTypes.shape({
//     push: PropTypes.func,
//   }).isRequired,
//   viewedIntroPage: PropTypes.bool.isRequired,
// };

// const mapStateToProps = state => ({
//   formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
//   viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
// });

// export default connect(mapStateToProps)(ResultsPage);
