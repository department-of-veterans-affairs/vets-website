import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import GetFormHelp from '../../../components/GetFormHelp';

describe('Survivors Benefits <GetFormHelp />', () => {
  it('renders a paragraph with help-talk class and schedule text', () => {
    const { container } = render(<GetFormHelp />);
    const p = container.querySelector('p.help-talk');
    expect(p).to.exist;
    expect(p.textContent).to.include('Call us at');
    expect(p.textContent).to.include(
      'Monday through Friday, 8:00 a.m to 9:00 p.m ET',
    );
    expect(p.textContent).to.include('If you have hearing loss');
  });

  it('renders two va-telephone elements with correct attributes', () => {
    const { container } = render(<GetFormHelp />);
    const phones = container.querySelectorAll('va-telephone');
    expect(phones.length).to.equal(2);
    const benefitsPhone = phones[0];
    const ttyPhone = phones[1];
    expect(benefitsPhone.getAttribute('contact')).to.equal(
      CONTACTS.VA_BENEFITS,
    );
    expect(ttyPhone.getAttribute('contact')).to.equal(CONTACTS['711']);
    expect(ttyPhone.hasAttribute('tty')).to.be.true;
  });
});
