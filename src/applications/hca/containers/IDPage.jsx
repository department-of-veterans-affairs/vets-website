import React from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';

import IDForm from '../components/IDForm';

import { submitIDForm } from '../actions';

class IDPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  componentDidUpdate(prevProps) {
    // there's no need for logged-in users to see this page
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.router.push('/');
    }
  }

  getContent = () => {
    if (this.props.isProfileLoading) {
      return <LoadingIndicator />;
    }
    return (
      <React.Fragment>
        <AlertBox
          isVisible
          status="info"
          headline="Help us fit this application to your specific needs"
          content={
            <React.Fragment>
              <p>
                Before you start your health care application, please provide
                the information below. This will help us make sure the
                application gathers the right information for us to determine
                your eligibility.
              </p>
              <p>
                <strong>Want to skip this step?</strong>
              </p>
              <button
                className="va-button-link"
                onClick={() => this.props.toggleLoginModal(true)}
              >
                Sign in to start your application.
              </button>
            </React.Fragment>
          }
        />
        <br />
        <IDForm
          isLoading={this.props.isLoading}
          handleSubmit={this.props.submitForm}
        />
        {this.props.error && (
          <AlertBox
            isVisible
            status="error"
            headline="Please sign in to continue your application"
            content={
              <React.Fragment>
                <p>
                  We’re sorry for the interruption, but we need you to review
                  some information before you continue applying. Please sign in
                  below to review. If you don’t have an account, you can create
                  one now.
                </p>
                <button className="usa-button-primary" onClick={this.goToLogin}>
                  Sign in to VA.gov
                </button>
              </React.Fragment>
            }
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for health care benefits" />
        {this.getContent()}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018" />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  submitForm: submitIDForm,
  toggleLoginModal,
};

const mapStateToProps = state => ({
  isLoading: state.hcaIDForm.isLoading,
  error: state.hcaIDForm.error,
  isProfileLoading: isProfileLoading(state),
  isLoggedIn: isLoggedIn(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDPage);
