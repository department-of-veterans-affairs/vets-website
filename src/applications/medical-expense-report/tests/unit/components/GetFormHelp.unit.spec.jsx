import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import GetFormHelp from '../../../components/GetFormHelp';

describe('GetFormHelp', () => {
  it('should render without crashing', () => {
    const { container } = render(<GetFormHelp />);
    expect(container).to.exist;
  });

  it('should have the correct CSS class', () => {
    const { container } = render(<GetFormHelp />);

    const paragraph = container.querySelector('p');
    expect(paragraph).to.exist;
    expect(paragraph.className).to.include('help-talk');
  });

  it('should contain phone contact information', () => {
    const { container } = render(<GetFormHelp />);

    const vaTelephone = container.querySelector('va-telephone[contact]');

    expect(vaTelephone).to.exist;
    expect(container.textContent).to.include('Call us at');
    expect(container.textContent).to.include('Monday through Friday');
    expect(container.textContent).to.include('8:00 a.m to 9:00 p.m ET');
  });

  it('should contain TTY information', () => {
    const { container } = render(<GetFormHelp />);

    expect(container.textContent).to.include('hearing loss');

    // Check for TTY telephone component
    const ttyPhone = container.querySelector('va-telephone[tty]');
    expect(ttyPhone).to.exist;
  });
});
