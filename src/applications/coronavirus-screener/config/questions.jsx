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
    text: 'Do you currently have a runny nose or nasal congestion?',
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
      "Have you had contact with someone diagnosed with COVID-19 that you haven't already reported to VA occupational health?",
    dependsOn: {
      id: 'isStaff',
      value: 'yes',
    },
  },
  {
    id: 'travel-459',
    text: 'In the past 14 days, have you traveled outside of Hawaii?',
    customId: ['459'],
  },
  {
    id: 'travel-459GE',
    text: 'In the past 14 days, have you traveled outside of Guam?',
    customId: ['459GE'],
  },
  {
    id: 'travel-459GF',
    text: 'In the past 14 days, have you traveled outside of American Samoa?',
    customId: ['459GF'],
  },
  {
    id: 'travel-459GH',
    text:
      'In the past 14 days, have you traveled outside of the Northern Mariana Islands?',
    customId: ['459GH'],
  },
  {
    id: 'travel-new-england-ma-ct-ri',
    text: 'In the past 14 days, have you traveled outside of New England?',
    customId: ['523', '650', '689', '402', '405', '631', '518', '608', '478'],
  },
  {
    id: 'travel-ny',
    text:
      'In the past 14 days, have you traveled outside of New York and its surrounding states?',
    customId: ['526', '528', '620', '630', '632'],
  },
];

export const defaultOptions = [
  { optionValue: 'yes', optionText: 'Yes' },
  { optionValue: 'no', optionText: 'No' },
];
