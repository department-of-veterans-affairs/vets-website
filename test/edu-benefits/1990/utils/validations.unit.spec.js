import { expect } from 'chai';
import moment from 'moment';

import {
  isValidContactInformationPage,
  isValidMilitaryServicePage,
  isValidFutureOrPastDateField,
  isValidPage,
  isValidRoutingNumber,
  isValidRelinquishedDate,
  isValidEducationPeriod,
  isValidEducationHistoryPage,
  isValidAddressField,
  isValidSchoolSelectionPage
} from '../../../../src/js/edu-benefits/1990/utils/validations.js';

import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran.js';
import { makeField } from '../../../../src/js/common/model/fields.js';

describe('Validation:', () => {
  describe('isValidPage:', () => {
    describe('EmploymentHistory', () => {
      it('validates page without license is valid', () => {
        const veteran = createVeteran();
        veteran.hasNonMilitaryJobs.value = 'N';
        expect(isValidPage('/employment-history/employment-information', veteran)).to.be.true;
      });
      it('validates page with no data is valid', () => {
        const veteran = createVeteran();
        veteran.hasNonMilitaryJobs.value = 'Y';
        veteran.nonMilitaryJobs.push({
          postMilitaryJob: {
            value: '',
            dirty: true
          },
          name: {
            value: '',
            dirty: false
          },
          months: {
            value: '',
            dirty: false
          }
        });
        expect(isValidPage('/employment-history/employment-information', veteran)).to.be.true;
      });
    });
  });
  describe('isValidFutureOrPastDateField:', () => {
    it('validates if date is in the past', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: 2006,
          dirty: true
        }
      };
      expect(isValidFutureOrPastDateField(dateField)).to.be.true;
    });
    it('validates if date is in the future', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: (new Date()).getFullYear() + 1,
          dirty: true
        }
      };
      expect(isValidFutureOrPastDateField(dateField)).to.be.true;
    });
    it('does not validate if date is not valid', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: 'bad',
          dirty: true
        }
      };
      expect(isValidFutureOrPastDateField(dateField)).to.be.false;
    });
  });
  describe('isValidRoutingNumber', () => {
    const routingNumbers = [
      '211075086',
      '114926012',
      '061219694',
      '307086691',
      '302386587'
    ];
    const invalidRoutingNumbers = [
      'asdf',
      '12344',
      '923456890'
    ];
    it('should validate real routing numbers', () => {
      routingNumbers.forEach((num) => {
        expect(isValidRoutingNumber(num)).to.be.true;
      });
    });
    it('should not validate real routing numbers', () => {
      invalidRoutingNumbers.forEach((num) => {
        expect(isValidRoutingNumber(num)).to.be.false;
      });
    });
  });
  describe('isValidContactInformationPage', () => {
    it('should require phone number', () => {
      const data = {
        veteranAddress: {
          street: {
            value: 'Test',
            dirty: true
          },
          city: {
            value: 'Test',
            dirty: true
          },
          country: {
            value: 'USA',
            dirty: true
          },
          state: {
            value: 'MA',
            dirty: true
          },
          postalCode: {
            value: '01060',
            dirty: true
          },
        },
        preferredContactMethod: {
          value: '',
          dirty: true
        },
        email: {
          value: '',
          dirty: true
        },
        emailConfirmation: {
          value: '',
          dirty: true
        },
        homePhone: {
          value: '',
          dirty: true
        },
        mobilePhone: {
          value: '',
          dirty: true
        }
      };

      expect(isValidContactInformationPage(data)).to.be.false;
    });
  });
  describe('isValidRelinquishedDate', () => {
    it('validates date is not earlier than two years ago', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: '2013',
          dirty: true
        }
      };

      expect(isValidRelinquishedDate(dateField)).to.be.false;
    });
    it('validates date is not later than 100 years in future', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: moment().add(101, 'year').year(),
          dirty: true
        }
      };

      expect(isValidRelinquishedDate(dateField)).to.be.false;
    });
  });
  describe('isValidMilitaryServicePage', () => {
    it('should not allow invalid years', () => {
      const data = {
        serviceAcademyGraduationYear: {
          value: '1890',
          dirty: true
        }
      };

      expect(isValidMilitaryServicePage(data)).to.be.false;
    });
    it('should allow blank values', () => {
      const data = {
        serviceAcademyGraduationYear: {
          value: '',
          dirty: true
        }
      };

      expect(isValidMilitaryServicePage(data)).to.be.true;
    });
  });
  describe('isValidEducationPeriod', () => {
    it('should not validate bad date range', () => {
      const data = {
        dateRange: {
          from: {
            month: {
              value: '6'
            },
            year: {
              value: '96'
            },
            day: {
              value: ''
            }
          },
          to: {
            month: {
              value: '5'
            },
            year: {
              value: '97'
            },
            day: {
              value: ''
            }
          }
        }
      };

      expect(isValidEducationPeriod(data)).to.be.false;
    });
  });
  describe('isValidEducationHistoryPage', () => {
    it('should validate empty history page fields', () => {
      const data = {
        highSchoolOrGedCompletionDate: {
          month: makeField(''),
          year: makeField('')
        },
        postHighSchoolTrainings: [
          {
            dateRange: {
              from: {
                month: makeField(''),
                year: makeField('')
              },
              to: {
                month: makeField(''),
                year: makeField('')
              }
            }
          }
        ]
      };

      expect(isValidEducationHistoryPage(data)).to.be.true;
    });
    it('should not validate future completion date', () => {
      const data = {
        highSchoolOrGedCompletionDate: {
          month: makeField(''),
          year: makeField(moment().add(1, 'year').year())
        },
        postHighSchoolTrainings: [
          {
            dateRange: {
              from: {
                month: makeField(''),
                year: makeField('')
              },
              to: {
                month: makeField(''),
                year: makeField('')
              }
            }
          }
        ]
      };

      expect(isValidEducationHistoryPage(data)).to.be.false;
    });
    it('should not validate bad range', () => {
      const data = {
        highSchoolOrGedCompletionDate: {
          month: makeField(''),
          year: makeField('')
        },
        postHighSchoolTrainings: [
          {
            dateRange: {
              from: {
                month: makeField(''),
                year: makeField('2001')
              },
              to: {
                month: makeField(''),
                year: makeField('2000')
              }
            }
          }
        ]
      };

      expect(isValidEducationHistoryPage(data)).to.be.false;
    });
    it('should not validate future range', () => {
      const data = {
        highSchoolOrGedCompletionDate: {
          month: makeField(''),
          year: makeField('')
        },
        postHighSchoolTrainings: [
          {
            dateRange: {
              from: {
                month: makeField(''),
                year: makeField('2001')
              },
              to: {
                month: makeField(''),
                year: makeField(moment().add(1, 'year').year())
              }
            }
          }
        ]
      };

      expect(isValidEducationHistoryPage(data)).to.be.false;
    });
  });
  describe('isValidAddressField', () => {
    it('should validate complete address', () => {
      const data = {
        country: {
          value: 'USA'
        },
        street: {
          value: 'Test'
        },
        city: {
          value: 'Test'
        },
        postalCode: {
          value: '12345'
        },
        state: {
          value: 'NC'
        }
      };

      expect(isValidAddressField(data)).to.be.true;
    });
    it('should not validate bad postal code', () => {
      const data = {
        country: {
          value: 'USA'
        },
        street: {
          value: 'Test'
        },
        city: {
          value: 'Test'
        },
        postalCode: {
          value: '123123123123123123'
        },
        state: {
          value: 'NC'
        }
      };

      expect(isValidAddressField(data)).to.be.false;
    });
  });
  describe('isValidSchoolSelectionPage', () => {
    it('should not validate address when not shown', () => {
      const data = {
        educationType: {
          value: ''
        },
        educationStartDate: {
          month: {
            value: '5'
          },
          year: {
            value: '1997'
          },
          day: {
            value: '3'
          }
        },
        school: {
          address: {
            country: {
              value: 'USA'
            },
            street: {
              value: 'Test'
            },
            city: {
              value: 'Test'
            },
            postalCode: {
              value: '123123123123123123'
            },
            state: {
              value: 'NC'
            }
          }
        }
      };

      expect(isValidSchoolSelectionPage(data)).to.be.true;
    });
    it('should allow blank address', () => {
      const data = {
        educationType: {
          value: 'college'
        },
        educationStartDate: {
          month: {
            value: '5'
          },
          year: {
            value: '1997'
          },
          day: {
            value: '3'
          }
        },
        school: {
          address: {
            country: {
              value: 'USA'
            },
            street: {
              value: ''
            },
            city: {
              value: ''
            },
            postalCode: {
              value: ''
            },
            state: {
              value: ''
            }
          }
        }
      };

      expect(isValidSchoolSelectionPage(data)).to.be.true;
    });
    it('should not allow bad address', () => {
      const data = {
        educationType: {
          value: 'college'
        },
        educationStartDate: {
          month: {
            value: '5'
          },
          year: {
            value: '1997'
          },
          day: {
            value: '3'
          }
        },
        school: {
          address: {
            country: {
              value: 'USA'
            },
            street: {
              value: ''
            },
            city: {
              value: ''
            },
            postalCode: {
              value: '123232323'
            },
            state: {
              value: ''
            }
          }
        }
      };

      expect(isValidSchoolSelectionPage(data)).to.be.false;
    });
  });
});
