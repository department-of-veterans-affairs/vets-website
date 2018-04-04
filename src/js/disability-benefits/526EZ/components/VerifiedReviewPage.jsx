import PropTypes from 'prop-types';
import Raven from 'raven-js';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { saveAndRedirectToReturnUrl, autoSaveForm } from '../../../common/schemaform/save-in-progress/actions';
import { toggleLoginModal } from '../../../login/actions';
import ReviewCollapsiblePage from './ReviewCollapsiblePage';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';
import { isValidForm } from '../../../common/schemaform/validation';

import formConfig from '../config/form';

import { focusElement } from '../../../common/utils/helpers';
import { setData, setPrivacyAgreement, setEditMode, setSubmission, submitForm, uploadFile } from '../../../common/schemaform/actions';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class VerifiedReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = _.debounce(1000, this.autoSave);
  }

  componentDidMount() {
    scrollToTop();
    focusElement('h4');
  }

  componentWillReceiveProps(nextProps) {
    const nextStatus = nextProps.form.submission.status;
    const previousStatus = this.props.form.submission.status;
    if (nextStatus !== previousStatus && nextStatus === 'applicationSubmitted') {
      this.props.router.push(`${formConfig.urlPrefix}confirmation`);
    }
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
    this.props.router.push('introduction');
  }

  goForward = () => {
    this.props.router.push('chapter-two/page-one');
  }

  handleSubmit = () => {
    const { isValid, errors } = isValidForm(this.props.form, this.pagesByChapter);
    if (isValid) {
      this.props.submitForm(formConfig, this.props.form);
    } else {
      // validation errors in this situation are not visible, so we’d
      // like to know if they’re common
      if (this.props.form.data.privacyAgreementAccepted) {
        window.dataLayer.push({
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

  handleEdit = (pageKey, editing, index = null) => {
    this.props.setEditMode(pageKey, editing, index);
  }

  render() {
    const { form, contentAfterButtons, formContext } = this.props;
    const chapter = 'reviewVeteranInformation';
    const page = 'reviewVeteranInformation';
    const description = formConfig.chapters[chapter].pages[page].description;

    return (
      <div>
        {description && <p>{description}</p>}
        <div className="input-section">
          <div>
            <ReviewCollapsiblePage
              key={'Review Veteran Information'}
              onEdit={this.handleEdit}
              page={formConfig.chapters[chapter].pages[page]}
              chapterKey={chapter}
              fullPageKey={page}
              setData={this.props.setData}
              setValid={this.props.setValid}
              uploadFile={this.props.uploadFile}
              chapter={formConfig.chapters[chapter]}
              formContext={formContext}
              form={form}/>
          </div>
        </div>
        <div className="row form-progress-buttons schemaform-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
              onButtonClick={this.goBack}
              buttonText="Back"
              buttonClass="usa-button-secondary"
              beforeText="«"/>
          </div>
          <div className="small-6 medium-5 end columns">
            <ProgressButton
              submitButton
              onButtonClick={this.goForward}
              buttonText="Continue"
              buttonClass="usa-button-primary"
              afterText="»"/>
          </div>
        </div>
        {contentAfterButtons}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
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

VerifiedReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  setPrivacyAgreement: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.element,
  renderErrorMessage: PropTypes.func,
  formContext: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifiedReviewPage));

export { VerifiedReviewPage };
