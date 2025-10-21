import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ChooseExpenseType from '../../../../components/complex-claims/pages/ChooseExpenseType';
import reducer from '../../../../redux/reducer';

describe('ChooseExpenseType', () => {
  const defaultApptId = '12345';

  const renderComponent = (apptId = defaultApptId) => {
    return renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/complex/${apptId}/expense-type`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/complex/:apptId/expense-type"
            element={<ChooseExpenseType />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: {},
        reducers: reducer,
      },
    );
  };

  it('renders the component with all required elements', () => {
    const screen = renderComponent();

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'What type of expense do you want to add?',
    );

    expect(screen.getByText(/Start with one expense/)).to.exist;
    expect(screen.getByText(/To request reimbursement for air fare/)).to.exist;

    expect($('va-radio[label="Choose an expense type"]')).to.exist;
    expect($('va-button-pair')).to.exist;
  });

  it('renders all expense type options', () => {
    renderComponent();

    const radioOptions = [
      'Mileage',
      'Parking',
      'Tolls',
      'Public transportation, taxi, or rideshare',
      'Air fare',
      'Lodging',
      'Meals',
      'Other travel expenses',
    ];

    radioOptions.forEach(option => {
      expect($(`va-radio-option[label="${option}"]`)).to.exist;
    });
  });

  it('renders expense options with correct values', () => {
    renderComponent();

    const expectedOptions = [
      { value: 'mileage', label: 'Mileage' },
      { value: 'parking', label: 'Parking' },
      { value: 'tolls', label: 'Tolls' },
      {
        value: 'public-transportation',
        label: 'Public transportation, taxi, or rideshare',
      },
      { value: 'air-fare', label: 'Air fare' },
      { value: 'lodging', label: 'Lodging' },
      { value: 'meals', label: 'Meals' },
      { value: 'other', label: 'Other travel expenses' },
    ];

    expectedOptions.forEach(option => {
      expect(
        $(`va-radio-option[value="${option.value}"][label="${option.label}"]`),
      ).to.exist;
    });
  });

  it('renders radio options with tile property', () => {
    renderComponent();

    const radioOptions = document.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.be.greaterThan(0);

    // Check that all radio options have the tile attribute
    radioOptions.forEach(option => {
      expect(option.hasAttribute('tile')).to.be.true;
    });
  });

  it('handles expense type selection', () => {
    renderComponent();

    const radioGroup = $('va-radio[label="Choose an expense type"]');
    expect(radioGroup).to.exist;

    fireEvent(
      radioGroup,
      new CustomEvent('vaValueChange', {
        detail: { value: 'mileage' },
      }),
    );

    // Check that the selection is reflected in the component
    const mileageOption = $('va-radio-option[value="mileage"]');
    expect(mileageOption.hasAttribute('checked')).to.be.true;
  });

  it('requires an expense type selection', () => {
    renderComponent();

    const radioGroup = $('va-radio[label="Choose an expense type"]');
    expect(radioGroup.hasAttribute('required')).to.be.true;
  });

  it('renders button pair with correct properties', () => {
    renderComponent();

    const buttonPair = $('va-button-pair');
    expect(buttonPair).to.exist;
    expect(buttonPair.hasAttribute('continue')).to.be.true;
    expect(buttonPair.hasAttribute('disable-analytics')).to.be.true;
  });

  it('displays correct heading text', () => {
    const screen = renderComponent();

    expect(screen.getByText('What type of expense do you want to add?')).to
      .exist;
  });

  it('displays helpful instruction text', () => {
    const screen = renderComponent();

    expect(screen.getByText(/Start with one expense/)).to.exist;
  });

  it('displays pre-approval requirement notice', () => {
    const screen = renderComponent();

    expect(screen.getByText(/To request reimbursement for air fare/)).to.exist;
  });
});
