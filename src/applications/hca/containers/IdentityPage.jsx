import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn } from 'platform/user/selectors';

import {
  fetchEnrollmentStatus,
  resetEnrollmentStatus as resetEnrollmentStatusAction,
} from '../utils/actions/enrollment-status';
import { HCA_ENROLLMENT_STATUSES } from '../utils/constants';
import { selectEnrollmentStatus } from '../utils/selectors/enrollment-status';
import useAfterRenderEffect from '../hooks/useAfterRenderEffect';
import IdentityVerificationForm from '../components/IdentityPage/VerificationForm';
import VerificationPageDescription from '../components/IdentityPage/VerificationPageDescription';
import FormFooter from '../components/FormFooter';

const IdentityPage = props => {
  const { router } = props;
  const {
    statusCode,
    vesRecordFound,
    fetchAttempted,
    isUserInMPI,
  } = useSelector(selectEnrollmentStatus);
  const { data: formData } = useSelector(state => state.form);
  const loggedIn = useSelector(isLoggedIn);
  const [localData, setLocalData] = useState({});

  /**
   * declare event handlers
   *  - onChange - fired when data from local form components is updated
   *  - onSubmit - fired on click of continue button - validates form data
   *  - goToNextPage - fired on successful enrollment status API return - go to the first page in the form
   *  - triggerPrefill - fired on successful enrollment status API return - prefill form data based on inputs from identity form
   *  - showSignInModal - fired on click of sign in button - show modal for logging into VA.gov
   */
  const handlers = {
    onChange: data => {
      setLocalData(data);
    },
    onSubmit: data => {
      const { submitIDForm } = props;
      const { formData: dataToSubmit } = data;
      recordEvent({ event: 'hca-continue-application' });
      submitIDForm(dataToSubmit);
    },
    goToNextPage: () => {
      const {
        location: { pathname },
        route: { pageList },
      } = props;
      const nextPagePath = getNextPagePath(pageList, formData, pathname);
      router.push(nextPagePath);
    },
    triggerPrefill: () => {
      const { setFormData } = props;
      const { veteranFullName } = formData;
      const fullName = {
        ...veteranFullName,
        first: localData.firstName,
        middle: localData.middleName,
        last: localData.lastName,
        suffix: localData.suffix,
      };
      const {
        dob: veteranDateOfBirth,
        ssn: veteranSocialSecurityNumber,
      } = localData;
      setFormData({
        ...formData,
        veteranDateOfBirth,
        'view:isUserInMvi': isUserInMPI,
        'view:veteranInformation': {
          veteranFullName: fullName,
          veteranDateOfBirth,
          veteranSocialSecurityNumber,
        },
      });
    },
    showSignInModal: () => {
      const { toggleLoginModal } = props;
      toggleLoginModal(true);
    },
  };

  /**
   * reset enrollment status data on when first loading the page if user is
   * not logged in, else redirect to introduction page
   */
  useEffect(
    () => {
      if (loggedIn) {
        router.push('/');
      } else {
        const { resetEnrollmentStatus } = props;
        resetEnrollmentStatus();
        focusElement('.va-nav-breadcrumbs-list');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );

  // trigger prefill and navigation if enrollment status criteria is met
  useAfterRenderEffect(
    () => {
      if (fetchAttempted) {
        const { noneOfTheAbove } = HCA_ENROLLMENT_STATUSES;
        const canGoToNext = !vesRecordFound || statusCode === noneOfTheAbove;
        if (canGoToNext) {
          handlers.triggerPrefill();
          handlers.goToNextPage();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchAttempted],
  );

  return (
    <>
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <VerificationPageDescription onLogin={handlers.showSignInModal} />
        <IdentityVerificationForm
          data={localData}
          onChange={handlers.onChange}
          onSubmit={handlers.onSubmit}
          onLogin={handlers.showSignInModal}
        />
      </div>
      <FormFooter />
    </>
  );
};

IdentityPage.propTypes = {
  location: PropTypes.object,
  resetEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
  router: PropTypes.object,
  setFormData: PropTypes.func,
  submitIDForm: PropTypes.func,
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  resetEnrollmentStatus: resetEnrollmentStatusAction,
  setFormData: setData,
  submitIDForm: fetchEnrollmentStatus,
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(IdentityPage);
