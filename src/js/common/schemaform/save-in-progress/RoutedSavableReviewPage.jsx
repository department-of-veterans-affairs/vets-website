import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SaveFormLink from '../save-in-progress/SaveFormLink';
import SaveStatus from '../save-in-progress/SaveStatus';

import { saveAndRedirectToReturnUrl, autoSaveForm, saveErrors } from './actions';
import { toggleLoginModal } from '../../../login/actions';

import { ReviewPage } from '../review/ReviewPage';
import { setData, setPrivacyAgreement, setEditMode, setSubmission, submitForm, uploadFile } from '../actions';
import { getFormContext } from './selectors';

class RoutedSavableReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = _.debounce(1000, this.autoSave);
  }

  setData = (...args) => {
    this.props.setData(...args);
    this.debouncedAutoSave();
  }

  autoSave = () => {
    const { form, user } = this.props;
    if (user.login.currentlyLoggedIn) {
      const data = form.data;
      const { formId, version } = form;
      const returnUrl = this.props.location.pathname;

      this.props.autoSaveForm(formId, data, version, returnUrl);
    }
  }

  renderErrorMessage = () => {
    const { route, user, form, location } = this.props;
    const errorText = route.formConfig.errorText;
    const savedStatus = form.savedStatus;

    const saveLink = (<SaveFormLink
      locationPathname={location.pathname}
      form={form}
      user={user}
      saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
      toggleLoginModal={this.props.toggleLoginModal}>
      save your application
    </SaveFormLink>);

    if (saveErrors.has(savedStatus)) {
      return saveLink;
    }

    let InlineErrorComponent;
    if (typeof errorText === 'function') {
      InlineErrorComponent = errorText;
    } else if (typeof errorText === 'string') {
      InlineErrorComponent = () => <p>{errorText}</p>;
    } else {
      InlineErrorComponent = () => <p>If it still doesn’t work, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>. We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>;
    }

    return (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header"><strong>We’re sorry, the application didn’t go through.</strong></p>
          <p>We’re working to fix the problem, but it may take us a little while. Please {saveLink} and try submitting it again tomorrow.</p>
          {!user.login.currentlyLoggedIn && <p>If you don’t have an account, you’ll have to start over. Please try submitting your application again tomorrow.</p>}
          <InlineErrorComponent/>
        </div>
      </div>
    );
  }

  render() {
    const { form, user, location } = this.props;

    const contentAfterButtons = (
      <div>
        <SaveStatus
          isLoggedIn={user.login.currentlyLoggedIn}
          showLoginModal={user.login.showModal}
          toggleLoginModal={this.props.toggleLoginModal}
          form={form}>
        </SaveStatus>
        <SaveFormLink
          locationPathname={location.pathname}
          form={form}
          user={user}
          saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
          toggleLoginModal={this.props.toggleLoginModal}/>
      </div>
    );

    return (
      <ReviewPage
        {...this.props}
        setData={this.setData}
        formContext={getFormContext({ user, form })}
        contentAfterButtons={form.submission.status === 'error' ? null : contentAfterButtons}
        renderErrorMessage={this.renderErrorMessage}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    user: state.user
  };
}

const mapDispatchToProps = {
  setEditMode,
  setSubmission,
  submitForm,
  setPrivacyAgreement,
  setData,
  uploadFile,
  saveAndRedirectToReturnUrl,
  autoSaveForm,
  toggleLoginModal
};

RoutedSavableReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutedSavableReviewPage));

export { RoutedSavableReviewPage };
