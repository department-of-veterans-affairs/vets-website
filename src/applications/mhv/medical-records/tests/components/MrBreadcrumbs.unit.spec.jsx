import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import MrBreadcrumbs from '../../components/MrBreadcrumbs';

describe('MrBreadcrumbs component', () => {
  it('should display no breadcrumbs', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          list: [
            {
              url: '/my-health/medical-records/',
              label: 'Medical records',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<MrBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });
    const header = screen.getByTestId('breadcrumbs');
    expect(header).to.exist;
  });
});

describe('MrBreadcrumbs component with nothing in the store', () => {
  it('should display no breadcrumbs', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          list: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<MrBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });
    const header = screen.getByTestId('no-breadcrumbs');
    expect(header).to.exist;
  });
});
