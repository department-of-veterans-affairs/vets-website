import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetFormHelp = () => {
  return (
    <div>
      <p>
        If you have trouble using this online form, call our MyVA411 main
        information line at <Telephone contact={'800-698-2411'} /> (TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />)
      </p>
      <p>
        If you need help to gather your information or fill out your form,{' '}
        <a href="https://www.va.gov/vso/">
          contact a local Veterans Service Organization (VSO).
        </a>
      </p>
      <p>
        If you have questions about your VA debt, call our Debt Management
        Center at{' '}
        <span>
          {<Telephone contact={CONTACTS.DMC || '800-827-0648'} />} (or{' '}
          {
            <Telephone
              contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
              pattern={PATTERNS.OUTSIDE_US}
            />
          }{' '}
          from overseas).
        </span>{' '}
        We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
    </div>
  );
};

export default GetFormHelp;
