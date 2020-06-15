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
import { setPreSubmit, setSubmission, submitForm } from '../actions';

class SubmitController extends React.Component {
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
    const { isValid, errors } = isValidForm(form, pageList);
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
      return;
    }

    // User accepted if required, and no errors, so submit
    this.props.submitForm(formConfig, form);
  };

  /*
*  RenderPreSubmitSection - Component that conditionally renders PreSubmitSection, which is default, or a custom override
*  PreSubmitSection - Default component that renders if no CustomComponent is provided
*  preSubmitInfo.CustomComponent - property that can be added to `preSubmitInfo` object that overwrites `PreSubmitSection`
*/
  RenderPreSubmitSection = () => {
    const { form, formConfig, showPreSubmitError } = this.props;
    const preSubmit = this.getPreSubmit(formConfig);
    const { CustomComponent } = preSubmit;

    return (
      <>
        {CustomComponent ? (
          <CustomComponent
            formData={form.data}
            preSubmitInfo={preSubmit}
            showError={showPreSubmitError}
            onSectionComplete={value =>
              this.props.setPreSubmit(preSubmit.field, value)
            }
          />
        ) : (
          <PreSubmitSection
            checked={form.data[preSubmit.field] || false}
            formData={form.data}
            preSubmitInfo={preSubmit}
            showError={showPreSubmitError}
            onSectionComplete={value =>
              this.props.setPreSubmit(preSubmit.field, value)
            }
          />
        )}
      </>
    );
  };

  render() {
    const { form, renderErrorMessage } = this.props;
    // Render inside SubmitButtons by using `preSubmitSection` so the alert is _above_ the submit button;
    // helps with accessibility

    return (
      <SubmitButtons
        onBack={this.goBack}
        onSubmit={this.handleSubmit}
        submission={form.submission}
        renderErrorMessage={renderErrorMessage}
        preSubmitSection={this.RenderPreSubmitSection()}
      />
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
  };
}

const mapDispatchToProps = {
  setPreSubmit,
  setSubmission,
  submitForm,
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
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SubmitController),
);

// for tests
export { SubmitController };
