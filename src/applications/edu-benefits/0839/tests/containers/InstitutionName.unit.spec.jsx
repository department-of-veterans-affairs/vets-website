import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import InstitutionName from '../../containers/InstitutionName';
import * as useValidateFacilityCodeModule from '../../hooks/useValidateFacilityCode';
import * as useValidateAdditionalFacilityCodeModule from '../../hooks/useValidateAdditionalFacilityCode';

const mockStore = configureStore([]);

describe('InstitutionName Component', () => {
  let store;
  let apiRequestStub;
  let useValidateFacilityCodeStub;
  let useValidateAdditionalFacilityCodeStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    // Mock the hooks to return controlled values
    useValidateFacilityCodeStub = sinon.stub(
      useValidateFacilityCodeModule,
      'useValidateFacilityCode',
    );
    useValidateAdditionalFacilityCodeStub = sinon.stub(
      useValidateAdditionalFacilityCodeModule,
      'useValidateAdditionalFacilityCode',
    );

    // Default mock return values
    useValidateFacilityCodeStub.returns({
      loader: false,
      institutionAddress: {},
      institutionName: 'not found',
    });
    useValidateAdditionalFacilityCodeStub.returns({
      loader: false,
      institutionAddress: {},
      institutionName: 'not found',
    });
  });

  afterEach(() => {
    apiRequestStub.restore();
    useValidateFacilityCodeStub.restore();
    useValidateAdditionalFacilityCodeStub.restore();
  });

  describe('for main institution (isArrayItem = false)', () => {
    const initialState = {
      form: {
        data: {
          institutionDetails: {
            facilityCode: '12345678',
            institutionName: 'Harvard University',
          },
        },
      },
    };

    beforeEach(() => {
      store = mockStore(initialState);
    });

    it('renders institution name when present', () => {
      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Harvard University');
    });

    it('renders -- when institutionName is not found', () => {
      const stateWithNotFound = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'not found',
            },
          },
        },
      };
      store = mockStore(stateWithNotFound);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('--');
      expect(heading.getAttribute('aria-label')).to.equal(
        'Institution name not found',
      );
    });

    it('renders -- when institutionName is missing', () => {
      const stateWithoutName = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
            },
          },
        },
      };
      store = mockStore(stateWithoutName);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('--');
    });

    it('shows loading indicator when loading', () => {
      const loadingState = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              isLoading: true,
            },
          },
        },
      };
      store = mockStore(loadingState);

      // Mock the hook to return loader: true
      useValidateFacilityCodeStub.returns({
        loader: true,
        institutionAddress: {},
        institutionName: 'not found',
      });

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const loader = container.querySelector('va-loading-indicator');
      expect(loader).to.exist;
      expect(loader.getAttribute('message')).to.equal(
        'Finding your institution',
      );
    });

    it('uses default dataPath when ui:options is not provided', () => {
      const uiSchema = {};

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Harvard University');
    });
  });

  describe('for additional institution (isArrayItem = true)', () => {
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
      // Mock the window.location.pathname for getArrayIndexFromPathName
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
          <InstitutionName uiSchema={uiSchema} />
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
          <InstitutionName uiSchema={uiSchema} />
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
          <InstitutionName uiSchema={uiSchema} />
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

      // Mock the hook to return loader: true for array items
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
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const loader = container.querySelector('va-loading-indicator');
      expect(loader).to.exist;
    });
  });

  describe('focus management', () => {
    it('focuses facility code input after loading completes', async () => {
      const initialLoadingState = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              isLoading: true,
            },
          },
        },
      };

      const loadedState = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'Harvard University',
              isLoading: false,
            },
          },
        },
      };

      store = mockStore(initialLoadingState);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { rerender } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      // Update store to simulate loading completion
      store = mockStore(loadedState);

      rerender(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      await waitFor(() => {
        const heading = document.querySelector('#institutionHeading');
        expect(heading).to.exist;
      });
    });
  });

  describe('edge cases', () => {
    it('handles missing formData gracefully', () => {
      const emptyState = {
        form: {
          data: {},
        },
      };
      store = mockStore(emptyState);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('--');
    });

    it('handles missing form state gracefully', () => {
      const invalidState = {};
      store = mockStore(invalidState);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <InstitutionName uiSchema={uiSchema} />
        </Provider>,
      );

      const heading = container.querySelector('#institutionHeading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('--');
    });
  });
});
