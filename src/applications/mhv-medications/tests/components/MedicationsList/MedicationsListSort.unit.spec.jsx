import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import * as datadogRumModule from '@datadog/browser-rum';
import reducer from '../../../reducers';
import { rxListSortingOptions } from '../../../util/constants';
import MedicationsListSort from '../../../components/MedicationsList/MedicationsListSort';

describe('Medications List Sort component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const initialState = {
    rx: {
      preferences: {
        sortOption: 'alphabeticallyByStatus',
      },
    },
  };

  const setup = (
    shouldShowSelect = true,
    sortRxList = () => {},
    state = initialState,
  ) => {
    return renderWithStoreAndRouterV6(
      <MedicationsListSort
        shouldShowSelect={shouldShowSelect}
        sortRxList={sortRxList}
      />,
      {
        initialState: state,
        reducers: reducer,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
    expect(screen.getByTestId('sort-dropdown')).to.exist;
    expect(screen.getByTestId('sort-action-sr-text')).to.exist;
  });

  it('renders without a select element if shouldShowSelect is false', () => {
    const screen = setup(false);
    expect(screen);
    expect(screen.queryByTestId('sort-dropdown')).not.to.exist;
    expect(screen.getByTestId('sort-action-sr-text')).to.exist;
  });

  it('has the same number of list options as preset constant rxSortingListOptions', () => {
    const screen = setup();

    const sortOptions = screen.getAllByTestId('sort-option');
    expect(sortOptions.length).to.equal(
      Object.keys(rxListSortingOptions).length,
    );
  });

  it('displays the selected sort option from Redux state', () => {
    const customState = {
      rx: {
        preferences: {
          sortOption: 'lastFilledFirst',
        },
      },
    };
    const screen = setup(true, () => {}, customState);
    const dropdown = screen.getByTestId('sort-dropdown');
    expect(dropdown.getAttribute('value')).to.equal('lastFilledFirst');
  });

  it('calls sortRxList when a sort option is selected', async () => {
    const sortRxListSpy = sandbox.spy();
    const screen = setup(true, sortRxListSpy);
    const dropdown = screen.getByTestId('sort-dropdown');

    dropdown.__events.vaSelect({
      detail: { value: 'lastFilledFirst' },
    });

    await waitFor(() => {
      expect(sortRxListSpy.calledOnce).to.be.true;
      expect(sortRxListSpy.calledWith(null, 'lastFilledFirst')).to.be.true;
    });
  });

  it('updates screen reader text when sort option changes', async () => {
    const screen = setup();
    const dropdown = screen.getByTestId('sort-dropdown');
    const srText = screen.getByTestId('sort-action-sr-text');

    dropdown.__events.vaSelect({
      detail: { value: 'lastFilledFirst' },
    });

    await waitFor(() => {
      expect(srText.textContent).to.equal(
        `Sorting: ${rxListSortingOptions.lastFilledFirst.LABEL}`,
      );
    });
  });

  it('logs to DataDog when sort option changes', async () => {
    const addActionStub = sandbox.stub(
      datadogRumModule.datadogRum,
      'addAction',
    );
    const screen = setup();
    const dropdown = screen.getByTestId('sort-dropdown');

    dropdown.__events.vaSelect({
      detail: { value: 'alphabeticalOrder' },
    });

    await waitFor(() => {
      expect(addActionStub.calledOnce).to.be.true;
      expect(addActionStub.firstCall.args[0]).to.equal(
        'Alphabetical Order Option - List Page',
      );
    });
  });
});
