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

  it('renders the date picker and button correctly', () => {
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

  it('calls triggerApiUpdate when the button is clicked', () => {
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

  it('disables the button when isLoadingAcceleratedData is true', () => {
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
});
