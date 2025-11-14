import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as arrayBuilderHelpers from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import AdditionalInstitutionName from '../../containers/AdditionalInstitutionName';
import * as useValidateAdditionalFacilityCodeModule from '../../hooks/useValidateAdditionalFacilityCode';

const mockStore = configureStore([]);

describe('AdditionalInstitutionName', () => {
  let store;
  let getArrayIndexStub;
  let useValidateAdditionalFacilityCodeStub;

  beforeEach(() => {
    getArrayIndexStub = sinon.stub(
      arrayBuilderHelpers,
      'getArrayIndexFromPathName',
    );
    getArrayIndexStub.returns(0);

    useValidateAdditionalFacilityCodeStub = sinon.stub(
      useValidateAdditionalFacilityCodeModule,
      'useValidateAdditionalFacilityCode',
    );
    useValidateAdditionalFacilityCodeStub.returns({ loader: false });
  });

  afterEach(() => {
    getArrayIndexStub.restore();
    useValidateAdditionalFacilityCodeStub.restore();
  });

  it('renders the institution name when validation passes', () => {
    store = mockStore({
      form: {
        data: {
          additionalLocations: [
            {
              facilityCode: '12345678',
              institutionName: 'Sample University',
              poeEligible: true,
            },
          ],
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <AdditionalInstitutionName />
      </Provider>,
    );

    const heading = container.querySelector('#institutionHeading');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Sample University');
  });

  it('renders a loading indicator when the lookup is in progress', () => {
    useValidateAdditionalFacilityCodeStub.returns({ loader: true });

    store = mockStore({
      form: {
        data: {
          additionalLocations: [
            {
              facilityCode: '12345678',
              institutionName: 'Sample University',
              poeEligible: true,
            },
          ],
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <AdditionalInstitutionName />
      </Provider>,
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('renders fallback text when validation fails', () => {
    store = mockStore({
      form: {
        data: {
          additionalLocations: [
            {
              facilityCode: '12345678',
              institutionName: 'not found',
              poeEligible: true,
            },
            {
              facilityCode: '12345678',
              institutionName: 'Duplicate University',
              poeEligible: true,
            },
          ],
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <AdditionalInstitutionName />
      </Provider>,
    );

    const heading = container.querySelector('#institutionHeading');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('--');
  });
});
