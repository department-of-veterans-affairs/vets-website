import React from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SubmitButtons from './SubmitButtons';
import { PreSubmitSection } from '../components/PreSubmitSection';
import { isValidForm } from '../validation';
import { createPageListByChapter, getActiveExpandedPages } from '../helpers';
import recordEvent from 'platform/monitoring/record-event';
import {
  setPreSubmit,
  setSubmission,
  submitForm,
  setFormErrors,
} from '../actions';
import { formatErrors } from '../utilities/data/formatErrors';

class SubmitController extends React.Component {
  // eslint-disable-next-line
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
    const { form, formConfig, pageList, trackingPrefix } = this.props;

    // If a pre-submit agreement is required, make sure it was accepted
    const preSubmit = this.getPreSubmit(formConfig);
    if (preSubmit.required && !form.data[preSubmit.field]) {
      this.props.setSubmission('hasAttemptedSubmit', true);
      // <PreSubmitSection/> is displaying an error for this case
      return;
    }

    // Validation errors in this situation are not visible, so we’d
    // like to know if they’re common
    const { isValid, errors /* , uiSchema */ } = isValidForm(form, pageList);
    if (!isValid) {
      recordEvent({
        event: `${trackingPrefix}-validation-failed`,
      });
      Sentry.withScope(scope => {
        scope.setExtra('errors', errors);
        scope.setExtra('prefix', trackingPrefix);
        Sentry.captureMessage('Validation issue not displayed');
      });
      this.props.setSubmission('status', 'validationError');
      this.props.setSubmission('hasAttemptedSubmit', true);
      this.props.setFormErrors(
        errors.reduce((acc, err) => {
          if (err.message) {
            acc.push(formatErrors(err.message));
          } else if (Object.keys(err).length) {
            // Only diving in one layer deep here... there might be some deeper
            // errors?
            Object.keys(err).forEach(step => {
              if (err[step]?.__errors.length) {
                acc.push(...err[step].__errors);
              }
            });
          }
          return acc;
        }, []),
      );
      return;
    }

    // User accepted if required, and no errors, so submit
    this.props.submitForm(formConfig, form);
  };

  render() {
    const {
      form,
      formConfig,
      showPreSubmitError,
      renderErrorMessage,
      errors = [],
    } = this.props;
    const preSubmit = this.getPreSubmit(formConfig);

    return (
      <div key={errors.length}>
        <PreSubmitSection
          preSubmitInfo={preSubmit}
          onChange={value => this.props.setPreSubmit(preSubmit.field, value)}
          checked={form.data[preSubmit.field] || false}
          showError={showPreSubmitError}
        />
        <SubmitButtons
          onBack={this.goBack}
          onSubmit={this.handleSubmit}
          submission={form.submission}
          renderErrorMessage={renderErrorMessage}
          errors={errors}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { formConfig, pageList, renderErrorMessage } = ownProps;
  const router = ownProps.router;

  const form = state.form;
  const pagesByChapter = createPageListByChapter(formConfig);
  const trackingPrefix = formConfig.trackingPrefix;
  const submission = form.submission;
  const showPreSubmitError = submission.hasAttemptedSubmit;
  const errors = form.errors;
  return {
    form,
    formConfig,
    pagesByChapter,
    pageList,
    renderErrorMessage,
    router,
    submission,
    showPreSubmitError,
    trackingPrefix,
    errors,
  };
}

const mapDispatchToProps = {
  setPreSubmit,
  setSubmission,
  submitForm,
  setFormErrors,
};

SubmitController.propTypes = {
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  pagesByChapter: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  renderErrorMessage: PropTypes.func,
  router: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
  trackingPrefix: PropTypes.string.isRequired,
  setFormErrors: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SubmitController),
);

// for tests
export { SubmitController };
