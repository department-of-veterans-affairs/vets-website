import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import recordEvent from '~/platform/monitoring/record-event';
import {
  fullNameReducer,
  statementOfTruthFullName,
} from '~/platform/forms/components/review/PreSubmitSection';
import { autoSaveForm } from '~/platform/forms/save-in-progress/actions';
import { scrollToFirstError } from '~/platform/forms-system/src/js/utilities/ui';

import SubmitButtons from './SubmitButtons';
import { isValidForm } from '../validation';
import { createPageListByChapter, getActiveExpandedPages } from '../helpers';
import { reduceErrors } from '../utilities/data/reduceErrors';

import {
  setPreSubmit,
  setSubmission,
  submitForm,
  setFormErrors,
} from '../actions';

class SubmitController extends Component {
  componentDidUpdate(prevProps) {
    const nextStatus = this.props.form.submission.status;
    const previousStatus = prevProps.form.submission.status;

    // Handle successful submission
    if (
      nextStatus !== previousStatus &&
      nextStatus === 'applicationSubmitted'
    ) {
      const newRoute = `${this.props.formConfig.urlPrefix}confirmation`;
      this.props.router.push(newRoute);
    }
  }

  getCustomValidationErrors = formData => {
    const { formConfig } = this.props;
    // Call form-specific custom validation if configured
    if (formConfig?.customValidationErrors) {
      return formConfig.customValidationErrors(formData);
    }
    return [];
  };

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
    const { statementOfTruth } = preSubmit;

    if (
      (preSubmit.required && !form.data[preSubmit.field]) ||
      (statementOfTruth &&
        (!form.data.statementOfTruthCertified ||
          fullNameReducer(form.data.statementOfTruthSignature) !==
            fullNameReducer(
              statementOfTruthFullName(
                form.data,
                statementOfTruth,
                user?.profile?.userFullName,
              ),
            )))
    ) {
      this.props.setSubmission('hasAttemptedSubmit', true);
      this.props.setSubmission('timestamp', now);
      // <PreSubmitSection/> is displaying an error for this case
      // Use scrollToFirstError for consistent focus handling across all error types
      // Add setTimeout to prevent focus conflicts on button clicks
      setTimeout(() => {
        scrollToFirstError();
      }, 0);
      return;
    }

    // Custom validation: Call form-specific custom validation if configured
    const customErrors = this.getCustomValidationErrors(form.data);

    // Validation errors in this situation are not visible, so we’d
    // like to know if they’re common
    const { isValid, errors } = isValidForm(form, pageList);
    const { inProgressFormId, version, returnUrl } = form.loadedData?.metadata;
    const submissionData = {
      ...submission,
      hasAttemptedSubmit: true,
      timestamp: now,
    };

    // Combine custom errors with form validation errors
    const allErrors = [...customErrors, ...errors];
    const hasErrors = !isValid || customErrors.length > 0;

    if (hasErrors) {
      const processedErrors = reduceErrors(
        allErrors,
        pageList,
        formConfig.reviewErrors,
      );
      this.props.setFormErrors({
        rawErrors: allErrors,
        errors: processedErrors,
      });
      recordEvent({
        event: `${trackingPrefix}-validation-failed`,
      });
      // Sentry
      Sentry.setUser({ id: user.profile.accountUuid });
      Sentry.withScope(scope => {
        scope.setExtra('rawErrors', allErrors);
        scope.setExtra('errors', processedErrors);
        scope.setExtra('prefix', trackingPrefix);
        scope.setExtra('inProgressFormId', inProgressFormId);
        Sentry.captureMessage('Validation issue not displayed');
      });
      this.props.setSubmission('status', 'validationError');
      this.props.setSubmission('hasAttemptedSubmit', true);

      // DataDog - must be initialized within the app
      if (window.DD_LOGS) {
        window.DD_LOGS.logger.error(
          'Validation issue not displayed',
          {
            errors: processedErrors,
            rawErrors: allErrors,
            inProgressFormId,
            userId: user.profile.accountUuid,
          },
          'validationError',
        );
      }

      if (isLoggedIn && formConfig.prefillEnabled) {
        // Update save-in-progress with failed submit
        submissionData.errors = allErrors;
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
    const { form, formConfig, formErrors = {} } = this.props;

    return (
      <SubmitButtons
        formConfig={formConfig}
        onBack={this.goBack}
        onSubmit={this.handleSubmit}
        submission={form.submission}
        formErrors={formErrors}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { formConfig, pageList } = ownProps;
  const { form, user } = state;

  const { router } = ownProps;
  const pagesByChapter = createPageListByChapter(formConfig);
  const { trackingPrefix } = formConfig;
  const { submission } = form;
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
  setFormErrors,
  autoSaveForm,
};

SubmitController.propTypes = {
  autoSaveForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  pagesByChapter: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  trackingPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  formErrors: PropTypes.shape({}),
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SubmitController),
);

// for tests
export { SubmitController };
