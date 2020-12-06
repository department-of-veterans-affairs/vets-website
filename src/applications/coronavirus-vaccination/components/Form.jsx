import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import * as userSelectors from 'platform/user/selectors';

import useSchemaForm from '../hooks/useSchemaForm';

const covid19VaccinationFormSchema = {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'emailAddress',
    'phone',
    'dateOfBirth',
    'vaxPreference',
    'facility',
  ],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    dateOfBirth: {
      type: 'string',
    },
    ssn: {
      type: 'string',
      pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
    },
    emailAddress: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
    },

    vaxPreference: {
      type: 'string',
      enum: ['INTERESTED', 'NOT_INTERESTED', 'UNDECIDED', 'ALREADY_VACCINATED'],
    },
    facility: {
      type: 'string',
    },
  },
};

const covid19VaccinationUiSchema = {
  firstName: {
    'ui:title': 'First name',
    'ui:errorMessages': {
      required: 'Please enter your first name.',
    },
  },
  lastName: {
    'ui:title': 'Last name',
    'ui:errorMessages': {
      required: 'Please enter your last name.',
    },
  },
  dateOfBirth: {
    'ui:title': 'Date of birth',
    'ui:widget': 'date',
    'ui:errorMessages': {
      required: 'Please enter your date of birth.',
    },
  },
  ssn: {
    'ui:title': 'Social Security Number (SSN)',
    'ui:errorMessages': {
      required: 'Please enter your social security number.',
      pattern: 'Please enter a valid social security number.',
    },
  },
  emailAddress: {
    'ui:title': 'Email address',
    'ui:widget': 'email',
    'ui:errorMessages': {
      required: 'Please enter your email address, using this format: X@X.com',
      pattern:
        'Please enter your email address again, using this format: X@X.com',
    },
  },
  phone: {
    'ui:title': 'Phone',
    'ui:widget': PhoneNumberWidget,
    'ui:errorMessages': {
      required: 'Please enter your phone number',
      pattern: 'Please enter a valid phone number',
    },
  },
  vaxPreference: {
    'ui:title': 'Interested in vaccine',
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'Please select an answer.',
    },
    'ui:options': {
      labels: {
        INTERESTED: 'Interested',
        NOT_INTERESTED: 'Not interested',
        UNDECIDED: 'Unsure',
        ALREADY_VACCINATED: 'Already received a vaccination',
      },
      classNames: '',
    },
  },
  facility: {
    'ui:title': 'Facility to receive vacccine',
    'ui:widget': 'text',
    'ui:options': {
      hideIf: formData => formData.vaxPreference !== 'INTERESTED',
    },
  },
};

function getInitialFormData(profile) {
  return {
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

function Form({ router, isLoggedIn, profile }) {
  const initialFormData = isLoggedIn ? getInitialFormData(profile) : {};
  const [formData, formSchema, uiSchema, setFormState] = useSchemaForm(
    covid19VaccinationFormSchema,
    covid19VaccinationUiSchema,
    initialFormData,
  );

  const onSubmit = _submittedFormData => {
    // console.log(submittedFormData);
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
