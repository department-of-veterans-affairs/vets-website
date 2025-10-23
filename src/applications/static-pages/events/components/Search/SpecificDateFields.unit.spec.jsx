import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SpecificDateFields from './SpecificDateFields';

describe('SpecificDateFields', () => {
  it('should correctly render the component when there are no errors', () => {
    const props = {
      setStartDateFull: () => {},
      startDateDayError: false,
      startDateFull: '2023-05-02',
      startDateMonthError: false,
      startDateYearError: false,
    };

    const screen = render(<SpecificDateFields {...props} />);

    expect(screen.findByTestId('form-left-error-bar')).to.be.empty;
    expect(screen.getByTestId('events-start-date-specific')).to.exist;
  });

  it('should correctly render the component when there are any date errors', () => {
    const props = {
      setStartDateFull: () => {},
      startDateDayError: true,
      startDateFull: '2023-05-02',
      startDateMonthError: false,
      startDateYearError: false,
    };

    const screen = render(<SpecificDateFields {...props} />);

    expect(screen.findByTestId('form-left-error-bar')).to.exist;
    expect(screen.getByTestId('events-start-date-specific')).to.exist;
  });

  it('should correctly render the component when there are any date errors', () => {
    const props = {
      setStartDateFull: () => {},
      startDateDayError: false,
      startDateFull: '2023-05-02',
      startDateMonthError: true,
      startDateYearError: false,
    };

    const screen = render(<SpecificDateFields {...props} />);

    expect(screen.findByTestId('form-left-error-bar')).to.exist;
    expect(screen.getByTestId('events-start-date-specific')).to.exist;
  });

  it('should correctly render the component when there are any date errors', () => {
    const props = {
      setStartDateFull: () => {},
      startDateDayError: false,
      startDateFull: '2023-05-02',
      startDateMonthError: false,
      startDateYearError: true,
    };

    const screen = render(<SpecificDateFields {...props} />);

    expect(screen.findByTestId('form-left-error-bar')).to.exist;
    expect(screen.getByTestId('events-start-date-specific')).to.exist;
  });
});
