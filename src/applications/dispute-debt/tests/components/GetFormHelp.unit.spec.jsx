import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import GetFormHelp from '../../components/GetFormHelp';

describe('GetFormHelp Component', () => {
  it('renders without crashing', () => {
    expect(GetFormHelp).to.be.a('function');
  });

  it('renders help text content', () => {
    const { container } = render(<GetFormHelp />);

    expect(container.textContent).to.include(
      'If you have questions or need help filling out this form',
    );
    expect(container.textContent).to.include(
      'Monday through Friday, 8:00 a.m. to 9:00 p.m. ET',
    );
  });

  it('renders VA benefits phone number', () => {
    const { container } = render(<GetFormHelp />);

    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements.length).to.be.at.least(1);
  });

  it('renders TTY phone number for hearing loss', () => {
    const { container } = render(<GetFormHelp />);

    expect(container.textContent).to.include('If you have hearing loss');
    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements.length).to.be.at.least(2);
  });

  it('renders two paragraphs of help text', () => {
    const { container } = render(<GetFormHelp />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).to.have.length(2);
  });

  it('contains contact information for both regular and TTY users', () => {
    const { container } = render(<GetFormHelp />);

    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements).to.have.length(2);
  });
});
