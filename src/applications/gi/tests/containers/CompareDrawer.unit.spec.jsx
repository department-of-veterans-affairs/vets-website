import React from 'react';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import {
  mockConstants,
  renderWithStoreAndRouter,
  mockCompareDrawerData,
} from '../helpers';
import CompareDrawer from '../../containers/CompareDrawer';

describe('<CompareDrawer>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<CompareDrawer />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
  it('handles scroll appropriately', async () => {
    const initialState = {
      compare: {
        search: {
          loaded: [],
          institutions: {},
        },
        open: false,
      },
      preview: {},
      search: {
        location: { results: [] },
        name: { results: [] },
      },
    };
    const mockGetBoundingClientRect = sinon.stub();
    mockGetBoundingClientRect.returns({ bottom: 300, height: 100 });
    const mockRef = {
      current: {
        getBoundingClientRect: mockGetBoundingClientRect,
        style: { height: '' },
      },
    };
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
    renderWithStoreAndRouter(
      <CompareDrawer placeholderRef={mockRef} {...initialState} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(mockRef.current.style.height).to.not.equal('0px');
    });
  });

  it('test loaded length greater than 0', async () => {
    const initialState = mockCompareDrawerData;
    const screen = renderWithStoreAndRouter(<CompareDrawer />, {
      initialState,
    });
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
