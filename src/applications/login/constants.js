export const wizardQuestions = [
  {
    question: `1. Do you already use one of these sign-on options to access services on VA.gov?`,
    options: [
      {
        label: 'Login.gov',
        name: 'signinoptions',
        value: 'logingov',
      },
      {
        label: 'ID.me',
        name: 'signinoptions',
        value: 'idme',
      },
      {
        label: "No. I don't have either of these",
        name: 'signinoptions',
        value: 'none',
      },
    ],
  },
  {
    question: '2. Which forms of identification do you have?',
    options: [
      {
        label: 'State-issued Identification (drivers license)',
        name: 'idoptions',
        value: 'state',
      },
      {
        label: 'Other (US or Foreign passport)',
        name: 'idoptions',
        value: 'other',
      },
      {
        label: 'None of these',
        name: 'idoptions',
        value: 'none',
      },
    ],
  },
];

export const cspReasons = {
  state: ['You have a state-issued form of identification'],
  other: ['You have a passport as a form of identification'],
  none: [
    `You don't have a form of identification`,
    `You can answer questions about your identity`,
  ],
};
