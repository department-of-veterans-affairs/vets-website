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

export function statementOfTruthFullName(formData, fullNamePath) {
  const fullName = get(
    formData,
    typeof fullNamePath === 'function'
      ? fullNamePath(formData)
      : fullNamePath || 'veteran.fullName',
  );

  let fullNameString = fullName?.first || '';

  if (fullName?.middle) {
    fullNameString += ` ${fullName?.middle}`;
  }

  fullNameString += ` ${fullName?.last || ''}`;

  return fullNameString;
}

export function fullNameReducer(fullNameString) {
  return fullNameString?.replaceAll(' ', '').toLowerCase();
}

function statementOfTruthBodyElement(formData, statementOfTruthBody) {
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
          inputValue={form?.data.statementOfTruthSignature}
          inputError={
            (showPreSubmitError || statementOfTruthSignatureBlurred) &&
            fullNameReducer(form?.data.statementOfTruthSignature) !==
              fullNameReducer(
                statementOfTruthFullName(
                  form?.data,
                  statementOfTruth?.fullNamePath,
                ),
              )
              ? `Please enter your name exactly as it appears on your application: ${statementOfTruthFullName(
                  form?.data,
                  statementOfTruth?.fullNamePath,
                )}`
              : undefined
          }
          inputMessageAriaDescribedby={`${statementOfTruth.heading ||
            'Statement of truth'}: ${statementOfTruth.messageAriaDescribedby}`}
          inputLabel={statementOfTruth.textInputLabel || 'Your full name'}
          onVaInputChange={event =>
            setPreSubmit('statementOfTruthSignature', event.detail.value)
          }
          onVaInputBlur={() => setStatementOfTruthSignatureBlurred(true)}
          checked={form?.data.statementOfTruthCertified}
          checkboxError={
            showPreSubmitError && !form?.data.statementOfTruthCertified
              ? 'You must certify by checking the box'
              : undefined
          }
          checkboxLabel={
            statementOfTruth.checkboxLabel ||
            'I certify the information above is correct and true to the best of my knowledge and belief.'
          }
          onVaCheckboxChange={event =>
            setPreSubmit('statementOfTruthCertified', event.detail.checked)
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
