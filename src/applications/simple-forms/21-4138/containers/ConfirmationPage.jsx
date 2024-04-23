import React from 'react';
// import PropTypes from 'prop-types';
// import { connect, useSelector } from 'react-redux';
import { connect } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';
// import { getSubmitterName } from '../helpers';

const content = {
  headlineText: "You've submitted your statement to support your claim",
  nextStepsText: (
    <>
      <p>
        We’ll review your statement. If we have any questions or need additional
        information from you, we’ll contact you.",
      </p>
    </>
  ),
};
const childContent = <div />;

export const ConfirmationPage = () => {
  // const form = useSelector(state => state.form || {});
  // const { submission } = form;
  // const submitDate = submission.timestamp;
  // const confirmationNumber = submission.response?.confirmationNumber;
  // const submitterFullName = getSubmitterName(form.data);
  const submitDate = '01/21/2024';
  const confirmationNumber = '123412341234';
  const submitterFullName = {
    first: 'Burt',
    middle: 'Wurt',
    last: 'Furt',
    suffix: '',
  };

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitterName={submitterFullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      childContent={childContent}
    />
  );
};

// ConfirmationPage.propTypes = {
//   form: PropTypes.shape({
//     data: PropTypes.shape({
//       preparerType: PropTypes.string.isRequired,
//       veteranFullName: {
//         first: PropTypes.string.isRequired,
//         middle: PropTypes.string,
//         last: PropTypes.string.isRequired,
//       },
//       nonVeteranFullName: {
//         first: PropTypes.string.isRequired,
//         middle: PropTypes.string,
//         last: PropTypes.string.isRequired,
//       },
//       thirdPartyFullName: {
//         first: PropTypes.string.isRequired,
//         last: PropTypes.string.isRequired,
//       },
//     }),
//     formId: PropTypes.string,
//     submission: PropTypes.shape({
//       response: PropTypes.shape({
//         attributes: PropTypes.shape({
//           confirmationNumber: PropTypes.string.isRequired,
//         }).isRequired,
//       }).isRequired,
//       timestamp: PropTypes.string.isRequired,
//     }),
//   }),
//   name: PropTypes.string,
// };

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
