import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn } from 'platform/user/selectors';

import {
  getEnrollmentStatus,
  resetEnrollmentStatus as resetEnrollmentStatusAction,
} from '../utils/actions/enrollment-status';
import { didEnrollmentStatusChange } from '../utils/helpers';
import { HCA_ENROLLMENT_STATUSES } from '../utils/constants';
import { selectEnrollmentStatus } from '../utils/selectors';
import IdentityVerificationForm from '../components/IdentityPage/VerificationForm';
import VerificationPageDescription from '../components/IdentityPage/VerificationPageDescription';

const IdentityPage = props => {
  const { router } = props;
  const {
    enrollmentStatus,
    noESRRecordFound,
    isUserInMVI,
    shouldRedirect,
  } = useSelector(selectEnrollmentStatus);
  const { data: formData } = useSelector(state => state.form);
  const loggedIn = useSelector(isLoggedIn);
  const esProps = {
    noESRRecordFound,
    enrollmentStatus,
    shouldRedirect,
  };

  const [localData, setLocalData] = useState({});
  const esPropsRef = useRef(esProps);

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
        'view:isUserInMvi': isUserInMVI,
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

  // redirect to Introduction page if user is logged in
  useEffect(
    () => {
      if (loggedIn) router.push('/');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );

  // reset enrollment status data on when first loading the page
  useEffect(() => {
    const { resetEnrollmentStatus } = props;
    resetEnrollmentStatus();
    focusElement('.va-nav-breadcrumbs-list');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // trigger prefill and navigation if enrollment status criteria is met
  useEffect(
    () => {
      if (didEnrollmentStatusChange(esPropsRef.current, esProps)) {
        const { noneOfTheAbove } = HCA_ENROLLMENT_STATUSES;
        if (noESRRecordFound || enrollmentStatus === noneOfTheAbove) {
          handlers.triggerPrefill();
          handlers.goToNextPage();
        }
      }
      esPropsRef.current = esProps;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [noESRRecordFound, enrollmentStatus, shouldRedirect],
  );

  return (
    <div className="schemaform-intro">
      <VerificationPageDescription onLogin={handlers.showSignInModal} />
      <IdentityVerificationForm
        data={localData}
        onChange={handlers.onChange}
        onSubmit={handlers.onSubmit}
        onLogin={handlers.showSignInModal}
      />
    </div>
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
  submitIDForm: getEnrollmentStatus,
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(IdentityPage);
