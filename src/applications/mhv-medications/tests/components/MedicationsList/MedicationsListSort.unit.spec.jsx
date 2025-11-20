import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
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

  const setup = (shouldShowSelect = true, sortRxList = sinon.spy()) => {
    return renderWithStoreAndRouterV6(
      <MedicationsListSort
        shouldShowSelect={shouldShowSelect}
        sortRxList={sortRxList}
      />,
      {
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

  it('displays correct label for sort dropdown', () => {
    const screen = setup();
    const select = screen.getByTestId('sort-dropdown');
    expect(select).to.have.attribute('label', 'Show medications in this order');
  });

  it('calls sortRxList when sort option changes', async () => {
    const sortRxListSpy = sandbox.spy();
    const screen = setup(true, sortRxListSpy);
    const select = screen.getByTestId('sort-dropdown');

    const event = new CustomEvent('vaSelect', {
      detail: { value: 'alphabeticalOrder' },
    });
    select.dispatchEvent(event);

    await waitFor(() => {
      expect(sortRxListSpy.calledOnce).to.be.true;
      expect(sortRxListSpy.calledWith(null, 'alphabeticalOrder')).to.be.true;
    });
  });

  it('updates screen reader text when sort option changes', async () => {
    const screen = setup();
    const select = screen.getByTestId('sort-dropdown');
    const srText = screen.getByTestId('sort-action-sr-text');

    const event = new CustomEvent('vaSelect', {
      detail: { value: 'alphabeticalOrder' },
    });
    select.dispatchEvent(event);

    await waitFor(() => {
      expect(srText.textContent).to.include('Sorting:');
      expect(srText.textContent).to.include(
        rxListSortingOptions.alphabeticalOrder.LABEL,
      );
    });
  });

  it('renders all sorting options with correct labels', () => {
    const screen = setup();
    const sortOptions = screen.getAllByTestId('sort-option');

    Object.keys(rxListSortingOptions).forEach((key, index) => {
      expect(sortOptions[index].value).to.equal(key);
      expect(sortOptions[index].textContent).to.equal(
        rxListSortingOptions[key].LABEL,
      );
    });
  });

  it('has correct data-dd-action-name attribute', () => {
    const screen = setup();
    const select = screen.getByTestId('sort-dropdown');
    expect(select).to.have.attribute('data-dd-action-name');
  });

  it('renders sr-only status div with correct role', () => {
    const screen = setup();
    const srText = screen.getByTestId('sort-action-sr-text');
    expect(srText).to.have.class('sr-only');
    expect(srText).to.have.attribute('role', 'status');
  });

  it('select has uswds attribute', () => {
    const screen = setup();
    const select = screen.getByTestId('sort-dropdown');
    expect(select).to.have.attribute('uswds');
  });
});
