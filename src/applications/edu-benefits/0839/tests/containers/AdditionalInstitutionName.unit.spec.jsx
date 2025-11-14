import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import AdditionalInstitutionName from '../../containers/AdditionalInstitutionName';
import * as useValidateAdditionalFacilityCodeModule from '../../hooks/useValidateAdditionalFacilityCode';

const mockStore = configureStore([]);

describe('AdditionalInstitutionName Component', () => {
  let store;
  let useValidateAdditionalFacilityCodeStub;

  beforeEach(() => {
    useValidateAdditionalFacilityCodeStub = sinon.stub(
      useValidateAdditionalFacilityCodeModule,
      'useValidateAdditionalFacilityCode',
    );

    useValidateAdditionalFacilityCodeStub.returns({
      loader: false,
      institutionAddress: {},
      institutionName: 'not found',
    });
  });

  afterEach(() => {
    useValidateAdditionalFacilityCodeStub.restore();
  });

  describe('when rendering additional institutions', () => {
    const stateWithArray = {
      form: {
        data: {
          institutionDetails: {
            facilityCode: '12345678',
            institutionName: 'Main University',
            facilityMap: {
              branches: [
                {
                  institution: {
                    facilityCode: '11111111',
                  },
                },
              ],
              extensions: [
                {
                  institution: {
                    facilityCode: '22222222',
                  },
                },
              ],
            },
          },
          additionalInstitutionDetails: [
            {
              facilityCode: '11111111',
              institutionName: 'MIT',
            },
            {
              facilityCode: '22222222',
              institutionName: 'Stanford University',
            },
          ],
        },
      },
    };

    beforeEach(() => {
      store = mockStore(stateWithArray);

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/0' },
      });
    });

    it('renders institution name from array at index 0', () => {
      window.location.pathname = '/0';

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <AdditionalInstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('MIT');
    });

    it('renders institution name from array at index 1', () => {
      window.location.pathname = '/1';

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <AdditionalInstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Stanford University');
    });

    it('renders -- when institution name is not found in array item', () => {
      const stateWithNotFoundInArray = {
        form: {
          data: {
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                institutionName: 'not found',
              },
            ],
          },
        },
      };
      store = mockStore(stateWithNotFoundInArray);
      window.location.pathname = '/0';

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <AdditionalInstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('--');
    });

    it('shows loading indicator for array item', () => {
      const loadingState = {
        form: {
          data: {
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                isLoading: true,
              },
            ],
          },
        },
      };
      store = mockStore(loadingState);
      window.location.pathname = '/0';

      useValidateAdditionalFacilityCodeStub.returns({
        loader: true,
        institutionAddress: {},
        institutionName: 'not found',
      });

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <AdditionalInstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const loader = container.querySelector('va-loading-indicator');
      expect(loader).to.exist;
    });
  });
});
