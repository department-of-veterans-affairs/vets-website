import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { INITIAL_STATE } from '../../../reducers/search';
import {
  mockConstants,
  renderWithStoreAndRouter,
  mockSearchResults,
} from '../../helpers';

import NameSearchResults from '../../../containers/search/NameSearchResults';

describe('<GiBillApp>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<NameSearchResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('renders without crashing', () => {
    const newProps = {
      ...INITIAL_STATE,
      inProgress: true,
    };
    const screen = renderWithStoreAndRouter(
      <NameSearchResults {...newProps} />,
      {
        initialState: {
          constants: mockConstants(),
          search: {
            ...INITIAL_STATE,
            inProgress: true,
            query: {
              name: 'some name',
            },
          },
        },
      },
    );
    const VaLoadingIndicator = screen.container.querySelector(
      'va-loading-indicator',
    );
    expect(VaLoadingIndicator).to.exist;
  });

  it('should render with results', async () => {
    const screen = renderWithStoreAndRouter(
      <NameSearchResults {...mockSearchResults} />,
      {
        initialState: {
          constants: mockConstants(),
          search: mockSearchResults,
        },
      },
    );
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should render in small screen', async () => {
    const screen = renderWithStoreAndRouter(
      <NameSearchResults {...mockSearchResults} smallScreen />,
      {
        initialState: {
          constants: mockConstants(),
          search: mockSearchResults,
        },
      },
    );
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
