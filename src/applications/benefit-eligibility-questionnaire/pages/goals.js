export default {
  uiSchema: {
    checkboxGroupGoals: {
      'ui:title': 'What goal(s) do you want to accomplish?',
      'ui:description':
        'Check all that aapply. This is a new tool on VA,gov, so some of the options may not be available yet.',
      buildMyNetwork: {
        'ui:title': 'Build my network',
      },
      findACivilJob: {
        'ui:title': 'Find a civil job',
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
          findACivilJob: { type: 'boolean' },
          progressInMyMilitaryCareer: { type: 'boolean' },
          setACareerPath: { type: 'boolean' },
          startABusiness: { type: 'boolean' },
          understandMyBenefits: { type: 'boolean' },
        },
      },
    },
  },
};
