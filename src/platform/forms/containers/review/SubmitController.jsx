// libs
import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// platform - forms components
import ApplicationSubmitted from 'platform/forms/components/review/ApplicationSubmitted';
import ClientError from 'platform/forms/components/review/ClientError';
import GenericError from 'platform/forms/components/review/GenericError';
import SubmitButtons from 'platform/forms/components/review/SubmitButtons';
import FormSubmitPending from 'platform/forms/components/review/FormSubmitPending';
import FormSubmitThrottledError from 'platform/forms/components/review/FormSubmitThrottledError';
import FormValidationError from 'platform/forms/components/review/FormValidationError';

// platform - forms-system components
import { isValidForm } from 'platform/forms-system/src/js/validation';
import { getActiveExpandedPages } from 'platform/forms-system/src/js/helpers';

// actions
import { saveErrors } from 'platform/forms/save-in-progress/actions';
import {
  setPreSubmit,
  setSubmission,
  submitForm,
} from 'platform/forms-system/src/js/actions';

// platform - monitoring
import recordEvent from 'platform/monitoring/record-event';

// platform - forms - selectors
import {
  formSelector,
  preSubmitSelector,
} from 'platform/forms/selectors/review';

// platform - utls
import { SUBMISSION_STATUSES } from 'platform/forms/constants';
import { usePrevious } from 'platform/utilities/react-hooks';

function SubmitController(props) {
  const { form, formConfig, pageList, router, trackingPrefix } = props;
  const { submission } = form;
  const { status } = submission;

  const prevStatus = usePrevious(status);
  const hasSaveError = saveErrors.has(form?.savedStatus);

  const goBack = () => {
    const expandedPageList = getActiveExpandedPages(pageList, form.data);

    // TODO: Fix this bug that assumes there is a confirmation page.
    // Actually, it assumes the app also doesn't add routes at the end!
    // A component at this level should not need to know these things!
    return router.push(expandedPageList[expandedPageList.length - 2].path);
  };

  const onSubmit = () => {
    const preSubmit = preSubmitSelector(formConfig);

    // If a pre-submit agreement is required, make sure it was accepted
    if (preSubmit.required && !form.data[preSubmit.field]) {
      props.setSubmission('hasAttemptedSubmit', true);
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
      props.setSubmission('status', 'validationError');
      props.setSubmission('hasAttemptedSubmit', true);
      return;
    }

    // User accepted if required, and no errors, so submit
    props.submitForm(formConfig, form);
  };

  const [activeComponent, setActiveComponent] = useState(
    <SubmitButtons
      formConfig={formConfig}
      goBack={goBack}
      onSubmit={onSubmit}
    />,
  );

  useEffect(
    () => {
      switch (status) {
        case SUBMISSION_STATUSES.false:
          setActiveComponent(
            <SubmitButtons
              formConfig={formConfig}
              goBack={goBack}
              onSubmit={onSubmit}
            />,
          );
          break;
        case SUBMISSION_STATUSES.applicationSubmitted:
          {
            // TODO: routing
            const newRoute = `${formConfig.urlPrefix}confirmation`;

            setActiveComponent(
              <ApplicationSubmitted
                formConfig={formConfig}
                formSubmission={submission}
                goBack={goBack}
                onSubmit={onSubmit}
              />,
            );

            // TODO: routing
            if (status !== prevStatus) props.router.push(newRoute);
          }
          break;
        case SUBMISSION_STATUSES.clienError:
          setActiveComponent(
            <ClientError
              formConfig={formConfig}
              goBack={goBack}
              onSubmit={onSubmit}
            />,
          );
          break;
        case SUBMISSION_STATUSES.formSubmitPending:
          setActiveComponent(
            <FormSubmitPending
              formConfig={formConfig}
              goBack={goBack}
              onSubmit={onSubmit}
            />,
          );
          break;
        case SUBMISSION_STATUSES.formSubmitThrottledError:
          setActiveComponent(
            <FormSubmitThrottledError
              formConfig={formConfig}
              formSubmission={submission}
              goBack={goBack}
              onSubmit={onSubmit}
            />,
          );
          break;
        case SUBMISSION_STATUSES.formValidationError:
          setActiveComponent(
            <FormValidationError
              formConfig={formConfig}
              goBack={goBack}
              onSubmit={onSubmit}
            />,
          );
          break;
        default:
          setActiveComponent(
            <GenericError
              formConfig={formConfig}
              goBack={goBack}
              hasSaveError={hasSaveError}
              onSubmit={onSubmit}
            />,
          );
          break;
      }
    },
    [status, prevStatus, form, pageList],
  );

  return activeComponent;
}

function mapStateToProps(state, ownProps) {
  const { formConfig, pageList, renderErrorMessage } = ownProps;
  const router = ownProps.router;
  const form = formSelector(state);
  const trackingPrefix = formConfig.trackingPrefix;
  const submission = form.submission;
  const showPreSubmitError = submission.hasAttemptedSubmit;

  return {
    form,
    formConfig,
    pageList,
    renderErrorMessage,
    router,
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
  formConfig: PropTypes.shape({
    urlPrefix: PropTypes.string.isRequired,
  }).isRequired,
  pageList: PropTypes.array.isRequired,
  renderErrorMessage: PropTypes.func,
  router: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
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
