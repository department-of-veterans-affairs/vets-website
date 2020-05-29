import React from 'react';

export const questions = {
  isStaff: {
    text: 'Are you a VA employee or contractor?',
    causeFailure: false,
  },
  fever: {
    text: 'In the past 24 hours, have you had a fever?',
  },
  cough: {
    text:
      "In the past 7 days, have you had a cough or shortness of breath that's new or getting worse?",
  },
  flu: {
    text: (
      <div>
        In the past 3 days, have you had any of these symptoms?
        <ul>
          <li>Fever or feeling feverish (chills, sweating)</li>
          <li>Sore throat</li>
          <li>Muscle pain or body aches</li>
          <li>Vomiting or diarrhea</li>
          <li>Change in smell or taste</li>
        </ul>
      </div>
    ),
  },
  congestion: {
    text:
      'Do you currently have a sore throat, runny nose, or nasal congestion?',
  },
  exposure: {
    text:
      'In the past 14 days, have you had close contact with someone who you know was diagnosed with COVID-19?',
    dependsOn: {
      isStaff: 'no',
    },
  },
  exposureStaff: {
    text:
      "In the past 14 days, have you had close contact with someone diagnosed with COVID-19 when you weren't wearing a face covering?",
    dependsOn: {
      isStaff: 'yes',
    },
  },
};
