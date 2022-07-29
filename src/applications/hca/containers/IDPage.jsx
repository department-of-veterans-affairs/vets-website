import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
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

import { getEnrollmentStatus } from '../actions';
import {
  didEnrollmentStatusChange,
  idFormSchema as schema,
  idFormUiSchema as uiSchema,
} from '../helpers';
import { HCA_ENROLLMENT_STATUSES } from '../constants';

const IDPage = props => {
  const {
    enrollmentStatus,
    isSubmittingIDForm,
    loginRequired,
    noESRRecordFound,
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
      last: idFormData.lastName,
    };
    setFormData({
      ...form.data,
      veteranFullName: fullName,
      veteranDateOfBirth: idFormData.dob,
      veteranSocialSecurityNumber: idFormData.ssn,
      'view:isUserInMvi': isUserInMVI,
    });
  };

  const showSignInModal = () => {
    toggleLoginModal(true);
  };

  useEffect(() => {
    if (shouldRedirect) router.push('/');
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
      <FormTitle title="We need some information before you can start your application" />
      {showLoadingIndicator ? (
        <va-loading-indicator
          label="Loading"
          message="Loading your application..."
        />
      ) : (
        <>
          <p>
            This will help us fit the application to your specific needs. Please
            fill out the form below. Then we’ll take you to the VA health care
            application (10-10EZ).
          </p>
          <p>
            <strong>Want to skip this step?</strong>
          </p>
          <button
            type="button"
            className="va-button-link"
            onClick={showSignInModal}
          >
            Sign in to start your application.
          </button>
          <div className="vads-u-margin-top--2p5">
            <SchemaForm
              // `name` and `title` are required by SchemaForm, but are only used
              // internally in the component
              name="ID Form"
              title="ID Form"
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={formSubmit}
              onChange={formChange}
              data={idFormData}
            >
              {
                // NOTE: these components are nested in the SchemaForm component to
                // prevent it from rendering its default SUBMIT button
              }
              {showServerError && <ServerErrorAlert />}
              {loginRequired ? (
                <LoginRequiredAlert handleLogin={showSignInModal} />
              ) : (
                <LoadingButton
                  // override the `width: 100%` given to SchemaForm submit buttons
                  className="vads-u-width--auto"
                  isLoading={isSubmittingIDForm}
                  disabled={false}
                  type="submit"
                >
                  Continue to the application
                  <span className="button-icon" aria-hidden="false">
                    &nbsp;»
                  </span>
                </LoadingButton>
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
  setFormData: setData,
  submitIDForm: getEnrollmentStatus,
  toggleLoginModal: toggleLoginModalAction,
};

const mapStateToProps = state => {
  const {
    enrollmentStatus,
    hasServerError,
    isLoading,
    isUserInMVI,
    loginRequired,
    noESRRecordFound,
  } = state.hcaEnrollmentStatus;
  return {
    enrollmentStatus,
    form: state.form,
    isSubmittingIDForm: isLoading,
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
