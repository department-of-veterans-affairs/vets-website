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
    const { enrollmentStatus, noESRRecordFound, shouldRedirect } = this.props;

    // Redirect to intro if a logged in user directly accessed this page.
    if (shouldRedirect) this.props.router.push('/');

    if (noESRRecordFound || enrollmentStatus === 'none_of_the_above') {
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
            <IDForm
              errors={this.props.errors}
              enrollmentStatus={this.props.enrollmentStatus}
              isLoading={this.props.isSubmittingIDForm}
              handleSignIn={this.showSignInModal}
              handleSubmit={this.props.submitIDForm}
            />
          </>
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
  noESRRecordFound: state.hcaIDForm.noESRRecordFound,
  isSubmittingIDForm: state.hcaIDForm.isSubmitting,
  shouldRedirect: isLoggedIn(state),
  showLoadingIndicator: isProfileLoading(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDPage);
