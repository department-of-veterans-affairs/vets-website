import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import DatePicker from '../../../components/shared/DatePicker';

describe('DatePicker', () => {
  let mockUpdateDate;
  let mockTriggerApiUpdate;

  beforeEach(() => {
    mockUpdateDate = sinon.spy();
    mockTriggerApiUpdate = sinon.spy();
  });

  it('renders the date picker and button correctly (month/year mode)', () => {
    const screen = render(
      <DatePicker
        dateValue="2025-04"
        updateDate={mockUpdateDate}
        triggerApiUpdate={mockTriggerApiUpdate}
        isLoadingAcceleratedData={false}
      />,
    );

    expect(screen.getByTestId('date-picker')).to.exist;
    expect(screen.getByTestId('update-time-frame-button')).to.exist;
  });

  it('calls triggerApiUpdate when the button is clicked (month/year mode)', () => {
    const screen = render(
      <DatePicker
        dateValue="2025-04"
        updateDate={mockUpdateDate}
        triggerApiUpdate={mockTriggerApiUpdate}
        isLoadingAcceleratedData={false}
      />,
    );

    const button = screen.getByTestId('update-time-frame-button');
    fireEvent.click(button);

    sinon.assert.calledOnce(mockTriggerApiUpdate);
  });

  it('disables the button when isLoadingAcceleratedData is true (month/year mode)', () => {
    const screen = render(
      <DatePicker
        dateValue="2025-04"
        updateDate={mockUpdateDate}
        triggerApiUpdate={mockTriggerApiUpdate}
        isLoadingAcceleratedData
      />,
    );

    const button = screen.getByTestId('update-time-frame-button');
    expect(button).to.have.attribute('disabled', 'true');
  });

  it('renders year only input when yearOnly is true', () => {
    const screen = render(
      <DatePicker
        dateValue="2025"
        updateDate={mockUpdateDate}
        triggerApiUpdate={mockTriggerApiUpdate}
        isLoadingAcceleratedData={false}
        yearOnly
      />,
    );

    expect(screen.getByTestId('year-only-input')).to.exist;
  });

  it('calls updateDate with fabricated YYYY-01 value in yearOnly mode', () => {
    const screen = render(
      <DatePicker
        dateValue="2025"
        updateDate={mockUpdateDate}
        triggerApiUpdate={mockTriggerApiUpdate}
        isLoadingAcceleratedData={false}
        yearOnly
      />,
    );

    const input = screen.getByTestId('year-only-input');
    fireEvent.input(input, { target: { value: '2024' } });

    sinon.assert.calledOnce(mockUpdateDate);
    const arg = mockUpdateDate.firstCall.args[0];
    expect(arg.target.value).to.equal('2024-01');
  });
});
