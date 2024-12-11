import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  selectAuthStatus,
  selectFeatureToggles,
  selectEnrollmentStatus,
} from '../../../utils/selectors';
import ProcessDescription from './ProcessDescription';
import EnrollmentStatus from '../EnrollmentStatus';
import OMBInfo from './OMBInfo';

const GetStarted = ({ route }) => {
  const { isESOverrideEnabled } = useSelector(selectFeatureToggles);
  const { vesRecordFound, hasServerError, hasApplyStatus } = useSelector(
    selectEnrollmentStatus,
  );
  const { isLoggedIn } = useSelector(selectAuthStatus);
  const showEnrollmentDetails =
    isLoggedIn && (vesRecordFound || hasServerError) && !isESOverrideEnabled;
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
