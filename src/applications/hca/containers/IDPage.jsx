import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import recordEvent from 'platform/monitoring/record-event';

import { setData } from 'platform/forms-system/src/js/actions';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn, isProfileLoading } from 'platform/user/selectors';

import { ServerErrorAlert } from '../components/FormAlerts';
import LoginRequiredAlert from '../components/FormAlerts/LoginRequiredAlert';

import {
  getEnrollmentStatus,
  resetEnrollmentStatus as resetEnrollmentStatusAction,
} from '../utils/actions/enrollment-status';
import { didEnrollmentStatusChange } from '../utils/helpers';
import { HCA_ENROLLMENT_STATUSES } from '../utils/constants';
import {
  idFormSchema as schema,
  idFormUiSchema as uiSchema,
} from '../definitions/idForm';

const IDPage = props => {
  const {
    enrollmentStatus,
    isSubmittingIDForm,
    loginRequired,
    noESRRecordFound,
    resetEnrollmentStatus,
    router,
    shouldRedirect,
    showLoadingIndicator,
    showServerError,
    submitIDForm,
    toggleLoginModal,
  } = props;

  const [idFormData, setIdFormData] = useState({});
  const propsRef = useRef(props);

  const formChange = formData => {
    setIdFormData(formData);
  };

  const formSubmit = ({ formData }) => {
    recordEvent({ event: 'hca-continue-application' });
    submitIDForm(formData);
  };

  const goToNextPage = () => {
    const { form, location, route } = props;
    const nextPagePath = getNextPagePath(
      route.pageList,
      form.data,
      location.pathname,
    );
    router.push(nextPagePath);
  };

  const prefillHCA = () => {
    const { form, setFormData, isUserInMVI } = props;
    const fullName = {
      ...form.data.veteranFullName,
      first: idFormData.firstName,
      middle: idFormData.middleName,
      last: idFormData.lastName,
      suffix: idFormData.suffix,
    };
    setFormData({
      ...form.data,
      'view:isUserInMvi': isUserInMVI,
      'view:veteranInformation': {
        veteranFullName: fullName,
        veteranDateOfBirth: idFormData.dob,
        veteranSocialSecurityNumber: idFormData.ssn,
      },
    });
  };

  const showSignInModal = () => {
    toggleLoginModal(true);
  };

  useEffect(() => {
    if (shouldRedirect) router.push('/');
    resetEnrollmentStatus();
    focusElement('.va-nav-breadcrumbs-list');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      if (didEnrollmentStatusChange(propsRef.current, props)) {
        if (shouldRedirect) {
          router.push('/');
        } else if (
          noESRRecordFound ||
          enrollmentStatus === HCA_ENROLLMENT_STATUSES.noneOfTheAbove
        ) {
          prefillHCA();
          goToNextPage();
        }
      }
      propsRef.current = props;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Before you start your application" />
      {showLoadingIndicator ? (
        <va-loading-indicator
          label="Loading"
          message="Loading your application..."
        />
      ) : (
        <>
          <p>
            We need some information before you can start your application. This
            will help us fit your application to your specific needs.
          </p>
          <p>Then you can fill out the VA health care application (10-10EZ).</p>
          <p className="vads-u-font-weight--bold">Sign in and save time</p>
          <p>
            You can sign in and confirm that the information we have for you is
            up to date and then fill out the VA health care application.
          </p>
          <button
            type="button"
            className="va-button-link"
            onClick={showSignInModal}
            data-testid="idform-login-button"
          >
            Sign in to start your application.
          </button>
          <div className="vads-u-margin-top--2p5">
            <SchemaForm
              name="ID Form"
              title="ID Form"
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={formSubmit}
              onChange={formChange}
              data={idFormData}
            >
              {showServerError && <ServerErrorAlert />}
              {loginRequired && (
                <LoginRequiredAlert handleLogin={showSignInModal} />
              )}
              {!loginRequired &&
                !isSubmittingIDForm && (
                  <ProgressButton
                    buttonClass="vads-u-width--auto idform-submit-button"
                    buttonText="Continue to the application"
                    afterText="»"
                    submitButton
                  />
                )}
              {isSubmittingIDForm && (
                <va-loading-indicator
                  message="Reviewing your information..."
                  class="vads-u-margin-bottom--4"
                  set-focus
                />
              )}
            </SchemaForm>
          </div>
        </>
      )}
    </div>
  );
};

IDPage.propTypes = {
  enrollmentStatus: PropTypes.string,
  form: PropTypes.object,
  isSubmittingIDForm: PropTypes.bool,
  isUserInMVI: PropTypes.bool,
  location: PropTypes.object,
  loginRequired: PropTypes.bool,
  noESRRecordFound: PropTypes.bool,
  resetEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
  router: PropTypes.object,
  setFormData: PropTypes.func,
  shouldRedirect: PropTypes.bool,
  showLoadingIndicator: PropTypes.bool,
  showServerError: PropTypes.bool,
  submitIDForm: PropTypes.func,
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  resetEnrollmentStatus: resetEnrollmentStatusAction,
  setFormData: setData,
  submitIDForm: getEnrollmentStatus,
  toggleLoginModal: toggleLoginModalAction,
};

const mapStateToProps = state => {
  const {
    enrollmentStatus,
    hasServerError,
    isLoadingApplicationStatus,
    isUserInMVI,
    loginRequired,
    noESRRecordFound,
  } = state.hcaEnrollmentStatus;
  return {
    enrollmentStatus,
    form: state.form,
    isSubmittingIDForm: isLoadingApplicationStatus,
    isUserInMVI,
    loginRequired,
    noESRRecordFound,
    shouldRedirect: isLoggedIn(state),
    showLoadingIndicator: isProfileLoading(state),
    showServerError: hasServerError,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDPage);
