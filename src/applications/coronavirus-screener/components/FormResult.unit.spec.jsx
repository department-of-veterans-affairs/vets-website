import React from 'react';
import { render } from '@testing-library/react';
import FormResult from './FormResult';

describe('FormResult', () => {
  it('shows incomplete message', () => {
    const formState = {
      status: 'incomplete',
    };
    // unclear why screen variable has to be created instead of imported such as https://testing-library.com/docs/react-testing-library/example-intro#full-example
    const screen = render(<FormResult formState={formState} />);
    screen.getByText('Please answer all the questions above.');
  });
  it('shows pass message', () => {
    const formState = {
      status: 'pass',
    };
    const screen = render(<FormResult formState={formState} />);
    screen.getByText('OK to proceed');
  });
  it('shows more screening message', () => {
    const formState = {
      status: 'more-screening',
    };
    const screen = render(<FormResult formState={formState} />);
    screen.getByText('More screening needed');
  });
});
