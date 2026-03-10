import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MedicationHistoryFilter, {
  FILTER_OPTIONS,
} from '../../../components/MedicationHistory/MedicationHistoryFilter';
import reducers from '../../../reducers';

describe('MedicationHistoryFilter component', () => {
  let updateFilterSpy;

  const defaultInitialState = {
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      mhv_medications_cerner_pilot: false,
      // eslint-disable-next-line camelcase
      mhv_medications_v2_status_mapping: false,
    },
  };

  const setup = ({
    isLoading = false,
    initialState = defaultInitialState,
  } = {}) => {
    updateFilterSpy = sinon.spy();

    return renderWithStoreAndRouterV6(
      <MedicationHistoryFilter
        updateFilter={updateFilterSpy}
        isLoading={isLoading}
      />,
      {
        initialState,
        reducers,
      },
    );
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders the filter radio group with correct label', () => {
    const screen = setup();
    const radioGroup = screen.getByTestId('medication-history-filter');
    expect(radioGroup).to.exist;
    expect(radioGroup.getAttribute('label')).to.equal(
      'Select medications to show in list',
    );
  });

  it('renders all filter options', () => {
    const screen = setup();
    FILTER_OPTIONS.forEach(({ key }) => {
      expect(screen.getByTestId(`medication-history-filter-option-${key}`)).to
        .exist;
    });
  });

  it('renders the correct label text for each filter option', () => {
    const screen = setup();
    FILTER_OPTIONS.forEach(({ key, label }) => {
      const radioOption = screen.getByTestId(
        `medication-history-filter-option-${key}`,
      );
      expect(radioOption.getAttribute('label')).to.equal(label);
    });
  });

  it('has ALL_MEDICATIONS checked by default', () => {
    const screen = setup();
    const allMedsOption = screen.getByTestId(
      'medication-history-filter-option-ALL_MEDICATIONS',
    );
    expect(allMedsOption.getAttribute('checked')).to.equal('true');
  });

  it('renders the Update list button', () => {
    const screen = setup();
    const button = screen.getByTestId('update-list-button');
    expect(button).to.exist;
    expect(button.getAttribute('text')).to.equal('Update list');
  });

  it('shows loading state on the Update list button when isLoading is true', () => {
    const screen = setup({ isLoading: true });
    const button = screen.getByTestId('update-list-button');
    expect(button.getAttribute('loading')).to.equal('true');
  });

  it('does not show loading state on the Update list button when isLoading is false', () => {
    const screen = setup({ isLoading: false });
    const button = screen.getByTestId('update-list-button');
    expect(button.getAttribute('loading')).to.not.equal('true');
  });

  it('calls updateFilter when Update list button is clicked', () => {
    const screen = setup();
    const button = screen.getByTestId('update-list-button');
    fireEvent.click(button);
    expect(updateFilterSpy.calledOnce).to.be.true;
  });

  it('passes the selected filter option to updateFilter on submit', () => {
    const screen = setup();
    const button = screen.getByTestId('update-list-button');
    fireEvent.click(button);
    expect(updateFilterSpy.calledWith('ALL_MEDICATIONS')).to.be.true;
  });

  it('updates internal state when a radio option changes', () => {
    const screen = setup();
    // Simulate the web component's vaValueChange event on the parent radio group
    const radioGroup = screen.getByTestId('medication-history-filter');
    radioGroup.__events.vaValueChange({ detail: { value: 'ACTIVE' } });

    // Click Update list to verify the new value is passed
    const button = screen.getByTestId('update-list-button');
    fireEvent.click(button);
    expect(updateFilterSpy.calledWith('ACTIVE')).to.be.true;
  });

  it('renders exactly 4 filter options', () => {
    const screen = setup();
    expect(FILTER_OPTIONS).to.have.lengthOf(4);
    expect(screen.getByTestId('medication-history-filter-option-ACTIVE')).to
      .exist;
    expect(screen.getByTestId('medication-history-filter-option-RENEWAL')).to
      .exist;
    expect(screen.getByTestId('medication-history-filter-option-INACTIVE')).to
      .exist;
    expect(
      screen.getByTestId('medication-history-filter-option-ALL_MEDICATIONS'),
    ).to.exist;
  });
});
