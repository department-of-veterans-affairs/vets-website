export default {
  uiSchema: {
    goals: {
      'ui:title': 'What goal(s) do you want to accomplish?',
      'ui:description': 'Check all that apply.',
      earnDegreeOrCertificate: {
        'ui:title': 'Earn a degree or certificate',
      },
      findACivilianJob: {
        'ui:title': 'Find a civilian job',
      },
      planForMyTransition: {
        'ui:title': 'Plan for my transition',
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
      goals: {
        type: 'object',
        properties: {
          earnDegreeOrCertificate: { type: 'boolean' },
          findACivilianJob: { type: 'boolean' },
          planForMyTransition: { type: 'boolean' },
          setACareerPath: { type: 'boolean' },
          startABusiness: { type: 'boolean' },
          understandMyBenefits: { type: 'boolean' },
        },
      },
    },
  },
};
