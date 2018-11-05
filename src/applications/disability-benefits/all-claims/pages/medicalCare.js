import React from 'react';

function noCareCheck(errors, state, formData) {
  const medicalCare = formData['view:medicalCare'];
  if (
    medicalCare.underDoctorCare &&
    medicalCare.hospitalized &&
    medicalCare.noCare
  ) {
    errors.addError('Cannot choose all three.');
  }
  if (medicalCare.underDoctorCare && medicalCare.noCare) {
    errors.addError('Cannot choose both of these answers.');
  }
  if (medicalCare.hospitalized && medicalCare.noCare) {
    errors.addError('Cannot choose both of these answers.');
  }
  if (
    !medicalCare.underDoctorCare &&
    !medicalCare.hospitalized &&
    !medicalCare.noCare
  ) {
    errors.addError('Please choose one');
  }
}

const medicalCareDescription = (
  <div>
    <h3>Medical Care</h3>
    <p>
      During the last 12 months, have you been under a doctor‘s care or
      hospitalized for these disabilities?
    </p>
  </div>
);

export const uiSchema = {
  'view:medicalCare': {
    'ui:title': medicalCareDescription,
    // 'ui:description':
    //   'During the last 12 months, have you been under a doctor‘s care or hospitalized for these disabilities?',
    'ui:options': {
      showFieldLabel: true,
    },
    underDoctorCare: {
      'ui:title': 'Yes, I‘ve been under doctor‘s care',
    },
    hospitalized: {
      'ui:title': 'Yes, I‘ve been hospitalized',
    },
    noCare: {
      'ui:title': 'No, I havent‘t been under a doctor‘s care or hospitalized',
    },
    'ui:validations': [noCareCheck],
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:medicalCare': {
      type: 'object',
      properties: {
        underDoctorCare: { type: 'boolean' },
        hospitalized: { type: 'boolean' },
        noCare: { type: 'boolean' },
      },
    },
  },
};
