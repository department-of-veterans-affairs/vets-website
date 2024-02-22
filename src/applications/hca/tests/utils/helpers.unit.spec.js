import { expect } from 'chai';

import {
  didEnrollmentStatusChange,
  transformAttachments,
  prefillTransformer,
  isShortFormEligible,
  includeSpousalInformation,
  getInsuranceAriaLabel,
  isOfCollegeAge,
  getDependentPageList,
  normalizeFullName,
  parseVeteranDob,
  getDataToSet,
  getSearchAction,
  getSearchIndex,
  getDefaultState,
} from '../../utils/helpers';
import { HIGH_DISABILITY_MINIMUM } from '../../utils/constants';

describe('hca helpers', () => {
  describe('when `prefillTransformer` executes', () => {
    const formData = {
      veteranFullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
      gender: 'M',
      veteranDateOfBirth: '1933-05-04',
      veteranSocialSecurityNumber: '796121200',
      homePhone: '4445551212',
      email: 'test2@test1.net',
      lastServiceBranch: 'air force',
      lastEntryDate: '2001-03-21',
      postNov111998Combat: true,
      lastDischargeDate: '2014-07-21',
      dischargeType: 'honorable',
      vaCompensationType: 'lowDisability',
      'view:demographicCategories': { isSpanishHispanicLatino: false },
    };

    describe('when profile data omits mailing address', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              residentialAddress: {
                addressLine1: 'PSC 808 Box 37',
                addressLine2: null,
                addressLine3: null,
                addressPou: 'RESIDENCE/CHOICE',
                addressType: 'OVERSEAS MILITARY',
                city: 'FPO',
                countryCodeFips: 'US',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                countryName: 'United States',
                createdAt: '2018-04-21T20:09:50Z',
                effectiveEndDate: '2018-04-21T20:09:50Z',
                effectiveStartDate: '2018-04-21T20:09:50Z',
                id: 124,
                internationalPostalCode: '54321',
                latitude: 37.5615,
                longitude: -121.9988,
                province: 'string',
                sourceDate: '2018-04-21T20:09:50Z',
                stateCode: 'AE',
                updatedAt: '2018-04-21T20:09:50Z',
                zipCode: '09618',
                zipCodeSuffix: '1234',
              },
            },
          },
        },
      };

      it('should auto-fill correct formData from user state', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formData,
          null,
          state,
        );
        expect(Object.keys(prefillData)).to.have.lengthOf(15);
        expect(prefillData.veteranAddress).to.equal(undefined);
        expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(7);
        expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(
          undefined,
        );
      });
    });

    describe('when profile data includes mailing address', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              residentialAddress: {
                addressLine1: 'PSC 808 Box 37',
                addressLine2: null,
                addressLine3: null,
                addressPou: 'RESIDENCE/CHOICE',
                addressType: 'OVERSEAS MILITARY',
                city: 'FPO',
                countryCodeFips: 'US',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                countryName: 'United States',
                createdAt: '2018-04-21T20:09:50Z',
                effectiveEndDate: '2018-04-21T20:09:50Z',
                effectiveStartDate: '2018-04-21T20:09:50Z',
                id: 124,
                internationalPostalCode: '54321',
                latitude: 37.5615,
                longitude: -121.9988,
                province: 'string',
                sourceDate: '2018-04-21T20:09:50Z',
                stateCode: 'AE',
                updatedAt: '2018-04-21T20:09:50Z',
                zipCode: '09618',
                zipCodeSuffix: '1234',
              },
              mailingAddress: {
                addressLine1: '1493 Martin Luther King Rd',
                addressLine2: 'Apt 1',
                addressLine3: null,
                addressPou: 'CORRESPONDENCE',
                addressType: 'DOMESTIC',
                city: 'Fulton',
                countryName: 'United States',
                countryCodeFips: 'US',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                createdAt: '2018-04-21T20:09:50Z',
                effectiveEndDate: '2018-04-21T20:09:50Z',
                effectiveStartDate: '2018-04-21T20:09:50Z',
                id: 123,
                internationalPostalCode: '54321',
                province: 'string',
                sourceDate: '2018-04-21T20:09:50Z',
                stateCode: 'NY',
                updatedAt: '2018-04-21T20:09:50Z',
                zipCode: '97062',
                zipCodeSuffix: '1234',
              },
            },
          },
        },
      };

      it('should auto-fill correct formData from user state', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formData,
          null,
          state,
        );
        expect(Object.keys(prefillData)).to.have.lengthOf(16);
        expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(7);
        expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(7);
        expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.false;
      });
    });
  });

  describe('when `transformAttachments` executes', () => {
    describe('when there are no attachements', () => {
      it('should do nothing', () => {
        const inputData = { firstName: 'Pat' };
        const transformedData = transformAttachments(inputData);
        expect(transformedData).to.deep.equal(inputData);
      });
    });

    describe('when there are attachements', () => {
      it('should transform `attachmentId`s to `dd214` booleans', () => {
        const inputData = {
          firstName: 'Pat',
          attachments: [
            {
              name: 'file1',
              size: 1,
              confirmationCode: 'uuid123',
              attachmentId: '1',
            },
            {
              name: 'file2',
              size: 1,
              confirmationCode: 'uuid456',
              attachmentId: '2',
            },
          ],
        };
        const expectedOutputData = {
          firstName: 'Pat',
          attachments: [
            {
              name: 'file1',
              size: 1,
              confirmationCode: 'uuid123',
              dd214: true,
            },
            {
              name: 'file2',
              size: 1,
              confirmationCode: 'uuid456',
              dd214: false,
            },
          ],
        };
        const transformedData = transformAttachments(inputData);
        expect(transformedData).to.deep.equal(expectedOutputData);
      });
    });
  });

  describe('when `didEnrollmentStatusChange` executes', () => {
    const defaultProps = {
      enrollmentStatus: null,
      noESRRecordFound: false,
      shouldRedirect: false,
    };
    let prevProps;
    let newProps;

    describe('when none of the declared props have changed', () => {
      it('should return `false`', () => {
        prevProps = { ...defaultProps };
        newProps = { ...defaultProps };
        expect(didEnrollmentStatusChange(prevProps, newProps)).to.be.false;
      });
    });

    describe('when `enrollmentStatus` changes', () => {
      it('should return `true`', () => {
        prevProps = { ...defaultProps };
        newProps = { ...defaultProps, enrollmentStatus: 'enrolled' };
        expect(didEnrollmentStatusChange(prevProps, newProps)).to.be.true;
      });
    });

    describe('when `noESRRecordFound` changes', () => {
      it('should return `true`', () => {
        prevProps = { ...defaultProps };
        newProps = { ...defaultProps, noESRRecordFound: true };
        expect(didEnrollmentStatusChange(prevProps, newProps)).to.be.true;
      });
    });

    describe('when `shouldRedirect` changes', () => {
      it('should return `true`', () => {
        prevProps = { ...defaultProps };
        newProps = { ...defaultProps, shouldRedirect: true };
        expect(didEnrollmentStatusChange(prevProps, newProps)).to.be.true;
      });
    });
  });

  describe('when `isShortFormEligible` executes ', () => {
    const formData = {
      vaCompensationType: 'none',
      'view:totalDisabilityRating': 0,
    };

    describe('when disability rating is less than the high-disability minimum', () => {
      describe('when compensation type is not `highDisability`', () => {
        it('should return `false`', () => {
          expect(isShortFormEligible(formData)).to.be.false;
        });
      });

      describe('when compensation type is `highDisability`', () => {
        it('should return `true`', () => {
          expect(
            isShortFormEligible({
              ...formData,
              vaCompensationType: 'highDisability',
            }),
          ).to.be.true;
        });
      });
    });

    describe('when disability rating is greater or equal to the high-disability minimum', () => {
      it('should return `true`', () => {
        expect(
          isShortFormEligible({
            ...formData,
            'view:totalDisabilityRating': HIGH_DISABILITY_MINIMUM,
          }),
        ).to.be.true;
      });
    });
  });

  describe('when `includeSpousalInformation` executes', () => {
    const formData = {
      discloseFinancialInformation: false,
      maritalStatus: 'never married',
    };

    describe('when financial disclose is `false`', () => {
      it('should return `false`', () => {
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });

    describe('when financial disclosure is `true`', () => {
      describe('when marital status is `never married`', () => {
        it('should return `false`', () => {
          expect(
            includeSpousalInformation({
              ...formData,
              discloseFinancialInformation: true,
            }),
          ).to.be.false;
        });
      });

      describe('when marital status is `married`', () => {
        it('should return `true`', () => {
          expect(
            includeSpousalInformation({
              ...formData,
              discloseFinancialInformation: true,
              maritalStatus: 'married',
            }),
          ).to.be.true;
        });
      });

      describe('when marital status is `separated`', () => {
        it('should return `true`', () => {
          expect(
            includeSpousalInformation({
              ...formData,
              discloseFinancialInformation: true,
              maritalStatus: 'separated',
            }),
          ).to.be.true;
        });
      });
    });
  });

  describe('when `getInsuranceAriaLabel` executes', () => {
    describe('when the provider name is not provided', () => {
      it('should return a generic label', () => {
        const formData = {};
        expect(getInsuranceAriaLabel(formData)).to.equal('insurance policy');
      });
    });

    describe('when the provider name is provided', () => {
      describe('when the policy number when provided', () => {
        it('should return the provider name & policy number', () => {
          const formData = {
            insuranceName: 'Aetna',
            insurancePolicyNumber: '005588',
          };
          expect(getInsuranceAriaLabel(formData)).to.equal(
            'Aetna, Policy number 005588',
          );
        });
      });

      describe('when the group code when provided', () => {
        it('should return the provider name & group code', () => {
          const formData = {
            insuranceName: 'Aetna',
            insuranceGroupCode: '005588',
          };
          expect(getInsuranceAriaLabel(formData)).to.equal(
            'Aetna, Group code 005588',
          );
        });
      });
    });
  });

  describe('when `isOfCollegeAge` executes', () => {
    describe('when birthdate is greater than 23 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '1986-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    describe('when birthdate is less than 18 years from testdate', () => {
      it('should return `false`', () => {
        const birthdate = '2005-06-02';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.false;
      });
    });

    describe('when birthdate is exactly 18 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2005-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    describe('when birthdate is exactly 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2000-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });

    describe('when birthdate is between 18 and 23 years from testdate', () => {
      it('should return `true`', () => {
        const birthdate = '2003-06-01';
        const testdate = '2023-06-01';
        expect(isOfCollegeAge(birthdate, testdate)).to.be.true;
      });
    });
  });

  describe('when `getDependentPageList` executes', () => {
    const pages = [
      { id: 'page1', title: 'Page 1' },
      { id: 'page2', title: 'Page 2', depends: { key: 'key1', value: false } },
      { id: 'page3', title: 'Page 3' },
      { id: 'page4', title: 'Page 4', depends: { key: 'key2', value: true } },
      { id: 'page5', title: 'Page 5', depends: { key: 'key3', value: false } },
    ];

    describe('when page entries do not have conditional dependencies', () => {
      it('should return a list of only pages without a conditional dependency', () => {
        const formData = {};
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(2);
      });
    });

    describe('when two conditional dependencies do not match', () => {
      it('should return a list of three (3) pages', () => {
        const formData = { key1: true, key2: true, key3: true };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(3);
      });
    });

    describe('when one conditional dependency does not match', () => {
      it('should return a list of four (4) pages', () => {
        const formData = { key1: false, key2: true, key3: true };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(4);
      });
    });

    describe('when all conditional dependencies match', () => {
      it('should return a list of all pages', () => {
        const formData = { key1: false, key2: true, key3: false };
        expect(getDependentPageList(pages, formData)).to.have.lengthOf(5);
      });
    });
  });

  describe('when `normalizeFullName` executes', () => {
    const fullName = {
      first: 'John',
      middle: 'William',
      last: 'Smith',
      suffix: 'Jr.',
    };

    describe('when name object is omitted from the function', () => {
      it('should gracefully return an empty string', () => {
        expect(normalizeFullName()).to.be.empty;
      });
    });

    describe('when name object is provided to the function', () => {
      describe('when the `outputMiddle` param is excluded', () => {
        it('should return first name, last name and suffix', () => {
          expect(normalizeFullName(fullName)).to.equal('John Smith Jr.');
        });
      });

      describe('when the `outputMiddle` param is included', () => {
        describe('when `outputMiddle` is set to `false`', () => {
          it('should return first name, last name and suffix', () => {
            expect(normalizeFullName(fullName, false)).to.equal(
              'John Smith Jr.',
            );
          });
        });

        describe('when `outputMiddle` is set to `true`', () => {
          it('should return first name, middle name, last name and suffix', () => {
            expect(normalizeFullName(fullName, true)).to.equal(
              'John William Smith Jr.',
            );
          });

          it('should return first name, last name and suffix when middle name is `null`', () => {
            const fullNameWithoutMiddle = { ...fullName, middle: null };
            expect(normalizeFullName(fullNameWithoutMiddle, true)).to.equal(
              'John Smith Jr.',
            );
          });
        });
      });
    });
  });

  context('when `parseVeteranDob` executes', () => {
    context('when a value is omitted from the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob()).to.eq(null);
      });
    });

    context('when an empty value is passed to the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob('')).to.eq(null);
      });
    });

    context('when an invalid value is passed to the function', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob('1990-01-00')).to.eq(null);
      });
    });

    context('when the value is passed to the function is pre-1900', () => {
      it('should return `null`', () => {
        expect(parseVeteranDob('1890-01-01')).to.eq(null);
      });
    });

    context('when the value is between 1900-01-01 and today', () => {
      it('should return the value', () => {
        const validDate = '1990-01-01';
        expect(parseVeteranDob(validDate)).to.eq(validDate);
      });
    });
  });

  context('when `getDataToSet` executes', () => {
    const listRef = [{ name: 'John' }, { name: 'Jane' }, { name: 'Mary' }];
    const searchIndex = 1;
    const defaultProps = {
      slices: {
        beforeIndex: listRef.slice(0, searchIndex),
        afterIndex: listRef.slice(searchIndex + 1),
      },
      dataKey: 'dependents',
      localData: { name: 'Liz' },
      listRef,
      viewFields: {
        report: 'view:reportDependents',
        skip: 'view:skipDependents',
      },
    };
    const expectedResults = {
      blank: {
        dependents: listRef,
        [defaultProps.viewFields.report]: null,
        [defaultProps.viewFields.skip]: true,
      },
      populated: {
        dependents: [{ name: 'John' }, { name: 'Liz' }, { name: 'Mary' }],
        [defaultProps.viewFields.report]: null,
        [defaultProps.viewFields.skip]: true,
      },
    };

    context('when localData is populated', () => {
      it('should return the modified dataset without modifying the viewfield values', () => {
        expect(JSON.stringify(getDataToSet(defaultProps))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
      });
    });

    context('when localData is set to `null`', () => {
      it('should return the original dataset with the modified viewfield values', () => {
        const props = { ...defaultProps, localData: null };
        expect(JSON.stringify(getDataToSet(props))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });
  });

  context('when `getSearchAction` executes', () => {
    context('when the action is omitted', () => {
      it('should default to adding a new record', () => {
        const params = new URLSearchParams('');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'add',
          label: 'adding',
          pathToGo: `/${returnPath}`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });

    context('when the action is set to `add`', () => {
      it('should default to adding a new record', () => {
        const params = new URLSearchParams('action=add');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'add',
          label: 'adding',
          pathToGo: `/${returnPath}`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });

    context('when the action is set to `edit`', () => {
      it('should set the correct props in the response', () => {
        const params = new URLSearchParams('action=edit');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'edit',
          label: 'editing',
          pathToGo: `/${returnPath}`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });

    context('when the action is set to `update`', () => {
      it('should set the correct props in the response', () => {
        const params = new URLSearchParams('action=update');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'update',
          label: 'editing',
          pathToGo: `/review-and-submit`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });
  });

  context('when `getSearchIndex` executes', () => {
    context('when the index is omitted', () => {
      it('should default to the end of the array', () => {
        const params = new URLSearchParams('');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(
          arrayToParse.length,
        );
      });
    });

    context('when the index is not a number', () => {
      it('should default to the end of the array', () => {
        const params = new URLSearchParams('index=ddd');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(
          arrayToParse.length,
        );
      });
    });

    context('when the index is greater than the array length', () => {
      it('should default to the end of the array', () => {
        const params = new URLSearchParams('index=40');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(
          arrayToParse.length,
        );
      });
    });

    context('when the index is within the the array length', () => {
      it('should return the correct index', () => {
        const params = new URLSearchParams('index=1');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(1);
      });
    });
  });

  context('when `getDefaultState` executes', () => {
    const defaultProps = {
      defaultData: { data: {}, page: 'basic-info' },
      dataToSearch: [],
      name: 'ITEM',
    };
    const expectedResults = {
      blank: defaultProps.defaultData,
      populated: { data: { name: 'Mary' }, page: 'basic-info' },
    };

    context('when the `searchAction` & `searchIndex` props are omitted', () => {
      it('should return the default data', () => {
        expect(JSON.stringify(getDefaultState(defaultProps))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });

    context('when there is no data record for the search index', () => {
      it('should return the default data', () => {
        const props = {
          ...defaultProps,
          searchIndex: 0,
          searchAction: { mode: 'add' },
        };
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });

    context('when there is a data record for the search index', () => {
      it('should return the found data record', () => {
        const props = {
          ...defaultProps,
          dataToSearch: [{ name: 'Mary' }],
          searchIndex: 0,
          searchAction: { mode: 'add' },
        };
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
        expect(window.sessionStorage.getItem(props.name)).to.be.null;
      });
    });

    context('when the search action is set to `edit`', () => {
      it('should return the found data record', () => {
        const props = {
          ...defaultProps,
          dataToSearch: [{ name: 'Mary' }],
          searchIndex: 0,
          searchAction: { mode: 'edit' },
        };
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
        expect(window.sessionStorage.getItem(props.name)).to.equal(
          props.searchIndex.toString(),
        );
      });
    });
  });
});
