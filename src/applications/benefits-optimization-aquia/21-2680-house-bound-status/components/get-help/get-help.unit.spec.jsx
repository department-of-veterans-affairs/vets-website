/**
 * @module tests/components/get-help.unit.spec
 * @description Unit tests for GetHelp component
 */

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { GetHelp } from './get-help';

describe('GetHelp Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<GetHelp />);
    expect(container).to.exist;
  });

  it('should display contact information', () => {
    const { container } = render(<GetHelp />);
    const text = container.textContent;
    expect(text).to.include('If you have trouble using this online form');
  });

  it('should include MyVA411 phone number', () => {
    const { container } = render(<GetHelp />);
    const phoneElement = container.querySelector('va-telephone');
    expect(phoneElement).to.exist;
    expect(phoneElement.getAttribute('contact')).to.equal('8006982411');
  });

  it('should include TTY phone number', () => {
    const { container } = render(<GetHelp />);
    const ttyElements = container.querySelectorAll('va-telephone[tty]');
    expect(ttyElements.length).to.be.greaterThan(0);
  });

  it('should display availability message', () => {
    const { container } = render(<GetHelp />);
    const text = container.textContent;
    expect(text).to.include('24/7');
  });

  it('should have appropriate paragraph spacing', () => {
    const { container } = render(<GetHelp />);
    const paragraph = container.querySelector('p.vads-u-margin-top--0');
    expect(paragraph).to.exist;
    expect(paragraph.classList.contains('vads-u-margin-bottom--2')).to.be.true;
  });
});
