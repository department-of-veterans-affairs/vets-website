import { expect } from 'chai';
import moment from 'moment';

import {
  isValidContactInformationPage,
  isValidDateRange,
  isValidFutureOrPastDateField,
  isValidPage,
  isValidRoutingNumber,
  isValidMonthYearRange,
  isValidEducationHistoryPage
} from '../../../src/js/edu-benefits/utils/validations.js';

import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran.js';
import { makeField } from '../../../src/js/common/model/fields.js';

describe('Validation:', () => {
  describe('isValidDateRange', () => {
    it('validates if to date is after from date', () => {
      const fromDate = {
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
      const toDate = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 4,
          dirty: true
        },
        year: {
          value: 2006,
          dirty: true
        }
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
    it('does not validate to date is before from date', () => {
      const fromDate = {
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
      const toDate = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 4,
          dirty: true
        },
        year: {
          value: 2005,
          dirty: true
        }
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.false;
    });
    it('does validate with partial dates', () => {
      const fromDate = {
        day: {
          value: '3',
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
      const toDate = {
        day: {
          value: '',
          dirty: true
        },
        month: {
          value: '',
          dirty: true
        },
        year: {
          value: 2008,
          dirty: true
        }
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
  });
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
  describe('isValidMonthYearRange', () => {
    it('should validate partial range', () => {
      const fromDate = {
        month: {
          value: '2'
        },
        year: {
          value: '2001'
        }
      };

      const toDate = {
        month: {
          value: '3'
        },
        year: {
          value: ''
        }
      };

      expect(isValidMonthYearRange(fromDate, toDate)).to.be.true;
    });
    it('should not validate invalid range', () => {
      const fromDate = {
        month: {
          value: '2'
        },
        year: {
          value: '2002'
        }
      };

      const toDate = {
        month: {
          value: '3'
        },
        year: {
          value: '2001'
        }
      };

      expect(isValidMonthYearRange(fromDate, toDate)).to.be.false;
    });
    it('should validate same date range', () => {
      const fromDate = {
        month: {
          value: '2'
        },
        year: {
          value: '2001'
        }
      };

      const toDate = {
        month: {
          value: '2'
        },
        year: {
          value: '2001'
        }
      };

      expect(isValidMonthYearRange(fromDate, toDate)).to.be.true;
    });
    it('should validate year only range', () => {
      const fromDate = {
        month: {
          value: ''
        },
        year: {
          value: '2001'
        }
      };

      const toDate = {
        month: {
          value: ''
        },
        year: {
          value: '2002'
        }
      };

      expect(isValidMonthYearRange(fromDate, toDate)).to.be.true;
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
});
