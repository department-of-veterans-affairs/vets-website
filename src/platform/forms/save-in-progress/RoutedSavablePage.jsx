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
  }

  onChange = formData => {
    this.props.setData(formData);
    this.debouncedAutoSave();
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
    const { user, form, formConfig, route } = this.props;
    const finishAppLaterMessage =
      formConfig?.customText?.finishAppLaterMessage ||
      FINISH_APP_LATER_DEFAULT_MESSAGE;
    const contentBeforeButtons = (
      <SaveFormLink
        locationPathname={this.props.location.pathname}
        form={form}
        formConfig={formConfig}
        route={route}
        pageList={route.pageList}
        user={user}
        showLoginModal={this.props.showLoginModal}
        saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
        toggleLoginModal={this.props.toggleLoginModal}
      >
        {finishAppLaterMessage}
      </SaveFormLink>
    );
    const contentAfterButtons = (
      <SaveStatus
        isLoggedIn={user.login.currentlyLoggedIn}
        showLoginModal={this.props.showLoginModal}
        toggleLoginModal={this.props.toggleLoginModal}
        form={form}
        formConfig={formConfig}
      />
    );

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
  connect(mapStateToProps, mapDispatchToProps)(RoutedSavablePage),
);

export { RoutedSavablePage };
