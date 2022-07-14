import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import recordEvent from 'platform/monitoring/record-event';

import { setData } from 'platform/forms-system/src/js/actions';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
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

class IDPage extends React.Component {
  state = {
    idFormData: {},
  };

  componentDidMount() {
    // Redirect to intro if a logged in user navigated to this page
    // from another form page.
    if (this.props.shouldRedirect) this.props.router.push('/');
    focusElement('.va-nav-breadcrumbs-list');
  }

  componentDidUpdate(prevProps) {
    if (!didEnrollmentStatusChange(prevProps, this.props)) {
      return;
    }

    const { enrollmentStatus, noESRRecordFound, shouldRedirect } = this.props;

    // Redirect to intro if a logged in user directly accessed this page...
    // ...otherwise handle the response from the ID Form
    if (shouldRedirect) {
      this.props.router.push('/');
    } else if (
      noESRRecordFound ||
      enrollmentStatus === HCA_ENROLLMENT_STATUSES.noneOfTheAbove
    ) {
      this.prefillHCA();
      this.goToNextPage();
    }
  }

  formChange = formData => {
    this.setState({ idFormData: formData });
  };

  formSubmit = ({ formData }) => {
    recordEvent({ event: 'hca-continue-application' });
    this.props.submitIDForm(formData);
  };

  // If there is no record on file, we don't want to make the user re-enter data
  // in the HCA that they just entered into the ID Form. So mix the ID Form's
  // data in with the empty HCA Form data.
  prefillHCA = () => {
    const { form, setFormData, isUserInMVI } = this.props;
    const { idFormData } = this.state;
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

  goToNextPage = () => {
    const { form, location, route } = this.props;
    const nextPagePath = getNextPagePath(
      route.pageList,
      form.data,
      location.pathname,
    );
    this.props.router.push(nextPagePath);
  };

  showSignInModal = () => {
    this.props.toggleLoginModal(true);
  };

  render() {
    const {
      isSubmittingIDForm,
      loginRequired,
      showContinueButton,
      showLoadingIndicator,
      showServerError,
    } = this.props;
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
              This will help us fit the application to your specific needs.
              Please fill out the form below. Then we’ll take you to the VA
              health care application (10-10EZ).
            </p>
            <p>
              <strong>Want to skip this step?</strong>
            </p>
            <button
              type="button"
              className="va-button-link"
              onClick={this.showSignInModal}
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
                onSubmit={this.formSubmit}
                onChange={this.formChange}
                data={this.state.idFormData}
              >
                {/* The only reason these components are nested in the
                SchemaForm is to prevent the SchemaForm component from rendering
                its default SUBMIT button */}
                {loginRequired && (
                  <LoginRequiredAlert handleLogin={this.showSignInModal} />
                )}
                {showServerError && <ServerErrorAlert />}
                {showContinueButton && (
                  <LoadingButton
                    /* to override the `width: 100%` given to SchemaForm submit buttons */
                    class="vads-u-width--auto"
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
  }
}

IDPage.propTypes = {
  enrollmentStatus: PropTypes.string,
  form: PropTypes.object.isRequired,
  isSubmittingIDForm: PropTypes.bool.isRequired,
  isUserInMVI: PropTypes.bool.isRequired,
  loginRequired: PropTypes.bool.isRequired,
  noESRRecordFound: PropTypes.bool.isRequired,
  shouldRedirect: PropTypes.bool.isRequired,
  showContinueButton: PropTypes.bool.isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
  showServerError: PropTypes.bool.isRequired,
  submitIDForm: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setFormData: setData,
  submitIDForm: getEnrollmentStatus,
  toggleLoginModal,
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
    showContinueButton: !loginRequired,
    showLoadingIndicator: isProfileLoading(state),
    showServerError: hasServerError,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDPage);
