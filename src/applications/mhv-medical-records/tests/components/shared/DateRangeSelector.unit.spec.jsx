import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import DateRangeSelector, {
  getDateRangeList,
} from '../../../components/shared/DateRangeSelector';

describe('DateRangeSelector (shared)', () => {
  it('renders with label and includes base options', () => {
    const { getByTestId } = render(
      <DateRangeSelector selectedDate="3" onDateRangeSelect={() => {}} />,
    );
    const select = getByTestId('date-range-selector');
    expect(select.getAttribute('label')).to.equal('Date range');
    const optionTexts = Array.from(select.querySelectorAll('option')).map(
      o => o.textContent,
    );
    expect(optionTexts).to.include('Last 3 months');
    expect(optionTexts).to.include('Last 6 months');
    expect(optionTexts).to.include(`All of ${new Date().getFullYear()}`);
    expect(optionTexts).to.include('All of 2013'); // earliest year boundary
  });

  it('fires handler with selected value detail on vaSelect', () => {
    const handler = sinon.spy();
    const { getByTestId } = render(
      <DateRangeSelector selectedDate="3" onDateRangeSelect={handler} />,
    );
    getByTestId('date-range-selector').dispatchEvent(
      new CustomEvent('vaSelect', { detail: { value: '6' }, bubbles: true }),
    );
    expect(handler.calledOnce).to.be.true;
    expect(handler.firstCall.args[0].detail.value).to.equal('6');
  });

  it('toggles inert only when loading', () => {
    const { getByTestId, rerender } = render(
      <DateRangeSelector
        selectedDate="3"
        onDateRangeSelect={() => {}}
        isLoading
      />,
    );
    expect(getByTestId('date-range-selector').hasAttribute('inert')).to.be.true;
    rerender(
      <DateRangeSelector selectedDate="3" onDateRangeSelect={() => {}} />,
    );
    expect(getByTestId('date-range-selector').hasAttribute('inert')).to.be
      .false;
  });

  it('accepts custom dateOptions overriding defaults', () => {
    const custom = [
      { value: 'X', label: 'Custom Option X' },
      { value: 'Y', label: 'Custom Option Y' },
    ];
    const { getByTestId } = render(
      <DateRangeSelector
        selectedDate="X"
        onDateRangeSelect={() => {}}
        dateOptions={custom}
      />,
    );
    const optionTexts = Array.from(
      getByTestId('date-range-selector').querySelectorAll('option'),
    ).map(o => o.textContent);
    expect(optionTexts).to.deep.equal(['Custom Option X', 'Custom Option Y']);
  });

  it('getDateRangeList exposes expected base values', () => {
    const values = getDateRangeList().map(o => o.value);
    expect(values).to.include('3');
    expect(values).to.include('6');
    expect(values).to.include(String(new Date().getFullYear()));
  });
});
