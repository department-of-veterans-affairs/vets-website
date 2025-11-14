import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import InstitutionName from '../../containers/InstitutionName';
import * as useValidateFacilityCodeModule from '../../hooks/useValidateFacilityCode';

const mockStore = configureStore([]);

describe('InstitutionName Component', () => {
  let store;
  let apiRequestStub;
  let useValidateFacilityCodeStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    // Mock the hooks to return controlled values
    useValidateFacilityCodeStub = sinon.stub(
      useValidateFacilityCodeModule,
      'useValidateFacilityCode',
    );

    // Default mock return values
    useValidateFacilityCodeStub.returns({
      loader: false,
      institutionAddress: {},
      institutionName: 'not found',
    });
  });

  afterEach(() => {
    apiRequestStub.restore();
    useValidateFacilityCodeStub.restore();
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
});
