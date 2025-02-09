import { expect } from 'chai';
import { render } from '@testing-library/react';
import { PhoneNumberReviewWidget } from '../../utils/PhoneNumberReviewWidget';

describe('Utils - PhoneNumberReviewWidget', () => {
  it('should render the widget', () => {
    const screen = render(PhoneNumberReviewWidget({ value: '1112223333' }));

    const phoneNumber = screen.getByTestId('phone-number-review');
    expect(phoneNumber.innerHTML).to.contain('(111) 222-3333');

    screen.unmount();
  });

  it('should render numbers with dashes properly', () => {
    const screen = render(PhoneNumberReviewWidget({ value: '123-456-7890' }));

    const phoneNumber = screen.getByTestId('phone-number-review');
    expect(phoneNumber.innerHTML).to.contain('(123) 456-7890');

    screen.unmount();
  });

  it('should handle empty strings (no input)', () => {
    const screen = render(PhoneNumberReviewWidget({ value: '' }));

    const blankNumber = screen.getByTestId('phone-number-review');
    expect(blankNumber.innerHTML).to.contain('');

    screen.unmount();
  });
});
