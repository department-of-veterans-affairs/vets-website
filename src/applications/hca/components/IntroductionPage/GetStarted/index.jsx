import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectEnrollmentStatus } from '../../../utils/selectors/enrollment-status';
import { selectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import { selectAuthStatus } from '../../../utils/selectors/auth-status';
import ProcessDescription from './ProcessDescription';
import EnrollmentStatus from '../EnrollmentStatus';
import OMBInfo from './OMBInfo';

const GetStarted = ({ route }) => {
  const { isESOverrideEnabled } = useSelector(selectFeatureToggles);
  const { noESRRecordFound, hasServerError, hasApplyStatus } = useSelector(
    selectEnrollmentStatus,
  );
  const { isLoggedIn } = useSelector(selectAuthStatus);
  const showEnrollmentDetails =
    isLoggedIn && (!noESRRecordFound || hasServerError) && !isESOverrideEnabled;
  const showOmbInfo = showEnrollmentDetails
    ? !hasServerError && hasApplyStatus
    : true;

  // render based on enrollment status & feature toggle data
  return (
    <>
      {showEnrollmentDetails ? (
        <EnrollmentStatus route={route} />
      ) : (
        <ProcessDescription route={route} />
      )}
      {showOmbInfo ? <OMBInfo /> : null}
    </>
  );
};

GetStarted.propTypes = {
  route: PropTypes.object,
};

export default GetStarted;
