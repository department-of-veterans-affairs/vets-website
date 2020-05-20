import React from 'react';

export const questions = [
  {
    id: 'fever',
    text: 'In the past 24 hours, have you had a fever?',
  },
  {
    id: 'cough',
    text:
      "In the past 7 days, have you had a cough or shortness of breath that's new or getting worse?",
  },
  {
    id: 'flu',
    text: (
      <div>
        In the past 3 days, have you had any of these symptoms:
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
  {
    id: 'congestion',
    text:
      'Do you currently have a sore throat, runny nose, or nasal congestion?',
  },
  {
    id: 'exposure',
    text:
      'In the past 14 days, have you had contact with someone diagnosed with COVID-19?',
  },
];
