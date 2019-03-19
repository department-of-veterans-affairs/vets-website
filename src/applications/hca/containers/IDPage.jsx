import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { setData } from 'platform/forms-system/src/js/actions';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn, isProfileLoading } from 'platform/user/selectors';

import { submitIDForm } from '../actions';
import { idFormSchema as schema, idFormUiSchema as uiSchema } from '../helpers';

function ContinueButton({ isLoading }) {
  return (
    <LoadingButton
      isLoading={isLoading}
      disabled={false}
      type="submit"
      /* to override the `width: 100%` given to SchemaForm submit buttons */
      style={{ width: 'auto' }}
    >
      Continue to the Application
      <span className="button-icon">&nbsp;»</span>
    </LoadingButton>
  );
}

function LoginRequiredAlert({ handleLogin }) {
  return (
    <>
      <AlertBox
        isVisible
        status="error"
        headline="Please sign in to continue your application"
        content={
          <>
            <p>
              We’re sorry for the interruption, but we need you to review some
              information before you continue applying. Please sign in below to
              review. If you don’t have an account, you can create one now.
            </p>
            <button className="usa-button-primary" onClick={handleLogin}>
              Sign in to VA.gov
            </button>
          </>
        }
      />
      <br />
    </>
  );
}

function ServerError() {
  return (
    <AlertBox
      isVisible
      status="error"
      headline="Server Error"
      content={
        <p>
          We’re sorry for the interruption, but we have encountered an error.
          Please try again later.
        </p>
      }
    />
  );
}

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

  componentDidUpdate() {
    const { enrollmentStatus, noESRRecordFound, shouldRedirect } = this.props;

    // Redirect to intro if a logged in user directly accessed this page.
    if (shouldRedirect) this.props.router.push('/');

    if (noESRRecordFound || enrollmentStatus === 'none_of_the_above') {
      this.prefillHCA();
      this.goToNextPage();
    }
  }

  formChange = formData => {
    this.setState({ idFormData: formData });
  };

  formSubmit = ({ formData }) => {
    this.props.submitIDForm(formData);
  };

  // If there is no record on file, we don't want to make the user re-enter data
  // in the HCA that they just entered into the ID Form. So mix the ID Form's
  // data in with the empty HCA Form data.
  prefillHCA = () => {
    const { form, setFormData } = this.props;
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
        <FormTitle title="Apply for health care benefits" />
        {showLoadingIndicator && <LoadingIndicator />}
        {!showLoadingIndicator && (
          <>
            <AlertBox
              isVisible
              status="info"
              headline="Help us fit this application to your specific needs"
              content={
                <>
                  <p>
                    Before you start your health care application, please
                    provide the information below. This will help us make sure
                    the application gathers the right information for us to
                    determine your eligibility.
                  </p>
                  <p>
                    <strong>Want to skip this step?</strong>
                  </p>
                  <button
                    className="va-button-link"
                    onClick={this.showSignInModal}
                  >
                    Sign in to start your application.
                  </button>
                </>
              }
            />
            <br />
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
              {showServerError && <ServerError />}
              {showContinueButton && (
                <ContinueButton isLoading={isSubmittingIDForm} />
              )}
            </SchemaForm>
          </>
        )}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018" />
        </div>
      </div>
    );
  }
}

IDPage.propTypes = {
  enrollmentStatus: PropTypes.string,
  form: PropTypes.object.isRequired,
  isSubmittingIDForm: PropTypes.bool.isRequired,
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
  submitIDForm,
  toggleLoginModal,
};

const mapStateToProps = state => {
  const {
    enrollmentStatus,
    hasServerError,
    isSubmitting,
    loginRequired,
    noESRRecordFound,
  } = state.hcaIDForm;
  return {
    enrollmentStatus,
    form: state.form,
    isSubmittingIDForm: isSubmitting,
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
