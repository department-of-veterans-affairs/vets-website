import sinon from 'sinon';

import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

import {
  conditionallyShowPrefillMessage,
  PREFILL_FLAGS,
  prefillTransformer,
  submit,
  removeEmptyStringProperties,
  removeFacilityCodeIfManualEntry,
  transform,
  transformSearchToolAddress,
} from '../../feedback-tool/helpers';

describe('removeEmptyStringProperties', () => {
  test('removes keys that have empty string values', () => {
    expect(removeEmptyStringProperties({ key: '' })).toEqual({});
    expect(removeEmptyStringProperties({ key: '  ' })).toEqual({});
  });
  test('converts preserves non-empty strings', () => {
    expect(removeEmptyStringProperties({ key: 'hello' })).toEqual({
      key: 'hello',
    });
    expect(removeEmptyStringProperties({ key: '  ', key2: 'hello' })).toEqual({
      key2: 'hello',
    });
  });
});

describe('feedback-tool helpers:', () => {
  describe('transformSearchToolAddress', () => {
    test('converts international address data to the proper format', () => {
      const inputData = {
        address1: '254 PHAYATHAI ROAD',
        address2: 'ENGINEERING BLDG 2',
        address3: 'ROOM 107   10330',
        city: 'BANGKOK',
        country: 'THAILAND',
        state: null,
        zip: null,
      };
      const expectedAddress = {
        street: '254 PHAYATHAI ROAD',
        street2: 'ENGINEERING BLDG 2',
        street3: 'ROOM 107   10330',
        city: 'BANGKOK',
        country: 'THAILAND',
        state: null,
        postalCode: null,
      };
      const address = transformSearchToolAddress(inputData);
      expect(address).toEqual(expectedAddress);
    });
    test('converts domestic address data to the proper format', () => {
      const inputData = {
        address1: '1840 NE ARGYLE',
        address2: null,
        address3: null,
        city: 'PORTLAND',
        country: 'USA',
        state: 'OR',
        zip: '97211',
      };
      const expectedAddress = {
        street: '1840 NE ARGYLE',
        street2: null,
        street3: null,
        city: 'PORTLAND',
        country: 'United States',
        state: 'OR',
        postalCode: '97211',
      };
      const address = transformSearchToolAddress(inputData);
      expect(address).toEqual(expectedAddress);
    });
    test('trims fields that are too long', () => {
      const inputData1 = {
        address1: '254 PHAYATHAI ROAD 254 PHAYATHAI ROAD 254 PHAYATHAI ROAD',
        address2: 'ENGINEERING BLDG 2 ENGINEERING BLDG 2 ENGINEERING BLDG 2',
        address3: 'ROOM 107   10330 ROOM 107   10330 ROOM 107   10330 ROOM 107',
        city: 'BANGKOK IS A VERY VERY VERY VERY VERY VERY VERY LONG CITY NAME',
        country: 'THAILAND',
        state: null,
        zip: null,
      };
      const expectedAddress1 = {
        street: '254 PHAYATHAI ROAD 254 PHAYATHAI ROAD 254 PHAYATHAI ',
        street2: 'ENGINEERING BLDG 2 ENGINEERING BLDG 2 ENGINEERING BL',
        street3: 'ROOM 107   10330 ROOM 107   10330 ROOM 107   10330 R',
        city: 'BANGKOK IS A VERY VERY VERY VERY VERY VE',
        country: 'THAILAND',
        state: null,
        postalCode: null,
      };
      const inputData2 = {
        address1:
          '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG STREET NAME',
        address2:
          '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG STREET NAME',
        address3:
          '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG STREET NAME',
        city:
          'PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE',
        country: 'USA',
        state: 'OR',
        zip: '97211',
      };
      const expectedAddress2 = {
        street:
          '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG ST',
        street2:
          '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG ST',
        street3:
          '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG ST',
        city:
          'PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CIT',
        country: 'United States',
        state: 'OR',
        postalCode: '97211',
      };
      const address1 = transformSearchToolAddress(inputData1);
      const address2 = transformSearchToolAddress(inputData2);
      expect(address1).toEqual(expectedAddress1);
      expect(address2).toEqual(expectedAddress2);
    });
    test('converts empty strings to `undefined`', () => {
      const inputData = {
        address1: '1840 NE ARGYLE',
        address2: '',
        address3: '',
        city: 'PORTLAND',
        country: 'USA',
        state: 'OR',
        zip: '97211',
      };
      const expectedAddress = {
        street: '1840 NE ARGYLE',
        city: 'PORTLAND',
        country: 'United States',
        state: 'OR',
        postalCode: '97211',
      };
      const address = transformSearchToolAddress(inputData);
      expect(address).toEqual(expectedAddress);
    });
  });

  describe('removeFacilityCodeIfManualEntry', () => {
    test('removes the facility code if manual entry is used', () => {
      const form = {
        data: {
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                facilityCode: 123456,
                'view:manualSchoolEntryChecked': true,
              },
            },
          },
        },
      };
      const actual = removeFacilityCodeIfManualEntry(form);
      const expected = {
        data: {
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                'view:manualSchoolEntryChecked': true,
              },
            },
          },
        },
      };
      expect(actual).toEqual(expected);
    });
    test('does not manipulate the object if manual entry is not used', () => {
      const form = {
        data: {
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                facilityCode: 123456,
                'view:manualSchoolEntryChecked': false,
              },
            },
          },
        },
      };
      const actual = removeFacilityCodeIfManualEntry(form);
      expect(actual).toEqual(form);
    });
  });

  describe('transform', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {},
          },
        },
      },
    };
    test('calls the `formTransformer` with the `form` object', () => {
      const form = { data: {} };
      const formTransformerSpy = sinon.spy(data => data);
      transform(formConfig, form, formTransformerSpy);
      expect(formTransformerSpy.calledWith(form)).toBe(true);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });
    test('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig)
        .then(() => {
          expect.fail();
        })
        .catch(err => {
          expect(err.message).toBe('fake error');
        });
    });
    test('should resolve if polling state is success', () => {
      const parsedResponse = {};
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'success',
            parsedResponse,
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(res => {
        expect(res).toEqual({});
      });
    });
    test('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'failed',
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig)
        .then(() => {
          expect.fail();
        })
        .catch(err => {
          expect(err.message).toBe(
            'vets_server_error_gi_bill_feedbacks: status failed',
          );
        });
    });

    afterEach(() => {
      resetFetch();
      delete window.URL;
    });
  });

  describe('prefillTransformer', () => {
    let pages;
    let formData;
    let metadata;
    beforeEach(() => {
      pages = {};
      formData = {};
      metadata = {};
    });
    describe(`"${PREFILL_FLAGS.APPLICANT_INFORMATION}" flag`, () => {
      test('is added when a `fullName` is set on the formData', () => {
        formData.fullName = { first: 'Pat' };
        const expectedFormData = {
          ...formData,
          [PREFILL_FLAGS.APPLICANT_INFORMATION]: true,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
      test('is not added when a `fullName` is not set on the formData', () => {
        const expectedFormData = {
          ...formData,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
    });
    describe(`"${PREFILL_FLAGS.SERVICE_INFORMATION}" flag`, () => {
      test('is added when a `serviceBranch` is set on the formData', () => {
        formData.serviceBranch = 'Air Force';
        const expectedFormData = {
          ...formData,
          [PREFILL_FLAGS.SERVICE_INFORMATION]: true,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
      test('is added when a `serviceDateRange` is set on the formData', () => {
        formData.serviceDateRange = {
          from: '2001-03-21',
          to: '2014-07-21',
        };
        const expectedFormData = {
          ...formData,
          [PREFILL_FLAGS.SERVICE_INFORMATION]: true,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
      test(
        'is not added when neither `serviceBranch` or `serviceDateRange` are not set on the formData',
        () => {
          const expectedFormData = {
            ...formData,
          };
          const result = prefillTransformer(pages, formData, metadata);
          expect(result.metadata).toEqual(metadata);
          expect(result.pages).toEqual(pages);
          expect(result.formData).toEqual(expectedFormData);
        }
      );
    });
    describe(`"${PREFILL_FLAGS.CONTACT_INFORMATION}" flag`, () => {
      test('is added when an `applicantEmail` is set on the formData', () => {
        formData.applicantEmail = 'foo@bar.com';
        const expectedFormData = {
          ...formData,
          [PREFILL_FLAGS.CONTACT_INFORMATION]: true,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
      test('is added when a `phone` is set on the formData', () => {
        formData.phone = '4151234567';
        const expectedFormData = {
          ...formData,
          [PREFILL_FLAGS.CONTACT_INFORMATION]: true,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
      test('is added when an `address` is set on the formData', () => {
        formData.address = { country: 'US' };
        const expectedFormData = {
          ...formData,
          [PREFILL_FLAGS.CONTACT_INFORMATION]: true,
        };
        const result = prefillTransformer(pages, formData, metadata);
        expect(result.metadata).toEqual(metadata);
        expect(result.pages).toEqual(pages);
        expect(result.formData).toEqual(expectedFormData);
      });
      test(
        'is not added when neither `address`, `phone`, or `applicantEmail` are set on the formData',
        () => {
          const expectedFormData = {
            ...formData,
          };
          const result = prefillTransformer(pages, formData, metadata);
          expect(result.metadata).toEqual(metadata);
          expect(result.pages).toEqual(pages);
          expect(result.formData).toEqual(expectedFormData);
        }
      );
    });
  });

  describe('conditionalPrefillMessage', () => {
    let messageComponent;
    const data = {
      formData: {
        goodFlag: true,
      },
    };
    beforeEach(() => {
      messageComponent = sinon.spy(() => 'dom');
    });
    test(
      'calls the `messageComponent` param if the correct flag is set on data.formData',
      () => {
        const result = conditionallyShowPrefillMessage(
          'goodFlag',
          data,
          messageComponent,
        );
        expect(messageComponent.called).toBe(true);
        expect(result).toBe('dom');
      }
    );
    test(
      'does not call the `messageComponent` param if the correct flag is not set data.formData',
      () => {
        const result = conditionallyShowPrefillMessage(
          'badFlag',
          data,
          messageComponent,
        );
        expect(messageComponent.called).toBe(false);
        expect(result).toBe(null);
      }
    );
  });
});
