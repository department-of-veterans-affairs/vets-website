import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CustomDateFields from './CustomDateFields';

describe('CustomDateFields', () => {
  it('should correctly render the component when there are no errors', () => {
    const props = {
      anyDateErrorsExist: false,
      endDateFull: '2023-05-02',
      fullDateError: false,
      setEndDateFull: () => {},
      setStartDateFull: () => {},
      startDateFull: '2023-05-01',
    };

    const screen = render(<CustomDateFields {...props} />);

    expect(screen.findByTestId('form-left-error-bar')).to.be.empty;
    expect(screen.findByTestId('va-c-range-error-message')).to.be.empty;
    expect(screen.getByTestId('events-start-date')).to.exist;
    expect(screen.getByTestId('events-end-date')).to.exist;
  });

  it('should correctly render the component when there are any date errors', () => {
    const props = {
      anyDateErrorsExist: true,
      endDateFull: '2023-05-02',
      fullDateError: false,
      setEndDateFull: () => {},
      setStartDateFull: () => {},
      startDateFull: '2023-05-01',
    };

    const screen = render(<CustomDateFields {...props} />);

    expect(screen.getByTestId('form-left-error-bar')).to.exist;
    expect(screen.findByTestId('va-c-range-error-message')).to.be.empty;
    expect(screen.getByTestId('events-start-date')).to.exist;
    expect(screen.getByTestId('events-end-date')).to.exist;
  });

  it('should correctly render the component when there is a full date error', () => {
    const props = {
      anyDateErrorsExist: true,
      endDateFull: '2023-05-02',
      fullDateError: true,
      setEndDateFull: () => {},
      setStartDateFull: () => {},
      startDateFull: '2023-05-01',
    };

    const screen = render(<CustomDateFields {...props} />);

    expect(screen.getByTestId('form-left-error-bar')).to.exist;
    expect(screen.getByTestId('va-c-range-error-message')).to.exist;
    expect(screen.getByTestId('events-start-date')).to.exist;
    expect(screen.getByTestId('events-end-date')).to.exist;
  });
});
