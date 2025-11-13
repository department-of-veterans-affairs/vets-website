import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import DateRangeSelector, {
  dateRangeList,
} from '../../../components/shared/DateRangeSelector';

describe('DateRangeSelector', () => {
  it('renders the select with default options', () => {
    const onSelectSpy = sinon.spy();
    const screen = render(
      <DateRangeSelector selectedDate="3" onDateRangeSelect={onSelectSpy} />,
    );

    const select = screen.getByTestId('date-range-selector');
    expect(select).to.exist;

    // Check required default options
    const opt3 = screen.getByRole('option', { name: /Last 3 months/i });
    const opt6 = screen.getByRole('option', { name: /Last 6 months/i });
    expect(opt3).to.exist;
    expect(opt6).to.exist;

    // Current year option should be present
    const currentYear = new Date().getFullYear().toString();
    const yearOption = screen.getByRole('option', { name: currentYear });
    expect(yearOption).to.exist;

    // Selected value attribute
    expect(select.getAttribute('value')).to.equal('3');
  });

  it('fires onDateRangeSelect with correct detail value', () => {
    const onSelectSpy = sinon.spy();
    const screen = render(
      <DateRangeSelector selectedDate="3" onDateRangeSelect={onSelectSpy} />,
    );

    const select = screen.getByTestId('date-range-selector');

    // Dispatch custom vaSelect event (web component pattern)
    const event = new CustomEvent('vaSelect', {
      detail: { value: '6' },
      bubbles: true,
    });
    select.dispatchEvent(event);

    expect(onSelectSpy.calledOnce).to.be.true;
    expect(onSelectSpy.firstCall.args[0].detail.value).to.equal('6');
  });

  it('supports custom dateOptions prop', () => {
    const customOptions = [
      { value: 'alpha', label: 'Alpha' },
      { value: 'beta', label: 'Beta' },
    ];
    const onSelectSpy = sinon.spy();
    const screen = render(
      <DateRangeSelector
        dateOptions={customOptions}
        selectedDate="alpha"
        onDateRangeSelect={onSelectSpy}
      />,
    );

    expect(screen.getByRole('option', { name: 'Alpha' })).to.exist;
    expect(screen.getByRole('option', { name: 'Beta' })).to.exist;
    // Should not render a default option like "Last 3 months"
    expect(screen.queryByRole('option', { name: /Last 3 months/i })).to.be.null;
  });

  it('exports dateRangeList with at least the 3 & 6 month options', () => {
    const values = dateRangeList.map(o => o.value);
    expect(values).to.include('3');
    expect(values).to.include('6');
  });
});
