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
  const { renderEnrollmentStatus, renderOmbInfo } = useSelector(state => {
    const {
      hasApplyStatus,
      hasServerError,
      vesRecordFound,
    } = selectEnrollmentStatus(state);
    const { isESOverrideEnabled } = selectFeatureToggles(state);
    const { isLoggedIn } = selectAuthStatus(state);
    const showEnrollmentDetails =
      isLoggedIn && (vesRecordFound || hasServerError) && !isESOverrideEnabled;
    return {
      renderEnrollmentStatus: showEnrollmentDetails,
      renderOmbInfo: showEnrollmentDetails
        ? !hasServerError && hasApplyStatus
        : true,
    };
  });
  return (
    <>
      {renderEnrollmentStatus ? (
        <EnrollmentStatus route={route} />
      ) : (
        <ProcessDescription route={route} />
      )}
      {renderOmbInfo && <OMBInfo />}
    </>
  );
};

GetStarted.propTypes = {
  route: PropTypes.object,
};

export default GetStarted;
