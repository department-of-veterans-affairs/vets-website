import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import prescriptionsList from '../fixtures/prescriptionsList.json';
import reducers from '../../reducers';
import PrescriptionsPrintOnly from '../../containers/PrescriptionsPrintOnly';
import { allergiesList } from '../fixtures/allergiesList.json';
import { rxListSortingOptions } from '../../util/constants';

let sandbox;

describe('Medications List Print Page', () => {
  const setup = (params = {}) => {
    return renderWithStoreAndRouterV6(<PrescriptionsPrintOnly />, {
      initialState: {
        rx: {
          prescriptions: {
            selectedSortOption: rxListSortingOptions.alphabeticalOrder,
          },
          allergies: {},
        },
      },
      reducers,
      initialEntries: ['/?page=1'],
      ...params,
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock the RTK Query hooks
    sandbox.stub(allergiesApiModule, 'useGetAllergiesQuery').returns({
      data: allergiesList,
      error: undefined,
      isLoading: false,
      isFetching: false,
    });

    sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns({
        data: {
          prescriptions: prescriptionsList.data,
          meta: prescriptionsList.meta,
          pagination: prescriptionsList.meta.pagination,
        },
        error: undefined,
        isLoading: false,
        isFetching: false,
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without errors', async () => {
    const screen = setup();
    expect(screen);
  });

  it('Medications | Veterans Affairs', () => {
    const screen = setup();
    const rxName = screen.findByText('Medications | Veterans Affairs');
    expect(rxName).to.exist;
  });
  it('does not render for paths other than medication list and details', () => {
    const screen = setup({ path: '/foo' });
    expect(screen.queryByTestId('name-date-of-birth')).to.not.exist;
  });
});
