import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import TimeoutAlertBox from '../../../components/shared/TimeoutAlertBox';

describe('TimeoutAlertBox', () => {
  it('renders a VaAlert with error status', () => {
    const screen = render(<TimeoutAlertBox />);
    const alert = screen.container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
  });

  it('displays the headline', () => {
    const screen = render(<TimeoutAlertBox />);
    const headline = screen.container.querySelector('h2[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent).to.include('load this page right now');
  });

  it('displays refresh instructions', () => {
    const screen = render(<TimeoutAlertBox />);
    const alert = screen.container.querySelector('va-alert');
    expect(alert.textContent).to.include(
      'Please refresh this page or try again later',
    );
  });

  it('displays the My HealtheVet phone number', () => {
    const screen = render(<TimeoutAlertBox />);
    const phone = screen.container.querySelector('va-telephone:not([tty])');
    expect(phone).to.exist;
    expect(phone.getAttribute('contact')).to.equal('8773270022');
  });

  it('displays the TTY number', () => {
    const screen = render(<TimeoutAlertBox />);
    const tty = screen.container.querySelector('va-telephone[tty]');
    expect(tty).to.exist;
    expect(tty.getAttribute('contact')).to.equal('711');
  });

  it('applies the testId as data-testid', () => {
    const screen = render(<TimeoutAlertBox testId="my-timeout-alert" />);
    expect(screen.getByTestId('my-timeout-alert')).to.exist;
  });

  it('applies an optional className', () => {
    const screen = render(<TimeoutAlertBox className="extra-class" />);
    const alert = screen.container.querySelector('va-alert');
    expect(alert.getAttribute('class')).to.include('extra-class');
  });

  it('renders without a className gracefully', () => {
    const screen = render(<TimeoutAlertBox />);
    const alert = screen.container.querySelector('va-alert');
    expect(alert.getAttribute('class')).to.include('vads-u-margin-y--4');
  });
});
