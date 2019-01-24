import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

const {
  currentEmployment,
  currentHighTechnologyEmployment,
  currentSalary,
  // highTechnologyEmploymentType,
} = fullSchema.properties;

export const uiSchema = {
  currentEmployment: {
    'ui:title': 'Are you working in a high-tech industry now?',
    'ui:widget': 'yesNo',
  },
  currentHighTechnologyEmployment: {
    'ui:title':
      'Have you worked in a high-tech industry in the past couple years?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'currentEmployment',
      expandUnderCondition: false,
    },
  },
  'view:salaryEmploymentTypes': {
    'ui:options': {
      hideIf: formData =>
        !formData.currentEmployment ||
        (formData.currentEmployment &&
          !formData.currentHighTechnologyEmployment),
    },
    currentSalary: {
      'ui:title':
        'About how much per year do/did you earn as a high-tech worker?',
    },
    highTechnologyEmploymentType: {
      'ui:description':
        'Which option(s) best describe your high-tech work experience? Check all that apply.',
      hasComputerProgramming: {
        'ui:title': 'Computer Programming',
      },
      hasDataProcessing: {
        'ui:title': 'Data Processing',
      },
      hasComputerSoftware: {
        'ui:title': 'Computer Software',
      },
      hasInformationSciences: {
        'ui:title': 'Information Sciences',
      },
      hasMediaApplication: {
        'ui:title': 'Media Application',
      },
    },
  },
  // 'view:salaryEmploymentTypes1': {
  //   'ui:options': {
  //     hideIf: formData => !formData.currentHighTechnologyEmployment || formData.currentHighTechnologyEmployment === false || formData.currentEmployment === true,
  //   },
  //   currentSalary: {
  //     'ui:title':
  //       'About how much per year do/did you earn as a high-tech worker?',
  //   },
  //   highTechnologyEmploymentType: {
  //     'ui:description':
  //       'Which option(s) best describe your high-tech work experience? Check all that apply.',
  //     hasComputerProgramming: {
  //       'ui:title': 'Computer Programming',
  //     },
  //     hasDataProcessing: {
  //       'ui:title': 'Data Processing',
  //     },
  //     hasComputerSoftware: {
  //       'ui:title': 'Computer Software',
  //     },
  //     hasInformationSciences: {
  //       'ui:title': 'Information Sciences',
  //     },
  //     hasMediaApplication: {
  //       'ui:title': 'Media Application',
  //     },
  //   },
  // },
};

export const schema = {
  type: 'object',
  required: ['currentEmployment', 'currentHighTechnologyEmployment'],
  properties: {
    currentEmployment,
    currentHighTechnologyEmployment,
    'view:salaryEmploymentTypes': {
      type: 'object',
      properties: {
        currentSalary,
        highTechnologyEmploymentType: {
          type: 'object',
          properties: {
            hasComputerProgramming: { type: 'boolean' },
            hasDataProcessing: { type: 'boolean' },
            hasComputerSoftware: { type: 'boolean' },
            hasInformationSciences: { type: 'boolean' },
            hasMediaApplication: { type: 'boolean' },
          },
        },
      },
    },
    // 'view:salaryEmploymentTypes1': {
    //   type: 'object',
    //   properties: {
    //     currentSalary,
    //     highTechnologyEmploymentType: {
    //       type: 'object',
    //       properties: {
    //         hasComputerProgramming: { type: 'boolean' },
    //         hasDataProcessing: { type: 'boolean' },
    //         hasComputerSoftware: { type: 'boolean' },
    //         hasInformationSciences: { type: 'boolean' },
    //         hasMediaApplication: { type: 'boolean' },
    //       },
    //     },
    //   },
    // },
  },
};
