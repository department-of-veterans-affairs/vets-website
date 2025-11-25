import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const mailMessage = (
  <>
    <p>
      Please upload your documents online here to help us process your claim
      quickly.
    </p>
    <p>If you can’t upload documents:</p>
    <ol className="vads-u-padding-bottom--1">
      <li>Make copies of the documents.</li>
      <li>Make sure you write your name and claim number on every page.</li>
      <li>
        <VaLink
          external
          href="http://www.benefits.va.gov/COMPENSATION/mailingaddresses.asp"
          text="Mail them to the VA Claims Intake Center"
        />
        .
      </li>
    </ol>
  </>
);

export default mailMessage;
