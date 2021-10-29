import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function AskVAQuestions() {
  return (
    <div>
      <h2 className="help-heading">Need help?</h2>
      <p>Call Veterans Affairs Benefits and Services:</p>
      <p>
        <Telephone contact={CONTACTS.VA_BENEFITS} />
      </p>
      <p>Monday through Friday, 8:00 a.m. to 9:00 p.m. ET</p>
      <p>
        <a href="https://www.va.gov/contact-us/">
          Contact us online through Ask VA
        </a>
      </p>
    </div>
  );
}

export default AskVAQuestions;
