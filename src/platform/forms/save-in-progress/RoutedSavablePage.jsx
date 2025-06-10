import React, { useMemo, useCallback } from 'react';
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

function RoutedSavablePage(props) {
  const {
    form,
    user,
    route,
    location,
    formConfig,
    showLoginModal,
    setData: setDataProp,
    autoSaveForm: autoSaveFormProp,
    saveAndRedirectToReturnUrl,
    toggleLoginModal: toggleLoginModalProp,
    ...restProps
  } = props;

  const autoSave = useCallback(
    () => {
      if (user.login.currentlyLoggedIn) {
        const { data, formId, version, submission } = form;
        const returnUrl = route.pageConfig?.returnUrl || location.pathname;
        autoSaveFormProp(formId, data, version, returnUrl, submission);
      }
    },
    [
      user.login.currentlyLoggedIn,
      form,
      route.pageConfig?.returnUrl,
      location.pathname,
      autoSaveFormProp,
    ],
  );

  const debouncedAutoSave = useMemo(() => debounce(1000, autoSave), [autoSave]);

  const onChange = useCallback(
    formData => {
      setDataProp(formData);
      debouncedAutoSave();
    },
    [setDataProp, debouncedAutoSave],
  );

  const finishAppLaterMessage =
    formConfig?.customText?.finishAppLaterMessage ||
    FINISH_APP_LATER_DEFAULT_MESSAGE;

  const contentBeforeButtons = (
    <SaveFormLink
      locationPathname={location.pathname}
      form={form}
      formConfig={formConfig}
      route={route}
      pageList={route.pageList}
      user={user}
      showLoginModal={showLoginModal}
      saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
      toggleLoginModal={toggleLoginModalProp}
    >
      {finishAppLaterMessage}
    </SaveFormLink>
  );

  const contentAfterButtons = (
    <SaveStatus
      isLoggedIn={user.login.currentlyLoggedIn}
      showLoginModal={showLoginModal}
      toggleLoginModal={toggleLoginModalProp}
      form={form}
      formConfig={formConfig}
    />
  );

  return (
    <FormPage
      {...restProps}
      form={form}
      user={user}
      route={route}
      location={location}
      formConfig={formConfig}
      showLoginModal={showLoginModal}
      blockScrollOnMount={!saveErrors.has(form.savedStatus)}
      setData={onChange}
      formContext={getFormContext({ user, form })}
      contentBeforeButtons={contentBeforeButtons}
      contentAfterButtons={contentAfterButtons}
    />
  );
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

// PropTypes removed - converted to functional component with destructured props

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoutedSavablePage),
);

export { RoutedSavablePage };
