// libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// formation
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

// platform - forms - selectors
import { preSubmitSelector } from 'platform/forms/selectors/review';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';
import {
  createFormPageList,
  createPageList,
} from 'platform/forms-system/src/js/helpers';

import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';
import { saveAndRedirectToReturnUrl as saveAndRedirectToReturnUrlAction } from 'platform/forms/save-in-progress/actions';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

/*
*  RenderPreSubmitSection - renders PreSubmitSection by default or presubmit.CustomComponent
*  PreSubmitSection - ~Default component that renders if no CustomComponent is provided~ (this describes a decision in RenderPreSubmitSection- describe what PreSubmitSection is, remove this since it's not a prop, or add it as a prop with a default value)
*  preSubmitInfo.CustomComponent - property that can be added to `preSubmitInfo` object that overwrites `PreSubmitSection`
*/

export function PreSubmitSection(props) {
  const {
    form,
    preSubmit = {},
    setPreSubmit,
    showPreSubmitError,
    formConfig,
    user,
    location,
    showLoginModal,
    saveAndRedirectToReturnUrl,
    toggleLoginModal,
  } = props;

  const { CustomComponent } = preSubmit;
  const checked = form?.data[preSubmit?.field] || false;
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);

  const finishAppLaterMessage =
    formConfig?.customText?.finishAppLaterMessage ||
    FINISH_APP_LATER_DEFAULT_MESSAGE;

  return (
    <>
      {CustomComponent ? (
        <CustomComponent
          formData={form?.data}
          preSubmitInfo={preSubmit}
          showError={showPreSubmitError}
          onSectionComplete={value => setPreSubmit(preSubmit?.field, value)}
        />
      ) : (
        <div>
          {preSubmit.notice}
          {preSubmit.required && (
            <Checkbox
              required
              checked={checked}
              onValueChange={value => setPreSubmit(preSubmit?.field, value)}
              name={preSubmit.field}
              errorMessage={
                showPreSubmitError && !checked
                  ? preSubmit.error || 'Please accept'
                  : undefined
              }
              label={preSubmit.label}
            />
          )}
        </div>
      )}
      <SaveFormLink
        form={form}
        formConfig={formConfig}
        pageList={pageList}
        user={user}
        locationPathname={location?.pathname}
        showLoginModal={showLoginModal}
        saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
        toggleLoginModal={toggleLoginModal}
      >
        {finishAppLaterMessage}
      </SaveFormLink>
    </>
  );
}

PreSubmitSection.propTypes = {
  form: PropTypes.shape({
    submission: PropTypes.shape({
      hasAttemptedSubmit: PropTypes.bool,
    }),
  }).isRequired,
  formConfig: PropTypes.shape({
    preSubmitInfo: PropTypes.object,
  }).isRequired,
  showPreSubmitError: PropTypes.bool,
  setPreSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
  }),
  showLoginModal: PropTypes.bool,
  saveAndRedirectToReturnUrl: PropTypes.func,
  toggleLoginModal: PropTypes.func,
  // added by withRouter
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
  saveAndRedirectToReturnUrl: saveAndRedirectToReturnUrlAction,
  toggleLoginModal: toggleLoginModalAction,
};

export default withRouter(
  connect(
    (state, ownProps) => {
      const { form, user } = state;
      const { formConfig } = ownProps || {};

      const preSubmit = preSubmitSelector(formConfig);
      const showPreSubmitError = form?.submission?.hasAttemptedSubmit;
      return {
        form,
        preSubmit,
        showPreSubmitError,
        formConfig,
        user,
        showLoginModal: state.navigation.showLoginModal,
      };
    },
    mapDispatchToProps,
  )(PreSubmitSection),
);
