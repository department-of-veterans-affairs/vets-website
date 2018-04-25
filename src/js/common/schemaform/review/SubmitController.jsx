import React from 'react';
import Raven from 'raven-js';
import _ from 'lodash/fp';
import PropTypes from 'prop-types';
import SubmitButtons from './SubmitButtons';
import PrivacyAgreement from '../../../../platform/forms/components/PrivacyAgreement';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isValidForm } from '../validation';
import { getActivePages } from '../../../../platform/forms/helpers';
import {
  createPageListByChapter,
  expandArrayPages,
} from '../helpers';

import recordEvent from '../../../../platform/monitoring/record-event';
import {
  setPrivacyAgreement,
  setSubmission
} from '../actions';

class SubmitController extends React.Component {

  goBack = () => {
    const {
      form,
      pageList,
      path,
      router
    } = this.props;

    const eligiblePageList = getActivePages(pageList, form.data);
    const expandedPageList = expandArrayPages(eligiblePageList, this.props.form.data);
    const pageIndex = _.findIndex(item => item.pageKey === path, eligiblePageList);

    router.push(expandedPageList[expandedPageList.length - 2].path);
  }

  handleSubmit = () => {
    debugger;
    const {
      form,
      formConfig,
      pagesByChapter,
      privacyAgreementAccepted,
      setSubmission,
      showPrivacyAgreementError,
      submitForm,
      trackingPrefix
    } = this.props;

    const {
      isValid,
      errors
    } = isValidForm(form, pagesByChapter);

    if (isValid) {
      submitForm(formConfig, form);
    } else {
      // validation errors in this situation are not visible, so we’d
      // like to know if they’re common
      if (privacyAgreementAccepted) {
        recordEvent({
          event: `${trackingPrefix}-validation-failed`,
        });
        Raven.captureMessage('Validation issue not displayed', {
          extra: {
            errors,
            prefix: trackingPrefix
          }
        });
        setSubmission('status', 'validationError');
      }
      setSubmission('hasAttemptedSubmit', true);
    }
  }

  render() {
    const {
      privacyAgreementAccepted,
      renderErrorMessage,
      showPrivacyAgreementError,
      setPrivacyAgreement,
      submission
    } = this.props;
    return (
      <div>
        <p><strong>Note:</strong> According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information. (See 18 U.S.C. 1001)</p>
        <PrivacyAgreement
          required
          onChange={setPrivacyAgreement}
          checked={privacyAgreementAccepted}
          showError={showPrivacyAgreementError}/>
        <SubmitButtons
          onBack={this.goBack}
          onSubmit={this.handleSubmit}
          submission={submission}
          renderErrorMessage={renderErrorMessage}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    formConfig,
    pageList,
    path
  } = ownProps;
  const router = ownProps.router;

  const form = state.form;
  const pagesByChapter = createPageListByChapter(formConfig);
  const trackingPrefix = formConfig.trackingPrefix;
  const submission = form.submission;
  const showPrivacyAgreementError = submission.hasAttemptedSubmit;
  const privacyAgreementAccepted = form.data.privacyAgreementAccepted;

  return {
    form,
    formConfig,
    pagesByChapter,
    pageList,
    path,
    privacyAgreementAccepted,
    router,
    submission,
    showPrivacyAgreementError,
    trackingPrefix
  }
}
const mapDispatchToProps = {
  setPrivacyAgreement,
  setSubmission
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubmitController));
