import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as userSelectors from 'platform/user/selectors';

import initialFormSchema from '../config/schema';
import initialUiSchema from '../config/uiSchema';

import useSchemaForm from '../hooks/useSchemaForm';

function Form({ router, isLoggedIn, profile }) {
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

  const [formData, formSchema, uiSchema, setFormState] = useSchemaForm(
    initialFormSchema,
    initialUiSchema,
    initialFormData,
  );

  const onSubmit = _submittedFormData => {
    console.log(submittedFormData);
    router.replace('/confirmation');
  };

  return (
    <SchemaForm
      addNameAttribute
      // "name" and "title" are used only internally to SchemaForm
      name="Coronavirus vaccination"
      title="Coronavirus vaccination"
      schema={formSchema}
      uiSchema={uiSchema}
      onChange={setFormState}
      onSubmit={onSubmit}
      data={formData}
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
  };
};

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form),
);
export { Form };
