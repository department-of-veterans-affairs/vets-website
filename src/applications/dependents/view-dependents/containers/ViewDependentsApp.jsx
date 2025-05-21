import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import backendServices from 'platform/user/profile/constants/backendServices';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import titleCase from 'platform/utilities/data/titleCase';

import { fetchAllDependents } from '../actions/index';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';
import { PAGE_TITLE, TITLE_SUFFIX } from '../util';

const ViewDependentsApp = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(fetchAllDependents());
      document.title = `${titleCase(PAGE_TITLE)}${TITLE_SUFFIX}`;
    },
    [dispatch],
  );

  const {
    user,
    loading,
    error,
    onAwardDependents,
    notOnAwardDependents,
    updateDiariesStatus,
    manageDependentsToggle,
    dependencyVerificationToggle,
  } = useSelector(state => ({
    user: state.user,
    loading: state.allDependents.loading,
    error: state.allDependents.error,
    onAwardDependents: state.allDependents.onAwardDependents,
    notOnAwardDependents: state.allDependents.notOnAwardDependents,
    updateDiariesStatus: state.verifyDependents.updateDiariesStatus,
    manageDependentsToggle: toggleValues(state)[
      FEATURE_FLAG_NAMES.manageDependents
    ],
    dependencyVerificationToggle: toggleValues(state)[
      FEATURE_FLAG_NAMES.dependencyVerification
    ],
  }));

  return (
    <div className="vads-l-grid-container vads-u-padding--2">
      <DowntimeNotification
        appTitle="view dependents tool"
        dependencies={[
          externalServices.bgs,
          externalServices.global,
          externalServices.mvi,
          externalServices.vaProfile,
          externalServices.vbms,
        ]}
      >
        <RequiredLoginView
          serviceRequired={backendServices.USER_PROFILE}
          user={user}
        >
          <ViewDependentsLayout
            loading={loading}
            error={error}
            onAwardDependents={onAwardDependents}
            notOnAwardDependents={notOnAwardDependents}
            manageDependentsToggle={manageDependentsToggle}
            dependencyVerificationToggle={dependencyVerificationToggle}
            updateDiariesStatus={updateDiariesStatus}
          />
        </RequiredLoginView>
      </DowntimeNotification>
    </div>
  );
};

ViewDependentsApp.propTypes = {
  fetchAllDependents: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,

  dependencyVerificationToggle: PropTypes.bool,
  error: PropTypes.object,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.bool,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsApp;
