// import _ from 'lodash/fp';

// import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';

const formConfig = {
  urlPrefix: '/1990-rjsf/',
  submitUrl: '/v0/education_benefits_claims/1990',
  trackingPrefix: 'edu-',
  formId: '1990',
  version: 0,
  disableSave: true,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
  },
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    benefitsEligibility: {
      title: 'Benefits Eligibility',
      pages: {
        benefitsEligibility: {
          title: 'Benefits eligibility',
          path: 'benefits-eligibility/benefits-selection',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        benefitRelinquishment: {
          title: 'Benefits relinquishment',
          path: 'benefits-eligibility/benefits-relinquishment',
          depends: {
            chapter33: true
          },
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        militaryService: {
          title: 'Military service',
          path: 'military-history/military-service',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        rotcHistory: {
          title: 'ROTC history',
          path: 'military-history/rotc-history',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        contributions: {
          title: 'Contributions',
          path: 'military-history/contributions',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          title: 'Education history',
          // There's only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'education-history/education-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    employmentHistory: {
      title: 'Employment History',
      pages: {
        employmentHistory: {
          title: 'Employment history',
          // There's only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'employment-history/employment-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: {
          title: 'School selection',
          // There's only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'school-selection/school-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: {
          title: 'Contact information',
          path: 'personal-information/contact-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        secondaryContact: {
          title: 'Secondary contact',
          path: 'personal-information/secondary-contact',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        dependents: {
          title: 'Dependent information',
          path: 'personal-information/dependents',
          depends: {
            // hasServiceBefore1978
          },
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    }
  }
};

export default formConfig;
