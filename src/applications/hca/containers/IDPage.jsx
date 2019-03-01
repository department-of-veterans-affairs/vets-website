import React from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { setData } from 'platform/forms-system/src/js/actions';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn, isProfileLoading } from 'platform/user/selectors';

import IDForm from '../components/IDForm';

import { submitIDForm } from '../actions';

class IDPage extends React.Component {
  componentDidMount() {
    // Redirect to intro if a logged in user navigated to this page
    // from another form page.
    if (this.props.shouldRedirect) this.props.router.push('/');
    focusElement('.va-nav-breadcrumbs-list');
  }

  componentDidUpdate() {
    const { enrollmentStatus, form, hasOptionalDD214Upload } = this.props;

    // Redirect to intro if a logged in user directly accessed this page.
    if (this.props.shouldRedirect) this.props.router.push('/');

    const shouldSetDD214UploadFlag =
      hasOptionalDD214Upload && !('view:hasOptionalDD214Upload' in form.data);

    if (shouldSetDD214UploadFlag) {
      this.props.setData({ ...form.data, 'view:hasOptionalDD214Upload': true });
    }

    if (hasOptionalDD214Upload || enrollmentStatus === 'none_of_the_above') {
      this.goToNextPage();
    }
  }

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
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for health care benefits" />
        {this.props.showLoadingIndicator && <LoadingIndicator />}
        {!this.props.showLoadingIndicator && (
          <React.Fragment>
            <AlertBox
              isVisible
              status="info"
              headline="Help us fit this application to your specific needs"
              content={
                <React.Fragment>
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
                </React.Fragment>
              }
            />
            <br />
            <IDForm
              isLoading={this.props.isSubmittingIDForm}
              handleSignIn={this.showSignInModal}
              handleSubmit={this.props.submitIDForm}
            />
          </React.Fragment>
        )}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018" />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setData,
  submitIDForm,
  toggleLoginModal,
};

const mapStateToProps = state => ({
  enrollmentStatus: state.hcaIDForm.enrollmentStatus,
  errors: state.hcaIDForm.errors,
  form: state.form,
  hasOptionalDD214Upload: state.hcaIDForm.hasOptionalDD214Upload,
  isSubmittingIDForm: state.hcaIDForm.isSubmitting,
  shouldRedirect: isLoggedIn(state),
  showLoadingIndicator: isProfileLoading(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDPage);
