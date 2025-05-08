import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { FormPage } from 'platform/forms-system/src/js/containers/FormPage';
import { setData, uploadFile } from 'platform/forms-system/src/js/actions';

import debounce from '../../utilities/data/debounce';

import SaveFormLink from './SaveFormLink';
import SaveStatus from './SaveStatus';
import {
  saveErrors,
  autoSaveForm,
  saveAndRedirectToReturnUrl,
} from './actions';
import { getFormContext } from './selectors';
import { toggleLoginModal } from '../../site-wide/user-nav/actions';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from '../../forms-system/src/js/constants';

class RoutedSavablePage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = debounce(1000, this.autoSave);
    this.cachedContentBeforeButtons = null;
    this.cachedContentBeforeButtonsProps = {};
    this.cachedContentAfterButtons = null;
    this.cachedContentAfterButtonsProps = {};
  }

  onChange = formData => {
    this.props.setData(formData);
    this.debouncedAutoSave();
  };

  getContentBeforeButtons = () => {
    const finishAppLaterMessage =
      this.props.formConfig?.customText?.finishAppLaterMessage ||
      FINISH_APP_LATER_DEFAULT_MESSAGE;

    const nextProps = {
      locationPathname: this.props.location.pathname,
      formConfig: this.props.formConfig,
      route: this.props.route,
      pageList: this.props.route.pageList,
      user: this.props.user,
      showLoginModal: this.props.showLoginModal,
      saveAndRedirectToReturnUrl: this.props.saveAndRedirectToReturnUrl,
      toggleLoginModal: this.props.toggleLoginModal,
      children: finishAppLaterMessage,
    };

    const same =
      this.cachedContentBeforeButtons &&
      Object.keys(nextProps).every(
        key => this.cachedContentBeforeButtonsProps[key] === nextProps[key],
      );

    if (!same) {
      this.cachedContentBeforeButtons = (
        <SaveFormLink
          locationPathname={nextProps.locationPathname}
          formConfig={nextProps.formConfig}
          route={nextProps.route}
          pageList={nextProps.pageList}
          user={nextProps.user}
          showLoginModal={nextProps.showLoginModal}
          saveAndRedirectToReturnUrl={nextProps.saveAndRedirectToReturnUrl}
          toggleLoginModal={nextProps.toggleLoginModal}
        >
          {nextProps.children}
        </SaveFormLink>
      );
      this.cachedContentBeforeButtonsProps = nextProps;
    }

    return this.cachedContentBeforeButtons;
  };

  getContentAfterButtons = () => {
    const nextProps = {
      isLoggedIn: this.props.user.login.currentlyLoggedIn,
      showLoginModal: this.props.showLoginModal,
      toggleLoginModal: this.props.toggleLoginModal,
      formConfig: this.props.formConfig,
    };

    const same =
      this.cachedContentAfterButtons &&
      Object.keys(nextProps).every(
        key => this.cachedContentAfterButtonsProps[key] === nextProps[key],
      );

    if (!same) {
      this.cachedContentAfterButtons = (
        <SaveStatus
          isLoggedIn={nextProps.isLoggedIn}
          showLoginModal={nextProps.showLoginModal}
          toggleLoginModal={nextProps.toggleLoginModal}
          formConfig={nextProps.formConfig}
        />
      );
      this.cachedContentAfterButtonsProps = nextProps;
    }

    return this.cachedContentAfterButtons;
  };

  autoSave() {
    const { form, user, route } = this.props;
    if (user.login.currentlyLoggedIn) {
      const { data, formId, version, submission } = form;
      const returnUrl =
        route.pageConfig?.returnUrl || this.props.location.pathname;
      this.props.autoSaveForm(formId, data, version, returnUrl, submission);
    }
  }

  render() {
    const { user, form } = this.props;

    const contentBeforeButtons = this.getContentBeforeButtons();
    const contentAfterButtons = this.getContentAfterButtons();

    return (
      <FormPage
        {...this.props}
        blockScrollOnMount={saveErrors.has(form.savedStatus)}
        setData={this.onChange}
        formContext={getFormContext({ user, form })}
        contentBeforeButtons={contentBeforeButtons}
        contentAfterButtons={contentAfterButtons}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { appStateSelector } = ownProps.route.pageConfig;
  return {
    form: state.form,
    user: state.user,
    showLoginModal: state.navigation.showLoginModal,
    appStateData: appStateSelector && appStateSelector(state),
    formConfig: ownProps.route.formConfig,
  };
}

const mapDispatchToProps = {
  setData,
  saveAndRedirectToReturnUrl,
  autoSaveForm,
  toggleLoginModal,
  uploadFile,
};

RoutedSavablePage.propTypes = {
  form: PropTypes.object.isRequired,
  autoSaveForm: PropTypes.func,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      finishAppLaterMessage: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      uiSchema: PropTypes.object.isRequired,
    }),
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
  saveAndRedirectToReturnUrl: PropTypes.func,
  setData: PropTypes.func,
  showLoginModal: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
  user: PropTypes.object,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoutedSavablePage),
);

export { RoutedSavablePage };
