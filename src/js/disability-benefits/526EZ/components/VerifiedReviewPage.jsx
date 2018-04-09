import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from '../../../common/utils/helpers';
import RoutedSavablePage from '../../../common/schemaform/save-in-progress/RoutedSavablePage';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';
import { setData, setPrivacyAgreement, setEditMode, setSubmission, submitForm, uploadFile } from '../../../common/schemaform/actions';

import SaveFormLink from '../../../common/schemaform/save-in-progress/SaveFormLink';
import SaveStatus from '../../../common/schemaform/save-in-progress/SaveStatus';
import { saveAndRedirectToReturnUrl, autoSaveForm } from '../../../common/schemaform/save-in-progress/actions';
import { toggleLoginModal } from '../../../login/actions';
import { getNextPagePath, getPreviousPagePath } from '../../../common/schemaform/routing';

import formConfig from '../config/form';
import ReviewCollapsiblePage from './ReviewCollapsiblePage';

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
    if (!this.props.blockScrollOnMount) {
      scrollToTop();
      focusElement('h4');
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey ||
      _.get('params.index', prevProps) !== _.get('params.index', this.props)) {
      scrollToTop();
      focusElement('h4');
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
    const { form, route: { pageList }, location } = this.props;
    const path = getPreviousPagePath(pageList, form.data, location.pathname);
    this.props.router.push(path);
  }

  goForward = () => {
    const { form, route, location } = this.props;
    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    this.props.router.push(path);
  }

  handleEdit = (pageKey, editing, index = null) => {
    this.props.setEditMode(pageKey, editing, index);
  }

  render() {
    const { form, user, formContext, route } = this.props;
    const { chapterTitle, chapterKey, pageKey } = route.pageConfig;
    const page = formConfig.chapters[chapterKey].pages[pageKey];
    const isPrefilled = form.data.prefilled;

    if (!form.data.prefilled) return <RoutedSavablePage {...this.props}/>;
    return (
      <div>
        <p>Please review the information we have on file for you. If something doesn’t look right, you can fix it by clicking the Edit button.</p>
        <div className="input-section">
          <div>
            <ReviewCollapsiblePage
              key={chapterTitle(true)}
              onEdit={this.handleEdit}
              page={page}
              chapterKey={chapterKey}
              fullPageKey={pageKey}
              setData={this.props.setData}
              setValid={this.props.setValid}
              uploadFile={this.props.uploadFile}
              chapter={formConfig.chapters[chapterKey]}
              formContext={formContext}
              form={form}/>
          </div>
        </div>
        {page.contentBeforeButtons}
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
        <div>
          <SaveStatus
            isLoggedIn={user.login.currentlyLoggedIn}
            showLoginModal={user.login.showModal}
            toggleLoginModal={this.props.toggleLoginModal}
            form={form}>
          </SaveStatus>
          <SaveFormLink
            locationPathname={this.props.location.pathname}
            form={form}
            user={user}
            saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
            toggleLoginModal={this.props.toggleLoginModal}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    user: state.user
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
