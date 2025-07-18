import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// import { getPreviousPagePath } from 'platform/forms-system/src/js/routing';
// import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
// import RegistrationOnlyAlert from '../components/FormAlerts/RegistrationOnlyAlert';
// import FormFooter from '../components/FormFooter';
// import content from '../locales/en/content.json';

// http://localhost:3001/disability/file-disability-claim-form-21-526ez/experimental-review-page

// AJ TODO - figure out how to skip "in progress form" check
// AJ TODO - use sessionStorage to pass data to this page?

const ExperimentalReviewPage = ({ location, route, router }) => {
  const { data: formData } = useSelector(state => state.form);

  return (
    <>
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <h1>Experimental Review Page!!!</h1>
        <p>Fill in all the review info here.... </p>
      </div>
    </>
  );
};

ExperimentalReviewPage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default ExperimentalReviewPage;
