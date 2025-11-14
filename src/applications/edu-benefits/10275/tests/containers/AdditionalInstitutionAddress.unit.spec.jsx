import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as arrayBuilderHelpers from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import AdditionalInstitutionAddress from '../../containers/AdditionalInstitutionAddress';

const mockStore = configureStore([]);

describe('AdditionalInstitutionAddress', () => {
  let store;
  let getArrayIndexStub;

  beforeEach(() => {
    getArrayIndexStub = sinon.stub(
      arrayBuilderHelpers,
      'getArrayIndexFromPathName',
    );
    getArrayIndexStub.returns(0);
  });

  afterEach(() => {
    getArrayIndexStub.restore();
  });

  it('renders the institution address when validation passes', () => {
    store = mockStore({
      form: {
        data: {
          additionalLocations: [
            {
              facilityCode: '12345678',
              poeEligible: true,
              institutionName: 'Sample University',
              institutionAddress: {
                street: '123 Main St',
                city: 'Anytown',
                state: 'VA',
                postalCode: '12345',
                country: 'USA',
              },
            },
          ],
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <AdditionalInstitutionAddress />
      </Provider>,
    );

    const addressBlock = container.querySelector('#institutionAddress');
    expect(addressBlock).to.exist;
    expect(addressBlock.textContent).to.contain('123 Main St');
    expect(addressBlock.textContent).to.contain('Anytown, VA 12345');
    expect(addressBlock.textContent).to.contain('USA');
  });

  it('renders fallback text when address details should not be shown', () => {
    store = mockStore({
      form: {
        data: {
          additionalLocations: [
            {
              facilityCode: '12345678',
              poeEligible: true,
              institutionName: 'First Campus',
              institutionAddress: {
                street: '123 Main St',
                city: 'Anytown',
                state: 'VA',
                postalCode: '12345',
                country: 'USA',
              },
            },
            {
              facilityCode: '12345678',
              poeEligible: true,
              institutionName: 'Duplicate Campus',
              institutionAddress: {
                street: '456 Elm St',
                city: 'Othertown',
                state: 'VA',
                postalCode: '67890',
                country: 'USA',
              },
            },
          ],
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <AdditionalInstitutionAddress />
      </Provider>,
    );

    expect(container.querySelector('#institutionAddress')).to.not.exist;
    const fallback = container.querySelector(
      '.vads-u-font-weight--normal.vads-u-font-size--h4',
    );
    expect(fallback).to.exist;
    expect(fallback.textContent).to.equal('--');
  });
});
