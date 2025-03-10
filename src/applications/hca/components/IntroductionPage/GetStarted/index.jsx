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
  const { showEnrollmentDetails, showOmbInfo } = useSelector(state => {
    const {
      hasApplyStatus,
      hasServerError,
      vesRecordFound,
    } = selectEnrollmentStatus(state);
    const { isESOverrideEnabled } = selectFeatureToggles(state);
    const { isLoggedIn } = selectAuthStatus(state);
    return {
      showEnrollmentDetails:
        isLoggedIn &&
        (vesRecordFound || hasServerError) &&
        !isESOverrideEnabled,
      showOmbInfo: showEnrollmentDetails
        ? !hasServerError && hasApplyStatus
        : true,
    };
  });
  return (
    <>
      {showEnrollmentDetails ? (
        <EnrollmentStatus route={route} />
      ) : (
        <ProcessDescription route={route} />
      )}
      {showOmbInfo && <OMBInfo />}
    </>
  );
};

GetStarted.propTypes = {
  route: PropTypes.object,
};

export default GetStarted;
