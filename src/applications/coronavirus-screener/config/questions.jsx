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
    id: 'test-results-hi',
    text: 'Are you waiting for COVID-19 test results?',
    customId: ['459', '459GE', '459GF', '459GH'],
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
    id: 'household-exposure-526',
    text:
      "Has anyone who lives with you had any of the above symptoms that aren't clearly caused by another condition?",
    customId: ['526'],
  },
  {
    id: 'congestion',
    text:
      "Do you currently have a runny nose or congestion that's new and not related to allergies?",
  },
  {
    id: 'exposure',
    text:
      'In the past 14 days, have you had close contact with someone who you know was diagnosed with COVID-19 or was waiting for COVID-19 test results?',
    dependsOn: {
      id: 'isStaff',
      value: 'no',
    },
  },
  {
    id: 'exposure-staff',
    text:
      "Have you had contact with someone you know was diagnosed with COVID-19 or was waiting for COVID-19 test results that you haven't already reported to VA occupational health?",
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
  {
    id: 'travel-self-pr',
    text: 'Have you traveled outside of Puerto Rico within the last 14 days?',
    customId: ['672'],
  },
  {
    id: 'travel-other-pr',
    text:
      'Have you had contact with someone who has traveled outside of Puerto Rico within the last 14 days?',
    customId: ['672'],
  },
  {
    id: 'travel-self-stvi',
    text: 'Have you traveled outside of St. Thomas within the last 14 days?',
    customId: ['672GB'],
  },
  {
    id: 'travel-other-stvi',
    text:
      'Have you had contact with someone who has traveled outside of St. Thomas within the last 14 days?',
    customId: ['672GB'],
  },
  {
    id: 'travel-self-scvi',
    text: 'Have you traveled outside of St. Croix within the last 14 days?',
    customId: ['672GA'],
  },
  {
    id: 'travel-other-scvi',
    text:
      'Have you had contact with someone who has traveled outside of St. Croix within the last 14 days?',
    customId: ['672GA'],
  },
];

export const defaultOptions = [
  { optionValue: 'yes', optionText: 'Yes' },
  { optionValue: 'no', optionText: 'No' },
];
