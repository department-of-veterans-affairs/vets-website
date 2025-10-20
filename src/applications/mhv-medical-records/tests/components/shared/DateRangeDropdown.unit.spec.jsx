import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import DateRangeDropdown from '../../../components/shared/DateRangeDropdown';

describe('DateRangeDropdown', () => {
  let mockOnChange;
  let mockOnCustomDateChange;
  const options = [
    { value: 0, label: 'Last 90 days' },
    { value: 1, label: '91 to 180 days ago' },
    { value: 2, label: '181 to 270 days ago' },
    { value: 3, label: '271 to 365 days ago' },
  ];

  beforeEach(() => {
    mockOnChange = sinon.spy();
    mockOnCustomDateChange = sinon.spy();
  });

  it('renders the dropdown correctly', () => {
    const screen = render(
      <DateRangeDropdown
        currentRange={0}
        onChange={mockOnChange}
        options={options}
      />,
    );

    expect(screen.getByTestId('date-range-dropdown')).to.exist;
  });

  it('displays all options including custom range', () => {
    const screen = render(
      <DateRangeDropdown
        currentRange={0}
        onChange={mockOnChange}
        options={options}
      />,
    );

    const dropdown = screen.getByTestId('date-range-dropdown');
    const optionElements = dropdown.querySelectorAll('option');
    // 4 predefined options + 1 custom option
    expect(optionElements).to.have.lengthOf(5);
  });

  it('has the correct selected value', () => {
    const screen = render(
      <DateRangeDropdown
        currentRange={1}
        onChange={mockOnChange}
        options={options}
      />,
    );

    const dropdown = screen.getByTestId('date-range-dropdown');
    expect(dropdown).to.have.attribute('value', '1');
  });

  it('calls onChange when a new option is selected', () => {
    const screen = render(
      <DateRangeDropdown
        currentRange={0}
        onChange={mockOnChange}
        options={options}
      />,
    );

    const dropdown = screen.getByTestId('date-range-dropdown');
    fireEvent.vaSelect(dropdown, { detail: { value: '2' } });

    sinon.assert.calledOnce(mockOnChange);
    sinon.assert.calledWith(mockOnChange, 2);
  });

  it('shows custom date picker when custom range is selected', () => {
    const screen = render(
      <DateRangeDropdown
        currentRange={0}
        onChange={mockOnChange}
        options={options}
        onCustomDateChange={mockOnCustomDateChange}
      />,
    );

    const dropdown = screen.getByTestId('date-range-dropdown');
    fireEvent.vaSelect(dropdown, { detail: { value: '-1' } });

    expect(screen.getByTestId('custom-date-picker')).to.exist;
    expect(screen.getByTestId('custom-date-submit-button')).to.exist;
  });

  it('shows custom date picker when currentRange is -1', () => {
    const screen = render(
      <DateRangeDropdown
        currentRange={-1}
        onChange={mockOnChange}
        options={options}
        onCustomDateChange={mockOnCustomDateChange}
        customStartDate="2024-01-01"
      />,
    );

    expect(screen.getByTestId('custom-date-picker')).to.exist;
    expect(screen.getByTestId('custom-date-submit-button')).to.exist;
  });
});
