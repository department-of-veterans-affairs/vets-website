import React from 'react';
import { act } from '@testing-library/react';
import { expect } from 'chai';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import * as VAP_SERVICE from 'platform/user/profile/vap-svc/constants';
import {
  phoneFormSchema,
  phoneUiSchema,
} from '../../util/contact-information/phoneUtils';

import { renderWithProfileReducers as render } from '../unit-test-helpers';
import { useProfileTransaction } from '../../hooks';

const initialState = {
  vapService: {
    hasUnsavedEdits: true,
    modal: 'homePhone',
    modalData: null,
    formFields: {
      homePhone: {
        value: {
          areaCode: '',
          countryCode: '',
          extension: '',
          inputPhoneNumber: '',
          isInternational: false,
          phoneNumber: '',
        },
      },
    },
    transactions: [],
    fieldTransactionMap: {
      homePhone: {
        isPending: false,
        method: 'POST',
        isFailed: true,
        error: {},
      },
    },
    transactionsAwaitingUpdate: [],
  },
};

const setup = () => {
  mockFetch();
  setFetchJSONResponse(global.fetch.onFirstCall(), {
    data: {
      attributes: {},
    },
  });
};

function setupTestComponent(...args) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, useProfileTransaction(...args));
    return null;
  }
  render(<TestComponent />, { initialState });
  return returnVal;
}

describe('useProfileTransaction hook', () => {
  beforeEach(() => {
    setup();
  });

  describe('basic state and field info for each VAP_SERVICE field', () => {
    Object.values(VAP_SERVICE.FIELD_NAMES).forEach(fieldName => {
      it(`should return loading, analyticsSectionName, and title for ${fieldName}`, () => {
        const result = setupTestComponent(fieldName);

        expect(result.isLoading).to.be.false;
        expect(result.analyticsSectionName).to.be.equal(
          VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
        );
        expect(result.title).to.be.equal(VAP_SERVICE.FIELD_TITLES[fieldName]);
      });
    });
  });

  describe('Home Phone specific tests', () => {
    it('should return appropriate formSchema and uiSchema for legacy form system', () => {
      const fieldName = VAP_SERVICE.FIELD_NAMES.HOME_PHONE;
      const result = setupTestComponent(fieldName);

      expect(result.formSchema).to.deep.equal(phoneFormSchema);
      expect(result.uiSchema).to.deep.equal(
        phoneUiSchema(VAP_SERVICE.FIELD_TITLES[fieldName]),
      );
    });

    it('should POST when existing record id is not present', () => {
      const fieldName = VAP_SERVICE.FIELD_NAMES.HOME_PHONE;
      const result = setupTestComponent(fieldName);

      expect(result.isLoading).to.be.false;

      act(() => {
        result.startTransaction({
          inputPhoneNumber: '123456789',
          extension: '000',
        });
      });

      expect(result.isLoading).to.be.true;
      expect(global.fetch.firstCall.args[1].method).to.equal('POST');
    });

    it('should PUT when existing record id is present anbd include id in fetch', () => {
      const fieldName = VAP_SERVICE.FIELD_NAMES.HOME_PHONE;
      const result = setupTestComponent(fieldName);

      expect(result.isLoading).to.be.false;

      act(() => {
        result.startTransaction({
          inputPhoneNumber: '123456789',
          extension: '000',
          id: '111',
        });
      });

      expect(result.isLoading).to.be.true;

      const fetchOptions = global.fetch.firstCall.args[1];
      const body = JSON.parse(fetchOptions.body);

      expect(fetchOptions.method).to.equal('PUT');
      expect(body.id).to.equal('111');
    });

    it('should fetch with correct request body data to correct endpoint', () => {
      const fieldName = VAP_SERVICE.FIELD_NAMES.HOME_PHONE;
      const result = setupTestComponent(fieldName);

      expect(result.isLoading).to.be.false;

      act(() => {
        result.startTransaction({
          inputPhoneNumber: '123456789',
          extension: '000',
        });
      });

      expect(result.isLoading).to.be.true;

      const [url, fetchOptions] = global.fetch.firstCall.args;
      const body = JSON.parse(fetchOptions.body);

      expect(url.endsWith('profile/telephones')).to.be.true;
      expect(body.areaCode).to.equal('123');
      expect(body.extension).to.equal('000');
      expect(body.phoneNumber).to.equal('456789');
      expect(body.phoneType).to.equal(VAP_SERVICE.PHONE_TYPE[fieldName]);
    });
  });
});
