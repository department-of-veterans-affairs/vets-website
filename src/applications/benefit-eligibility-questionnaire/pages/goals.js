export default {
  uiSchema: {
    checkboxGroupGoals: {
      'ui:title': 'What goal(s) do you want to accomplish?',
      'ui:description': 'Check all that aapply.',
      buildMyNetwork: {
        'ui:title': 'Build my network',
      },
      findACivilianJob: {
        'ui:title': 'Find a civilian job',
      },
      planForMyTransition: {
        'ui:title': 'Plan for my transition',
      },
      progressInMyMilitaryCareer: {
        'ui:title': 'Progress in my military career',
      },
      setACareerPath: {
        'ui:title': 'Set a career path',
      },
      startABusiness: {
        'ui:title': 'Start a business',
      },
      understandMyBenefits: {
        'ui:title': 'Understand my benefits',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      checkboxGroupGoals: {
        type: 'object',
        properties: {
          buildMyNetwork: { type: 'boolean' },
          findACivilianJob: { type: 'boolean' },
          planForMyTransition: { type: 'boolean' },
          progressInMyMilitaryCareer: { type: 'boolean' },
          setACareerPath: { type: 'boolean' },
          startABusiness: { type: 'boolean' },
          understandMyBenefits: { type: 'boolean' },
        },
      },
    },
  },
};
