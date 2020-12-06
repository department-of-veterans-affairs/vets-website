import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as userSelectors from 'platform/user/selectors';

import * as actions from '../actions';

import initialFormSchema from '../config/schema';
import initialUiSchema from '../config/uiSchema';

function Form({ formState, updateFormData, router, isLoggedIn, profile }) {
  useEffect(
    () => {
      // Initialize and prefill the form on first render
      let initialFormData = {};

      if (isLoggedIn) {
        initialFormData = {
          firstName: profile?.userFullName?.first,
          lastName: profile?.userFullName?.last,
          dateOfBirth: profile?.dob,
          ssn: undefined,
          emailAddress: profile?.vapContactInfo?.email?.emailAddress,
          phone: profile?.vapContactInfo?.homePhone
            ? `${profile.vapContactInfo.homePhone.areaCode}${
                profile.vapContactInfo.homePhone.phoneNumber
              }`
            : '',
        };
      }

      updateFormData(initialFormSchema, initialUiSchema, initialFormData);
    },
    [updateFormData, isLoggedIn, profile],
  );

  const onFormChange = useCallback(
    nextFormData => {
      updateFormData(formState.formSchema, formState.uiSchema, nextFormData);
    },
    [formState],
  );

  const onSubmit = useCallback(
    () => {
      // console.log(formState);
      router.replace('/confirmation');
    },
    [router, formState],
  );

  if (!formState) {
    // The form is being initialized into Redux. Wait til next render.
    return null;
  }

  return (
    <SchemaForm
      addNameAttribute
      // "name" and "title" are used only internally to SchemaForm
      name="Coronavirus vaccination"
      title="Coronavirus vaccination"
      data={formState.formData}
      schema={formState.formSchema}
      uiSchema={formState.uiSchema}
      onChange={onFormChange}
      onSubmit={onSubmit}
    >
      <button type="submit" className="usa-button">
        Apply
      </button>
    </SchemaForm>
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
