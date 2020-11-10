import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SubmitButtons from './SubmitButtons';
import { isValidForm } from '../validation';
import { createPageListByChapter, getActiveExpandedPages } from '../helpers';
import recordEvent from 'platform/monitoring/record-event';
import { setPreSubmit, setSubmission, submitForm } from '../actions';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';

class SubmitController extends Component {
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextStatus = nextProps.form.submission.status;
    const previousStatus = this.props.form.submission.status;
    if (
      nextStatus !== previousStatus &&
      nextStatus === 'applicationSubmitted'
    ) {
      const newRoute = `${nextProps.formConfig.urlPrefix}confirmation`;
      this.props.router.push(newRoute);
    }
  }

  getPreSubmit = formConfig => ({
    required: false,
    field: 'AGREED',
    label: 'I agree to the terms and conditions.',
    error: 'You must accept the agreement before submitting.',
    ...formConfig.preSubmitInfo,
  });

  goBack = () => {
    const { form, pageList, router } = this.props;

    const expandedPageList = getActiveExpandedPages(pageList, form.data);

    // TODO: Fix this bug that assumes there is a confirmation page.
    // Actually, it assumes the app also doesn't add routes at the end!
    // A component at this level should not need to know these things!
    router.push(expandedPageList[expandedPageList.length - 2].path);
  };

  handleSubmit = () => {
    const { form, formConfig, pageList, trackingPrefix, user } = this.props;
    const { formId, data, submission } = form;
    const isLoggedIn = user?.login?.currentlyLoggedIn;
    const now = new Date().getTime();

    // If a pre-submit agreement is required, make sure it was accepted
    const preSubmit = this.getPreSubmit(formConfig);
    if (preSubmit.required && !form.data[preSubmit.field]) {
      this.props.setSubmission('hasAttemptedSubmit', true);
      this.props.setSubmission('timestamp', now);
      // <PreSubmitSection/> is displaying an error for this case
      return;
    }

    // Validation errors in this situation are not visible, so we’d
    // like to know if they’re common
    const { isValid, errors } = isValidForm(form, pageList);
    const { inProgressFormId, version, returnUrl } = form.loadedData?.metadata;
    const submissionData = {
      ...submission,
      hasAttemptedSubmit: true,
      timestamp: now,
    };

    if (!isValid) {
      recordEvent({
        event: `${trackingPrefix}-validation-failed`,
      });
      Sentry.withScope(scope => {
        scope.setExtra('errors', errors);
        scope.setExtra('prefix', trackingPrefix);
        scope.setExtra('inProgressFormId', inProgressFormId);
        Sentry.captureMessage('Validation issue not displayed');
      });
      this.props.setSubmission('status', 'validationError');
      this.props.setSubmission('hasAttemptedSubmit', true);

      if (isLoggedIn && formConfig.prefillEnabled) {
        // Update save-in-progress with failed submit
        submissionData.errors = errors;
        this.props.autoSaveForm(
          formId,
          data,
          version,
          returnUrl,
          submissionData,
        );
      }
      return;
    }

    if (isLoggedIn && formConfig.prefillEnabled) {
      // Update save-in-progress after attempted submit; if successful, SiP data
      // will be erased
      this.props.autoSaveForm(formId, data, version, returnUrl, submissionData);
    }

    // User accepted if required, and no errors, so submit
    this.props.submitForm(formConfig, form);
  };

  render() {
    const { form, formConfig } = this.props;

    return (
      <SubmitButtons
        formConfig={formConfig}
        onBack={this.goBack}
        onSubmit={this.handleSubmit}
        submission={form.submission}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { formConfig, pageList } = ownProps;
  const router = ownProps.router;

  const form = state.form;
  const pagesByChapter = createPageListByChapter(formConfig);
  const trackingPrefix = formConfig.trackingPrefix;
  const { submission, user } = form;
  const showPreSubmitError = submission.hasAttemptedSubmit;

  return {
    form,
    formConfig,
    pagesByChapter,
    pageList,
    router,
    submission,
    showPreSubmitError,
    trackingPrefix,
    user,
  };
}

const mapDispatchToProps = {
  setPreSubmit,
  setSubmission,
  submitForm,
  autoSaveForm,
};

SubmitController.propTypes = {
  autoSaveForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  pagesByChapter: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
  trackingPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SubmitController),
);

// for tests
export { SubmitController };
