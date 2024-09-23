import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { LoginButton } from '~/platform/user/exportsFile';
import AccountSwitch from '../components/AccountSwitch';
import { maskEmail } from '../helpers';

describe('AccountSwitch', () => {
  const mockEmail = 'test@example.com';
  const maskedEmail = 't***@example.com';

  it('should display Login.gov when hasLogingov is true', () => {
    render(<AccountSwitch hasLogingov userEmail={mockEmail} />);
    expect(screen.getByText(/Switch to your/)).toHaveTextContent(
      'Switch to your Login.gov account now',
    );
    expect(screen.getByText(/We found an existing/)).toHaveTextContent(
      'We found an existing Login.gov account for you associated with this email:',
    );
  });
  it('should display ID.me when hasLogingov is false', () => {
    render(<AccountSwitch hasLogingov={false} userEmail={mockEmail} />);
    expect(screen.getByText(/Switch to your/)).toHaveTextContent(
      'Switch to your ID.me account now',
    );
    expect(screen.getByText(/We found an existing/)).toHaveTextContent(
      'We found an existing ID.me account for you associated with this email:',
    );
  });
  it('should display the masked email', () => {
    render(<AccountSwitch hasLogingov userEmail={mockEmail} />);
    expect(maskEmail).toHaveBeenCalledWith(mockEmail);
    expect(screen.getByText(maskedEmail)).toBeInTheDocument();
  });
  it('should pass the correct csp prop to LoginButton when hasLogingov is true', () => {
    render(<AccountSwitch hasLogingov userEmail={mockEmail} />);
    expect(LoginButton).toHaveBeenCalledWith({ csp: 'logingov' }, {});
  });
  it('should pass the correct csp prop to LoginButton when hasLogingov is false', () => {
    render(<AccountSwitch hasLogingov={false} userEmail={mockEmail} />);
    expect(LoginButton).toHaveBeenCalledWith({ csp: 'idme' }, {});
  });
});
