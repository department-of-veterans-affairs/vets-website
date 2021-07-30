import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import environment from 'platform/utilities/environment';

function GetFormHelp() {
  return environment.isProduction() ? (
    <div>
      <p className="help-talk">
        Need help enrolling or have questions about enrollment or eligibility?
        Call our toll-free number:
      </p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:1-877-222-8387">
          877-222-8387
        </a>
        <br />
        TTY:{' '}
        <Telephone
          className="help-phone-number-link"
          contact={CONTACTS.HELP_TTY}
        />
        <br />
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. ET
      </p>
    </div>
  ) : (
    <div>
      <p className="help-talk">
        <strong> If you have trouble using this online application,</strong>{' '}
        call our MyVA411 main information line at{' '}
        <a href="tel:+18006982411">800-698-2411</a> (TTY:{' '}
        <Telephone
          contact={CONTACTS['711']}
          pattern={'###'}
          ariaLabel={'7 1 1.'}
        />
        ). We’re here 24/7.
      </p>
      <p>
        <strong>
          If you need help to gather your information or fill out your
          application/form,{' '}
        </strong>
        <a href="/vso/">contact a local Veterans Service Organization (VSO).</a>
      </p>
      <p className="help-talk">
        <strong>If you have questions about VA health care, </strong>
        call our Health Resource Center at{' '}
        <a href="tel:+18772228387">877-222-8387</a> (TTY:{' '}
        <Telephone
          contact={CONTACTS['711']}
          pattern={'###'}
          ariaLabel={'7 1 1.'}
        />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  );
}

export default GetFormHelp;
