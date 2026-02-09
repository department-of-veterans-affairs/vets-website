// libs
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import {
  VaCheckbox,
  VaPrivacyAgreement,
  VaStatementOfTruth,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
/**
 *
 * @param {*} formData
 * @param {StatementOfTruth} statementOfTruth
 * @param {*} profileFullName
 * @returns
 */
export function statementOfTruthFullName(
  formData,
  statementOfTruth,
  profileFullName,
) {
  const { fullNamePath, useProfileFullName } = statementOfTruth;
  let fullName;
  if (useProfileFullName && profileFullName) {
    fullName = profileFullName;
  } else {
    const path =
      typeof fullNamePath === 'function'
        ? fullNamePath(formData)
        : fullNamePath || 'veteran.fullName';
    fullName = get(formData, path);
  }

  return [fullName?.first, fullName?.middle, fullName?.last]
    .filter(Boolean)
    .map(part => part.trim())
    .join(' ');
}

export function fullNameReducer(fullNameString) {
  return fullNameString?.replaceAll(' ', '').toLowerCase();
}

export function statementOfTruthBodyElement(formData, statementOfTruthBody) {
  switch (typeof statementOfTruthBody) {
    case 'function':
      if (typeof statementOfTruthBody(formData) === 'string') {
        return <p>{statementOfTruthBody(formData)}</p>;
      }
      return statementOfTruthBody(formData);
    case 'string':
      return <p>{statementOfTruthBody}</p>;
    default:
      return statementOfTruthBody;
  }
}

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

  const { CustomComponent, statementOfTruth } = preSubmit;
  const checked = form?.data[preSubmit?.field] || false;
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);

  const finishAppLaterMessage =
    formConfig?.customText?.finishAppLaterMessage ||
    FINISH_APP_LATER_DEFAULT_MESSAGE;

  const saveFormLink = (
    <div className="vads-u-margin-top--4">
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
    </div>
  );

  if (CustomComponent) {
    return (
      <>
        <CustomComponent
          formData={form?.data}
          preSubmitInfo={preSubmit}
          showError={showPreSubmitError}
          user={user}
          onSectionComplete={value => setPreSubmit(preSubmit?.field, value)}
        />
        {saveFormLink}
      </>
    );
  }

  return (
    <>
      {statementOfTruth ? (
        <VaStatementOfTruth
          heading={statementOfTruth.heading || 'Statement of truth'}
          inputLabel={statementOfTruth.textInputLabel || 'Your full name'}
          inputValue={form?.data.statementOfTruthSignature}
          inputMessageAriaDescribedby={`${statementOfTruth.heading ||
            'Statement of truth'}: ${statementOfTruth.messageAriaDescribedby}`}
          inputError={
            (showPreSubmitError || statementOfTruthSignatureBlurred) &&
            fullNameReducer(form?.data.statementOfTruthSignature) !==
              fullNameReducer(
                statementOfTruthFullName(
                  form?.data,
                  statementOfTruth,
                  user?.profile?.userFullName,
                ),
              )
              ? `Please enter your name exactly as it appears on your application: ${statementOfTruthFullName(
                  form?.data,
                  statementOfTruth,
                  user?.profile?.userFullName,
                )}`
              : undefined
          }
          checked={form?.data.statementOfTruthCertified}
          onVaInputChange={event =>
            setPreSubmit('statementOfTruthSignature', event.detail.value)
          }
          onVaInputBlur={() => setStatementOfTruthSignatureBlurred(true)}
          onVaCheckboxChange={event =>
            setPreSubmit('statementOfTruthCertified', event.detail.checked)
          }
          checkboxError={
            showPreSubmitError && !form?.data.statementOfTruthCertified
              ? 'You must certify by checking the box'
              : undefined
          }
        >
          {statementOfTruthBodyElement(form?.data, statementOfTruth.body)}
        </VaStatementOfTruth>
      ) : (
        <div>
          {preSubmit.notice}
          {preSubmit.required &&
            (preSubmit.field.includes('privacyAgreement') ? (
              <VaPrivacyAgreement
                required={preSubmit.required}
                checked={checked}
                name={preSubmit.field}
                showError={
                  showPreSubmitError && !checked
                    ? preSubmit.error || 'Please accept'
                    : undefined
                }
                onVaChange={event =>
                  setPreSubmit(preSubmit?.field, event.target.checked)
                }
                uswds
              />
            ) : (
              <VaCheckbox
                required={preSubmit.required}
                checked={checked}
                name={preSubmit.field}
                error={
                  showPreSubmitError && !checked
                    ? preSubmit.error || 'Please accept'
                    : undefined
                }
                label={preSubmit.label}
                description={null}
                onVaChange={event =>
                  setPreSubmit(preSubmit?.field, event.target.checked)
                }
              >
                {preSubmit.description && (
                  <p slot="description">{preSubmit.description}</p>
                )}
              </VaCheckbox>
            ))}
        </div>
      )}
      {saveFormLink}
    </>
  );
}

PreSubmitSection.propTypes = {
  form: PropTypes.shape({
    submission: PropTypes.shape({
      hasAttemptedSubmit: PropTypes.bool,
    }),
    data: PropTypes.object,
  }).isRequired,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      finishAppLaterMessage: PropTypes.string,
    }),
    preSubmitInfo: PropTypes.object,
  }).isRequired,
  setPreSubmit: PropTypes.func.isRequired,
  // added by withRouter
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  preSubmit: PropTypes.object,
  saveAndRedirectToReturnUrl: PropTypes.func,
  showLoginModal: PropTypes.bool,
  showPreSubmitError: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
    profile: PropTypes.shape({
      userFullName: PropTypes.object,
    }),
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
