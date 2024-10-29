import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';
// import { fetchClaimStatus } from '../actions';

const ConfirmationPage = ({ form }) => {
  // const [apiError, setApiError] = useState(false); // Track if a 400 or 500 error happens
  const { formId, data } = form;
  const { fullName } = data;
  let newReceivedDate;

  // // Fetch claim status if not already available
  // useEffect(
  //   () => {
  //     if (!claimStatus && !apiError) {
  //       getClaimStatus('Chapter35')
  //         .then(response => {
  //           // Only trigger error if response has a status code >= 400
  //           if (response?.status >= 400) {
  //             setApiError(true); // Set error if the response status indicates a failure
  //           }
  //         })
  //         .catch(() => {
  //           // Catch any network errors and set error to true
  //           setApiError(true);
  //         });
  //     }
  //   },
  //   [getClaimStatus, claimStatus, apiError],
  // );

  // Set up scroll and focus when the component mounts
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  // Print page handler
  const printPage = useCallback(() => {
    window.print();
  }, []);

  // // Handle API errors
  // if (apiError) {
  //   return (
  //     <UnderReviewConfirmation
  //       user={`${fullName.first} ${fullName.middle || ''} ${
  //         fullName.last
  //       } ${fullName.suffix || ''}`}
  //       dateReceived={newReceivedDate}
  //       formId={formId}
  //       printPage={printPage}
  //     />
  //   );
  // }

  // // Show loading indicator while waiting for claim status
  // if (!claimStatus) {
  //   return (
  //     <va-loading-indicator
  //       class="vads-u-margin-y--5"
  //       label="Loading"
  //       message="Loading your results..."
  //       set-focus
  //     />
  //   );
  // }

  // Render the UnderReviewConfirmation component once the claim status is available
  return (
    <UnderReviewConfirmation
      user={`${fullName.first} ${fullName.middle || ''} ${
        fullName.last
      } ${fullName.suffix || ''}`}
      dateReceived={newReceivedDate}
      formId={formId}
      printPage={printPage}
    />
  );
};

const mapStateToProps = state => ({
  // claimStatus: state?.data?.claimStatus,
  form: state.form,
});

// const mapDispatchToProps = {
//   getClaimStatus: fetchClaimStatus,
// };

ConfirmationPage.propTypes = {
  // getClaimStatus: PropTypes.func.isRequired,
  // claimStatus: PropTypes.shape({
  //   claimStatus: PropTypes.string,
  //   receivedDate: PropTypes.string,
  // }),
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }),
    }),
    formId: PropTypes.string,
  }),
};

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(ConfirmationPage);
