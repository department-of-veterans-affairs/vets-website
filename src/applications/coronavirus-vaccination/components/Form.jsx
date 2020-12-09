import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as userSelectors from 'platform/user/selectors';
import { requestStates } from 'platform/utilities/constants';

import * as actions from '../actions';

import initialFormSchema from '../config/schema';
import initialUiSchema from '../config/uiSchema';

import useSubmitForm from '../hooks/useSubmitForm';

function Form({ formState, updateFormData, router, isLoggedIn, profile }) {
  const [submitStatus, submitToApi] = useSubmitForm();

  useEffect(
    () => {
      if (submitStatus === requestStates.succeeded) {
        recordEvent({
          event: 'covid-vaccination--submission-successful',
        });
        router.replace('/confirmation');
      } else {
        recordEvent({
          event: 'covid-vaccination--submission-failed',
        });
      }
    },
    [submitStatus],
  );

  useEffect(
    () => {
      if (formState) {
        // If formState isn't null, then we've already initialized the form
        // so we skip doing it again. This occurs if you navigate to the form,
        // fill out some fields, navigate back to the intro, then back to the form.
        return;
      }

      // Initialize and prefill the form on first render
      let initialFormData = {
        isIdentityVerified: false,
      };

      if (isLoggedIn) {
        recordEvent({
          event: 'covid-vaccination-login-successful-start-form',
        });
        initialFormData = {
          isIdentityVerified: profile?.loa?.current === profile?.loa?.highest,
          firstName: profile?.userFullName?.first,
          lastName: profile?.userFullName?.last,
          birthDate: profile?.dob,
          ssn: undefined,
          email: profile?.vapContactInfo?.email?.emailAddress,
          zipCode: profile?.vapContactInfo?.residentialAddress.zipCode,
          phone: profile?.vapContactInfo?.homePhone
            ? `${profile.vapContactInfo.homePhone.areaCode}${
                profile.vapContactInfo.homePhone.phoneNumber
              }`
            : '',
        };
      } else {
        recordEvent({
          event: 'covid-vaccination-no-login-start-form',
        });
      }

      updateFormData(initialFormSchema, initialUiSchema, initialFormData);
    },
    [formState, updateFormData, isLoggedIn, profile],
  );

  const onFormChange = useCallback(
    nextFormData => {
      updateFormData(formState.formSchema, formState.uiSchema, nextFormData);
    },
    [formState],
  );

  const onFormSubmit = useCallback(
    () => {
      submitToApi(formState.formData);
    },
    [router, formState],
  );

  if (!formState) {
    // The form is being initialized into Redux. Wait til next render.
    return null;
  }

  if (submitStatus === requestStates.pending) {
    return <LoadingIndicator message="Submitting your form..." />;
  }

  return (
    <>
      <h1>COVID-19 vaccines — Stay informed and help us prepare</h1>
      {isLoggedIn ? (
        <p>
          <strong>Note:</strong> Any changes you make to your information here
          won’t change your information in your VA.gov profile or any other
          accounts.
        </p>
      ) : null}
      <SchemaForm
        addNameAttribute
        // "name" and "title" are used only internally to SchemaForm
        name="Coronavirus vaccination"
        title="Coronavirus vaccination"
        data={formState.formData}
        schema={formState.formSchema}
        uiSchema={formState.uiSchema}
        onChange={onFormChange}
        onSubmit={onFormSubmit}
      >
        {submitStatus === requestStates.failed ? (
          <div className="vads-u-margin-bottom-2">
            <AlertBox
              status={ALERT_TYPE.ERROR}
              content="An error occurred while trying to save your form. Please try again later."
            />
          </div>
        ) : null}
        <button type="submit" className="usa-button">
          Submit
        </button>
      </SchemaForm>
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: userSelectors.isLoggedIn(state),
    profile: userSelectors.selectProfile(state),
    formState: state.coronavirusVaccinationApp.formState,
  };
};

const mapDispatchToProps = {
  updateFormData: actions.updateFormData,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form),
);
export { Form };
