/**
 * The Challenge:
 * Logged out view allows a veteran to fill out name, dob, ssn, and va file number.
 * Logged in view pulls data from the profile to populate a view only component with name, dob, and gender.
 *
 * The Implications
 * There needs to be a flexible schema that can support a logged out flow where we collect personal information
 * but also allows for the limited information we pull from the profile if they are logged in.
 *
 * There needs to be a mechanism that toggles between these two states (logged in/out).
 * We need to connect to the store in this component.
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { VeteranInformationViewComponent } from '../components/VeteranInformationViewComponent';

const schema = {
  type: 'object',
  properties: {
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
        },
        middle: {
          type: 'string',
        },
        last: {
          type: 'string',
        },
        suffix: {
          type: 'string',
          enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
        },
      },
    },
    ssn: {
      type: 'string',
    },
    VAFileNumber: {
      type: 'string',
    },
    dob: {
      type: 'string',
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
    },
  },
};

const uiSchema = {
  fullName: {
    first: {
      'ui:title': 'Your first name',
    },
    middle: {
      'ui:title': 'Your middle name',
    },
    last: {
      'ui:title': 'Your last name',
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  },
  ssn: {
    'ui:title': 'Your Social Security number',
    ...ssnUI,
  },
  VAFileNumber: {
    'ui:title': 'Your VA file number (*If different from SSN)',
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
  },
  dob: currentOrPastDateUI('Date of birth'),
};

const VeteranInformation = ({ user, formData, formSubmit, formChange }) => {
  const [veteran, setVeteran] = useState({});
  useEffect(
    () => {
      setVeteran(user);
    },
    [user],
  );
  return (
    <>
      {veteran?.login?.currentlyLoggedIn &&
      veteran?.profile?.verified &&
      veteran?.profile.status === 'OK' ? (
        <VeteranInformationViewComponent {...veteran.profile} />
      ) : (
        // TODO: SchemaForm can't be used as a child of a parent form...have to handwrite inputs it seems.
        <SchemaForm
          name="Veteran Information"
          title="Veteran Information"
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          onChange={formChange}
          onSubmit={formSubmit}
        />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(VeteranInformation);
