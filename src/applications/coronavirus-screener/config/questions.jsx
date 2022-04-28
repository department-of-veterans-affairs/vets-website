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
    id: 'scheduled-appointment-hi',
    text: {
      en: 'Do you have a scheduled appointment today?',
      es: '¿Tiene una cita programada para hoy?',
    },
    customId: ['459', '459GE', '459GF', '459GH'],
    passValues: ['yes'],
    dependsOn: {
      id: 'isStaff',
      value: 'no',
    },
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
    customIdExcluded: ['459', '459GE', '459GF', '459GH'],
  },
  {
    id: 'cough',
    text: {
      en:
        "In the past 7 days, have you had a cough, shortness of breath, or difficulty breathing that's new or getting worse?",
      es:
        'En los últimos 7 días, ¿ha tenido tos, le ha faltado el aire o ha experimentado dificultad para respirar (malestar nuevo o que ha empeorado)?',
    },
    customIdExcluded: ['459', '459GE', '459GF', '459GH'],
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
    customIdExcluded: ['459', '459GE', '459GF', '459GH'],
  },
  {
    id: 'flu-hi-first',
    text: {
      en: (
        <div>
          Have you had any of these symptoms in the past 48 hours?
          <ul>
            <li>Fever or chills</li>
            <li>Cough</li>
            <li>Shortness of breath or difficulty breathing</li>
            <li>Fatigue (feeling very tired)</li>
            <li>Muscle or body aches</li>
            <li>Headache</li>
          </ul>
          <p>
            <strong>Note:</strong>{' '}
            <span className="notbold">
              Answer “yes” if you have any symptoms—even if you think they’re
              caused by allergies or another health issue other than COVID-19.
            </span>
          </p>
        </div>
      ),
      es: (
        <div>
          ¿Ha tenido alguno de estos síntomas en las últimas 48 horas?
          <ul>
            <li>Fiebre o escalofríos</li>
            <li>Tos</li>
            <li>Falta de aire o dificultad para respirar</li>
            <li>Fatiga (sensación de mucho cansancio)</li>
            <li>Dolores musculares o corporales</li>
            <li>Dolor de cabeza</li>
          </ul>
          <p>
            <strong>Note:</strong>{' '}
            <span className="notbold">
              Answer “yes” if you have any symptoms—even if you think they’re
              caused by allergies or another health issue other than COVID-19.
            </span>
          </p>
        </div>
      ),
    },
    customId: ['459', '459GE', '459GF', '459GH'],
  },
  {
    id: 'flu-hi-second',
    text: {
      en: (
        <div>
          Have you had any of these symptoms in the past 48 hours?
          <ul>
            <li>New loss of taste or smell</li>
            <li>Sore throat</li>
            <li>Congestion or runny nose</li>
            <li>Nausea or vomiting</li>
            <li>Diarrhea</li>
          </ul>
          <p>
            <strong>Note:</strong>{' '}
            <span className="notbold">
              Answer “yes” if you have any symptoms—even if you think they’re
              caused by allergies or another health issue other than COVID-19.
            </span>
          </p>
        </div>
      ),
      es: (
        <div>
          ¿Ha tenido alguno de estos síntomas en las últimas 48 horas?
          <ul>
            <li>Pérdida nueva del gusto o del olfato</li>
            <li>Dolor de garganta</li>
            <li>Congestión o secreción nasal</li>
            <li>Náuseas o vómitos</li>
            <li>Diarrea</li>
          </ul>
          <p>
            <strong>Note:</strong>{' '}
            <span className="notbold">
              Answer “yes” if you have any symptoms—even if you think they’re
              caused by allergies or another health issue other than COVID-19.
            </span>
          </p>
        </div>
      ),
    },
    customId: ['459', '459GE', '459GF', '459GH'],
  },
  {
    id: 'close-contact-hi',
    text: {
      en: (
        <div>
          In the past 14 days, have you been in close physical contact with
          anyone who fits either of these descriptions?
          <ul>
            <li>
              They had COVID-19 (confirmed with a positive COVID-19 test),{' '}
              <strong>or</strong>
            </li>
            <li>They had any symptoms of COVID-19</li>
          </ul>
          <strong>Note:</strong>{' '}
          <span className="notbold">
            Close physical contact means being within 6 feet of someone for a
            total of 15 minutes or more within 24 hours.
          </span>
        </div>
      ),
      es: (
        <div>
          En los últimos 14 días, ¿ha estado en contacto físico estrecho con
          alguien que se ajuste a alguna de estas descripciones?
          <ul>
            <li>
              Tenían COVID-19 (confirmado con una prueba positiva de COVID-19),
              o
            </li>
            <li>Tuvieron algún síntoma de COVID-19</li>
          </ul>
          <strong>Nota:</strong>{' '}
          <span className="notbold">
            Un contacto cercano es una persona que estuvo a menos de 6 pies de
            alguien infectado (con infección confirmada en laboratorio o
            diagnóstico clínico) por un total acumulado de 15 minutos o más en
            un periodo de 24 horas.
          </span>
        </div>
      ),
    },
    customId: ['459', '459GE', '459GF', '459GH'],
  },
  {
    id: 'have-covid-concern-hi',
    text: {
      en: 'Are you concerned you may have COVID-19 now?',
      es: '¿Le preocupa que pueda tener COVID-19 ahora?',
    },
    customId: ['459', '459GE', '459GF', '459GH'],
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
    customIdExcluded: ['459', '459GE', '459GF', '459GH'],
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
    customIdExcluded: ['459', '459GE', '459GF', '459GH'],
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
    customIdExcluded: ['459', '459GE', '459GF', '459GH'],
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
    id: 'travel-new-england-ma-ct-ri',
    text: {
      en: 'In the past 14 days, have you traveled outside of New England?',
      es: 'En los últimos 14 días, ¿ha viajado fuera de Nueva Inglaterra?',
    },
    customId: ['523', '650', '689', '402', '405', '631', '608', '478'],
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
