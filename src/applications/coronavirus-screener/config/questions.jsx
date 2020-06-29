import React from 'react';

export const questions = [
  {
    id: 'isStaff',
    text: 'Are you a VA employee or contractor?',
    passValues: ['yes', 'no'],
    clearValues: true,
    startQuestion: true,
  },
  {
    id: 'fever',
    text: 'In the past 24 hours, have you had a fever?',
  },
  {
    id: 'cough',
    text:
      "In the past 7 days, have you had a cough, shortness of breath, or difficulty breathing that's new or getting worse?",
  },
  {
    id: 'flu',
    text: (
      <div>
        In the past 3 days, have you had any of these symptoms?
        <ul>
          <li>Fever or feeling feverish (chills, sweating)</li>
          <li>Fatigue (feeling tired all the time)</li>
          <li>Muscle or body aches</li>
          <li>Headache</li>
          <li>New loss of smell or taste</li>
          <li>Sore throat</li>          
          <li>Nausea, vomiting, or diarrhea</li>
          
        </ul>
      </div>
    ),
  },
  {
    id: 'congestion',
    text:
      'Do you currently have a runny nose or nasal congestion?',
  },
  {
    id: 'exposure',
    text:
      'In the past 14 days, have you had close contact with someone who you know was diagnosed with COVID-19?',
    dependsOn: {
      id: 'isStaff',
      value: 'no',
    },
  },
  {
    id: 'exposure-staff',
    text:
      "In the past 14 days, have you had close contact with someone diagnosed with COVID-19 when you weren't wearing a face covering?",
    dependsOn: {
      id: 'isStaff',
      value: 'yes',
    },
  },
];

export const defaultOptions = [
  { optionValue: 'yes', optionText: 'Yes' },
  { optionValue: 'no', optionText: 'No' },
];
