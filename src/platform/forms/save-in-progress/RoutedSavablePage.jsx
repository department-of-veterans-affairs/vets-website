import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { FormPage } from 'platform/forms-system/src/js/containers/FormPage';
import {
  setData as setDataAction,
  uploadFile,
} from 'platform/forms-system/src/js/actions';

import debounce from '../../utilities/data/debounce';

import SaveFormLink from './SaveFormLink';
import SaveStatus from './SaveStatus';
import {
  saveErrors,
  autoSaveForm as autoSaveFormAction,
  saveAndRedirectToReturnUrl as saveAndRedirectToReturnUrlAction,
} from './actions';
import { getFormContext } from './selectors';
import { toggleLoginModal as toggleLoginModalAction } from '../../site-wide/user-nav/actions';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from '../../forms-system/src/js/constants';

const RoutedSavablePage = props => {
  const {
    user,
    form,
    formConfig,
    route,
    location,
    showLoginModal,
    setData,
    autoSaveForm,
    saveAndRedirectToReturnUrl,
    toggleLoginModal,
  } = props;

  const debouncedAutoSave = useMemo(
    () =>
      debounce(1000, () => {
        if (user.login.currentlyLoggedIn) {
          const { data, formId, version, submission } = form;
          const returnUrl = route.pageConfig?.returnUrl || location.pathname;
          autoSaveForm(formId, data, version, returnUrl, submission);
        }
      }),
    [user, form, route, location, autoSaveForm],
  );

  const onChange = useCallback(
    formData => {
      setData(formData);
      debouncedAutoSave();
    },
    [setData, debouncedAutoSave],
  );

  const finishAppLaterMessage = useMemo(
    () =>
      formConfig?.customText?.finishAppLaterMessage ||
      FINISH_APP_LATER_DEFAULT_MESSAGE,
    [formConfig],
  );

  const contentBeforeButtons = useMemo(
    () => (
      <SaveFormLink
        locationPathname={location.pathname}
        form={form}
        formConfig={formConfig}
        route={route}
        pageList={route.pageList}
        user={user}
        showLoginModal={showLoginModal}
        saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
        toggleLoginModal={toggleLoginModal}
      >
        {finishAppLaterMessage}
      </SaveFormLink>
    ),
    [
      location.pathname,
      form,
      formConfig,
      route,
      user,
      showLoginModal,
      saveAndRedirectToReturnUrl,
      toggleLoginModal,
      finishAppLaterMessage,
    ],
  );

  const contentAfterButtons = useMemo(
    () => (
      <SaveStatus
        isLoggedIn={user.login.currentlyLoggedIn}
        showLoginModal={showLoginModal}
        toggleLoginModal={toggleLoginModal}
        form={form}
        formConfig={formConfig}
      />
    ),
    [
      user.login.currentlyLoggedIn,
      showLoginModal,
      toggleLoginModal,
      form,
      formConfig,
    ],
  );

  return (
    <FormPage
      {...props}
      blockScrollOnMount={saveErrors.has(form.savedStatus)}
      setData={onChange}
      formContext={getFormContext({ user, form })}
      contentBeforeButtons={contentBeforeButtons}
      contentAfterButtons={contentAfterButtons}
    />
  );
};

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
  setData: setDataAction,
  saveAndRedirectToReturnUrl: saveAndRedirectToReturnUrlAction,
  autoSaveForm: autoSaveFormAction,
  toggleLoginModal: toggleLoginModalAction,
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
      returnUrl: PropTypes.string,
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
