import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Scroll from 'react-scroll';
import SaveFormLink from '../save-in-progress/SaveFormLink';
import SaveStatus from '../save-in-progress/SaveStatus';

import { focusElement } from '../../../../platform/utilities/ui';
import { saveAndRedirectToReturnUrl, autoSaveForm, saveErrors } from './actions';
import { getReviewPageOpenChapters } from '../state/selectors';
import { toggleLoginModal } from '../../../../platform/site-wide/login/actions';
import { getFormContext } from '../save-in-progress/selectors';

import ReviewChapters from '../review/ReviewChapters';
import SubmitController from '../review/SubmitController';

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

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class RoutedSavableReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = _.debounce(1000, this.autoSave);
  }

  componentDidMount() {
    scrollToTop();
    focusElement('h4');
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
    const {
      form,
      formConfig,
      formContext,
      location,
      pageList,
      path,
      user
    } = this.props;

    return (
      <div>
        <ReviewChapters
          formConfig={formConfig}
          formContext={formContext}
          pageList={pageList}/>
        <SubmitController
          formConfig={formConfig}
          pageList={pageList}
          path={path}
          renderErrorMessage={this.renderErrorMessage}/>
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
  }
}

function mapStateToProps(state, ownProps) {
  const {
    formConfig,
    pageList,
    path
  } = ownProps.route;

  const {
    form,
    user
  } = state;

  const formContext = getFormContext({ form, user });
  const openChapters = getReviewPageOpenChapters(state);

  return {
    form,
    formConfig,
    formContext,
    openChapters,
    pageList,
    path,
    user
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
