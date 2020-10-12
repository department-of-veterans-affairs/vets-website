import React from 'react';

export const introText = {
  h1: {
    en: 'COVID-19 screening tool',
    es: 'Herramienta de evaluación para COVID-19',
  },
  vaIntroText: {
    en:
      'Please answer the questions listed below. Share your results with the staff member at the facility entrance.',
    es:
      'Por favor, responda las preguntas que se enumeran a continuación. Comparta sus resultados con el miembro del personal que se encuentra en la entrada del establecimiento.',
  },
  privacyText: {
    en: "We won't store or share your data.",
    es: 'No guardaremos ni compartiremos sus datos.',
  },
  languageSelectText: {
    es: 'Change to English',
    en: 'Cambiar al español',
  },
};

export const resultText = {
  incompleteText: {
    en: 'Please answer all the questions above',
    es: 'Por favor, conteste todas las preguntas anteriores.',
  },
  passText: {
    en: 'OK to proceed',
    es: 'Puede proceder',
  },
  moreScreeningText: {
    en: 'More screening needed',
    es: 'Se necesita más evaluación',
  },
  completeText: {
    en: (
      <div className="vads-u-font-size--lg">
        <p>
          Please show this screen to the staff member at the facility entrance.
        </p>
        <p>Thank you for helping us protect you and others during this time.</p>
      </div>
    ),
    es: (
      <div className="vads-u-font-size--lg">
        <p>
          Muestre esta pantalla al miembro del personal en la entrada del
          establecimiento.
        </p>
        <p>
          Gracias por ayudarnos a mantenerlo a usted y a los demás protegidos
          durante este tiempo.
        </p>
      </div>
    ),
  },
  validtext: {
    en: 'Valid for',
    es: 'Válido para',
  },
};
