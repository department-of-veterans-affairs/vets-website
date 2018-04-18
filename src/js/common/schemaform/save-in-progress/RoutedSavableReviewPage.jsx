import PropTypes from 'prop-types';
import Raven from 'raven-js';
import React from 'react';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Scroll from 'react-scroll';
import SaveFormLink from '../save-in-progress/SaveFormLink';
import SaveStatus from '../save-in-progress/SaveStatus';
import { isValidForm } from '../validation';
import { getActivePages } from '../../../../platform/forms/helpers';
import ReviewCollapsibleChapter from '../review/ReviewCollapsibleChapter';
import { focusElement } from '../../../../platform/utilities/ui';

import PrivacyAgreement from '../../components/questions/PrivacyAgreement';
import { saveAndRedirectToReturnUrl, autoSaveForm, saveErrors } from './actions';
import {
  getReviewPageOpenChapters,
  getViewedPages
} from '../state/selectors';
import { toggleLoginModal } from '../../../login/actions';
import SubmitButtons from '../review/SubmitButtons';
import {
  createPageListByChapter,
  expandArrayPages,
  getActiveChapters,
  getPageKeys
} from '../helpers';

import ReviewPage from '../review/ReviewPage';
import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setPrivacyAgreement,
  setEditMode,
  setSubmission,
  setViewedPages,
  submitForm,
  uploadFile
} from '../actions';
import { getFormContext } from './selectors';

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
    const pageList = this.props.pageList;
    const form = this.props.form;

    this.props.setViewedPages(new Set(getPageKeys(pageList, form)));

    scrollToTop();
    focusElement('h4');
  }

  componentWillReceiveProps(nextProps) {
    const nextStatus = nextProps.form.submission.status;
    const previousStatus = this.props.form.submission.status;
    if (nextStatus !== previousStatus && nextStatus === 'applicationSubmitted') {
      this.props.router.push(`${nextProps.route.formConfig.urlPrefix}confirmation`);
    }
  }

  setData = (...args) => {
    this.props.setData(...args);
    if (!this.props.disabledSave) {
      this.debouncedAutoSave();
    }
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

  /*
   * Returns the page list without conditional pages that have not satisfied
   * their dependencies and therefore should be skipped.
   */
  getEligiblePages = () => {
    const { form, route: { pageList, path } } = this.props;
    const eligiblePageList = getActivePages(pageList, form.data);
    const pageIndex = _.findIndex(item => item.pageKey === path, eligiblePageList);
    return { eligiblePageList, pageIndex };
  }

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      this.props.setViewedPages([fullPageKey]);
    }
    this.props.setEditMode(pageKey, editing, index);
  }

  handleSubmit = () => {
    const formConfig = this.props.route.formConfig;
    const { isValid, errors } = isValidForm(this.props.form, this.props.pagesByChapter);
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

  handleToggleChapter({ name, open, pageKeys }) {
    if (open) {
      this.props.closeReviewChapter(name, pageKeys);
    } else {
      this.props.openReviewChapter(name);
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
      chapters,
      disableSave,
      form,
      formConfig,
      formContext,
      location,
      setEditMode,
      setPrivacyAgreement,
      setSubmission,
      setValid,
      submitForm,
      route,
      uploadFile,
      user,
      viewedPages
    } = this.props;

    return (
      <div>
        <div className="input-section">
          <div>
            {chapters.map(chapter => (
              <ReviewCollapsibleChapter
                activePages={chapter.activePages}
                expandedPages={chapter.expandedPages}
                chapterFormConfig={chapter.formConfig}
                chapterKey={chapter.name}
                form={form}
                formContext={formContext}
                key={chapter.name}
                onEdit={this.handleEdit}
                open={chapter.open}
                pageKeys={chapter.pageKeys}
                setData={this.setData}
                setValid={setValid}
                showUnviewedPageWarning={chapter.showUnviewedPageWarning}
                toggleButtonClicked={() => this.handleToggleChapter(chapter)}
                uploadFile={uploadFile}
                viewedPages={viewedPages}/>
            ))}
          </div>
        </div>
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

function mapStateToProps(state, ownProps) {
  // from ownprops
  const formConfig = ownProps.route.formConfig;
  const pageList = ownProps.route.pageList;

  // from redux state
  const form = state.form;
  const formData = state.form.data;
  const openChapters = getReviewPageOpenChapters(state);
  const user = state.user;
  const viewedPages = getViewedPages(state);

  const chapterNames = getActiveChapters(formConfig, formData);
  const chapterFormConfigs = formConfig.chapters;
  const disableSave = formConfig.disableSave;
  const formContext = getFormContext({ form, user });
  const pagesByChapter = createPageListByChapter(formConfig);
  const chapters = chapterNames.reduce((chaptersAcc, chapterName) => {
    const pages = pagesByChapter[chapterName];

    const activePages = getActivePages(pages, formData);
    const expandedPages = expandArrayPages(activePages, formData);
    const chapterFormConfig = formConfig.chapters[chapterName];
    const open = openChapters.includes(chapterName);
    const pageKeys = getPageKeys(pages, formData);
    const showUnviewedPageWarning = pageKeys.some(key => !viewedPages.has(key));

    chaptersAcc.push({
      activePages,
      expandedPages,
      formConfig: chapterFormConfig,
      name: chapterName,
      open,
      pageKeys,
      showUnviewedPageWarning
    });

    return chaptersAcc;
  }, []);

  return {
    chapters,
    disableSave,
    form,
    formConfig,
    formContext,
    pageList,
    pagesByChapter,
    user,
    viewedPages
  };
}

const mapDispatchToProps = {
  autoSaveForm,
  closeReviewChapter,
  openReviewChapter,
  saveAndRedirectToReturnUrl,
  setData,
  setEditMode,
  setPrivacyAgreement,
  setSubmission,
  setViewedPages,
  submitForm,
  toggleLoginModal,
  uploadFile
};

RoutedSavableReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutedSavableReviewPage));

export { RoutedSavableReviewPage };
