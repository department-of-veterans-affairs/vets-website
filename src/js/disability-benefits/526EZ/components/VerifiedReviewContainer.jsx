import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Validator } from 'jsonschema';
import ProgressButton from '@department-of-veterans-affairs/jean-pants/ProgressButton';

import { focusElement, scrollToFirstError } from '../../../../platform/utilities/ui';
import {
  saveAndRedirectToReturnUrl,
  autoSaveForm
} from '../../../common/schemaform/save-in-progress/actions';
import { toggleLoginModal } from '../../../../platform/site-wide/user-nav/actions';
import {
  getNextPagePath,
  getPreviousPagePath
} from '../../../common/schemaform/routing';
import RoutedSavablePage from '../../../common/schemaform/save-in-progress/RoutedSavablePage';
import {
  setData,
  setPrivacyAgreement,
  setEditMode,
  setSubmission,
  submitForm,
  uploadFile
} from '../../../common/schemaform/actions';
import SaveFormLink from '../../../common/schemaform/save-in-progress/SaveFormLink';
import SaveStatus from '../../../common/schemaform/save-in-progress/SaveStatus';

import VerifiedReviewPage from './VerifiedReviewPage';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo(
    'topScrollElement',
    window.VetsGov.scroll || {
      duration: 500,
      delay: 0,
      smooth: true
    }
  );
};

class VerifiedReviewContainer extends React.Component {
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
    if (
      prevProps.route.pageConfig.pageKey !==
        this.props.route.pageConfig.pageKey ||
      _.get('params.index', prevProps) !== _.get('params.index', this.props)
    ) {
      scrollToTop();
      focusElement('h4');
    }
  }

  setData = (...args) => {
    this.props.setData(...args);
    this.debouncedAutoSave();
  };

  autoSave = () => {
    const { form, user } = this.props;
    if (user.login.currentlyLoggedIn) {
      const data = form.data;
      const { formId, version } = form;
      const returnUrl = this.props.location.pathname;

      this.props.autoSaveForm(formId, data, version, returnUrl);
    }
  };

  goBack = () => {
    const { form, route: { pageList }, location } = this.props;
    const path = getPreviousPagePath(pageList, form.data, location.pathname);
    this.props.router.push(path);
  };


  validate = (formData, schema) => {
    const v = new Validator();
    const result = v.validate(
      formData,
      schema
    );

    return {
      isValid: result.valid,
      // removes PII
      errors: result.errors.map(_.unset('instance'))
    };

  }

  goForward = () => {
    const { form, route } = this.props;
    const { pageKey } = route.pageConfig;
    const formData = form.data;
    const { schema } = form.pages[pageKey];
    const { pageList, path } = route;

    const { isValid } = this.validate(formData, schema);
    if (isValid) {
      const pathname = getNextPagePath(pageList, formData, `/${path}`);

      this.props.router.push(pathname);
    } else {
      scrollToFirstError();
    }
  };

  handleEdit = (pageKey, editing, index = null) => {
    this.props.setEditMode(pageKey, editing, index);
  };

  render() {
    const { form, user, formContext, route } = this.props;
    const { title, description, verifiedReviewComponent,
      hideHeaderRow, contentBeforeButtons, pageKey } = route.pageConfig;
    const isNotPrefilled = !form.data.prefilled;

    if (isNotPrefilled) return <RoutedSavablePage {...this.props}/>;
    return (
      <div>
        <VerifiedReviewPage
          onEdit={this.handleEdit}
          verifiedReviewComponent={verifiedReviewComponent}
          pageKey={pageKey}
          title={title}
          description={description}
          hideHeaderRow={hideHeaderRow}
          setData={this.props.setData}
          setValid={this.props.setValid}
          uploadFile={this.props.uploadFile}
          formContext={formContext}
          form={form}/>
        {contentBeforeButtons}
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
            showLoginModal={this.props.showLoginModal}
            toggleLoginModal={this.props.toggleLoginModal}
            form={form}/>
          <SaveFormLink
            locationPathname={this.props.location.pathname}
            form={form}
            user={user}
            showLoginModal={this.props.showLoginModal}
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
    user: state.user,
    showLoginModal: state.navigation.showLoginModal
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

VerifiedReviewContainer.propTypes = {
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VerifiedReviewContainer)
);

export { VerifiedReviewContainer };
