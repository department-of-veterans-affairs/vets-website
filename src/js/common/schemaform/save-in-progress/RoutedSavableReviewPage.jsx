import PropTypes from 'prop-types';
import Raven from 'raven-js';
import React from 'react';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SaveFormLink from '../save-in-progress/SaveFormLink';
import SaveStatus from '../save-in-progress/SaveStatus';
import { isValidForm } from '../validation';

import PrivacyAgreement from '../../components/questions/PrivacyAgreement';
import { saveAndRedirectToReturnUrl, autoSaveForm, saveErrors } from './actions';
import { getReviewPageOpenChapters } from '../state/selectors';
import { toggleLoginModal } from '../../../login/actions';
import SubmitButtons from '../review/SubmitButtons';
import {
  createPageListByChapter
} from '../helpers';

import { ReviewPage } from '../review/ReviewPage';
import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setPrivacyAgreement,
  setEditMode,
  setSubmission,
  submitForm,
  uploadFile
} from '../actions';
import { getFormContext } from './selectors';

class RoutedSavableReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = _.debounce(1000, this.autoSave);
    this.pagesByChapter = createPageListByChapter(this.props.route.formConfig);
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

  goBack = () => {
    const { eligiblePageList } = this.getEligiblePages();
    const expandedPageList = expandArrayPages(eligiblePageList, this.props.form.data);
    this.props.router.push(expandedPageList[expandedPageList.length - 2].path);
  }

  handleSubmit = () => {
    const formConfig = this.props.route.formConfig;
    const { isValid, errors } = isValidForm(this.props.form, this.pagesByChapter);
    if (isValid) {
      this.props.submitForm(formConfig, this.props.form);
    } else {
      // validation errors in this situation are not visible, so we’d
      // like to know if they’re common
      if (this.props.form.data.privacyAgreementAccepted) {
        recordEvent({
          event: `${formConfig.trackingPrefix}-validation-failed`,
        });
        Raven.captureMessage('Validation issue not displayed', {
          extra: {
            errors,
            prefix: formConfig.trackingPrefix
          }
        });
        this.props.setSubmission('status', 'validationError');
      }
      this.props.setSubmission('hasAttemptedSubmit', true);
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
    const {
      form,
      route,
      location,
      user
    } = this.props;

    const disableSave = !!route.formConfig.disableSave;

    console.log(disableSave);

    return (
      <div>
        <ReviewPage
          {...this.props}
          setData={this.setData}
          formContext={getFormContext({ user, form })}/>
        <p><strong>Note:</strong> According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information. (See 18 U.S.C. 1001)</p>
        <PrivacyAgreement
          required
          onChange={this.props.setPrivacyAgreement}
          checked={form.data.privacyAgreementAccepted}
          showError={form.submission.hasAttemptedSubmit}/>
        <SubmitButtons
          onBack={this.goBack}
          onSubmit={this.handleSubmit}
          submission={form.submission}
          renderErrorMessage={this.renderErrorMessage}/>
        {!disableSave && form.submission.status === 'error' ? null : <div>
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
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    openChapters: getReviewPageOpenChapters(state),
    user: state.user
  };
}

const mapDispatchToProps = {
  closeReviewChapter,
  openReviewChapter,
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
