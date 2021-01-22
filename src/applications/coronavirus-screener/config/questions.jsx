import React from 'react';

export const questions = [
  {
    id: 'isStaff',
    text: {
      en: 'Are you a VA employee or contractor?',
      es:
        '¿Es usted un empleado/a o contratista del Departamento de Asuntos de Veteranos?',
    },
    passValues: ['yes', 'no'],
    clearValues: true,
    startQuestion: true,
  },
  {
    id: 'test-results-hi',
    text: {
      en: 'Are you waiting for COVID-19 test results?',
      es: '¿Está esperando los resultados de la prueba de COVID-19?',
    },
    customId: ['459', '459GE', '459GF', '459GH'],
  },
  {
    id: 'fever',
    text: {
      en: 'In the past 24 hours, have you had a fever?',
      es: 'En las últimas 24 horas, ¿ha tenido fiebre?',
    },
  },
  {
    id: 'cough',
    text: {
      en:
        "In the past 7 days, have you had a cough, shortness of breath, or difficulty breathing that's new or getting worse?",
      es:
        'En los últimos 7 días, ¿ha tenido tos, le ha faltado el aire o ha experimentado dificultad para respirar (malestar nuevo o que ha empeorado)?',
    },
  },
  {
    id: 'flu',
    text: {
      en: (
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
      es: (
        <div>
          En los últimos 3 días, ¿ha tenido alguno de estos síntomas?
          <ul>
            <li>Fiebre o se sintió afiebrado/a (escalofríos, sudoración)</li>
            <li>Fatiga (se sintió cansado/a todo el tiempo)</li>
            <li>Dolores musculares o corporales</li>
            <li>Dolor de cabeza</li>
            <li>Pérdida reciente de olfato o gusto</li>
            <li>Dolor de garganta</li>
            <li>Náuseas, vómitos o diarrea</li>
          </ul>
        </div>
      ),
    },
  },
  {
    id: 'household-exposure-526',
    text: {
      en:
        "Has anyone who lives with you had any of the above symptoms that aren't clearly caused by another condition?",
      es:
        '¿Alguien que vive contigo ha tenido alguno de los síntomas anteriores que no son claramente causados por otra condición?',
    },
    customId: ['526'],
  },
  {
    id: 'congestion',
    text: {
      en:
        "Do you currently have a runny nose or congestion that's new and not related to allergies?",
      es:
        '¿Tienes actualmente una secreción nasal o congestión que es nueva y no está relacionada con alergias?',
    },
  },
  {
    id: 'exposure',
    text: {
      en:
        'In the past 14 days, have you had close contact with someone who you know was diagnosed with COVID-19 or was waiting for COVID-19 test results?',
      es:
        'En los últimos 14 días, ¿ha tenido contacto cercano con alguien que sabe que fue diagnosticado con COVID-19 o estaba esperando los resultados de la prueba de COVID-19?',
    },
    dependsOn: {
      id: 'isStaff',
      value: 'no',
    },
  },
  {
    id: 'exposure-staff',
    text: {
      en:
        "Have you had contact with someone you know was diagnosed with COVID-19 or was waiting for COVID-19 test results that you haven't already reported to VA occupational health?",
      es:
        '¿Ha tenido contacto con alguien que conoce que fue diagnosticado con COVID-19 o estaba esperando los resultados de la prueba de COVID-19 que aún no ha reportado a Salud Ocupacional de VA?',
    },
    dependsOn: {
      id: 'isStaff',
      value: 'yes',
    },
  },
  {
    id: 'travel-463',
    text: {
      en: 'In the past 14 days, have you traveled outside of Alaska?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de Alaska?',
    },
    customId: ['463'],
  },
  {
    id: 'travel-459',
    text: {
      en: 'In the past 14 days, have you traveled off island?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de la isla?',
    },
    customId: ['459'],
  },
  {
    id: 'travel-459GE',
    text: {
      en: 'In the past 14 days, have you traveled off island?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de la isla?',
    },
    customId: ['459GE'],
  },
  {
    id: 'travel-459GF',
    text: {
      en: 'In the past 14 days, have you traveled off island?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de la isla?',
    },
    customId: ['459GF'],
  },
  {
    id: 'travel-459GH',
    text: {
      en: 'In the past 14 days, have you traveled off island?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de la isla?',
    },
    customId: ['459GH'],
  },
  {
    id: 'travel-new-england-ma-ct-ri',
    text: {
      en: 'In the past 14 days, have you traveled outside of New England?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de Nueva Inglaterra?',
    },
    customId: ['523', '650', '689', '402', '405', '631', '518', '608', '478'],
  },
  {
    id: 'travel-ny',
    text: {
      en:
        'In the past 14 days, have you traveled outside of New York and its surrounding states?',
      es:
        'En los últimos 14 días, ¿ha viajado fuera de Nueva York y sus estados circundantes?',
    },
    customId: ['526', '528', '620', '630', '632'],
  },
  {
    id: 'travel-self-pr',
    text: {
      en: 'Have you traveled outside of Puerto Rico within the last 14 days?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de Puerto Rico?',
    },
    customId: ['672'],
  },
  {
    id: 'travel-other-pr',
    text: {
      en:
        'Have you had contact with someone who has traveled outside of Puerto Rico within the last 14 days?',
      es:
        '¿Ha tenido contacto con alguien que haya viajado fuera de Puerto Rico en los últimos 14 días?',
    },
    customId: ['672'],
  },
  {
    id: 'travel-self-stvi',
    text: {
      en: 'Have you traveled outside of St. Thomas within the last 14 days?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de St. Thomas?',
    },
    customId: ['672GB'],
  },
  {
    id: 'travel-other-stvi',
    text: {
      en:
        'Have you had contact with someone who has traveled outside of St. Thomas within the last 14 days?',
      es:
        '¿Ha tenido contacto con alguien que haya viajado fuera de St. Thomas en los últimos 14 días?',
    },
    customId: ['672GB'],
  },
  {
    id: 'travel-self-scvi',
    text: {
      en: 'Have you traveled outside of St. Croix within the last 14 days?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de St. Croix?',
    },
    customId: ['672GA'],
  },
  {
    id: 'travel-other-scvi',
    text: {
      en:
        'Have you had contact with someone who has traveled outside of St. Croix within the last 14 days?',
      es:
        '¿Ha tenido contacto con alguien que haya viajado fuera de St. Croix en los últimos 14 días?',
    },
    customId: ['672GA'],
  },
];

export const defaultOptions = [
  { optionValue: 'yes', optionText: { en: 'Yes', es: 'Sí' } },
  { optionValue: 'no', optionText: { en: 'No', es: 'No' } },
];
