import React from 'react';
import { CONTACTS } from '../../imports';

const GetFormHelp = (
  <>
    <p>
      <strong> If you have trouble using this online form,</strong> call us at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
    <p>
      <strong>
        If you need help gathering your information or filling out this form,
      </strong>{' '}
      contact a local Veterans Service Organization (VSO).
    </p>
    <p className="vads-u-margin-bottom--4">
      <va-link href="/vso/" text="Find a local Veterans Service Organization" />
    </p>

    <h2 className="vads-u-font-size--h3">Get more information</h2>
    <hr className="vads-u-margin-y--0 vads-u-border-bottom--2px vads-u-border-top--0px vads-u-border-color--primary" />
    <p>
      <va-link
        href="/resources/getting-care-through-champva/#questions-about-champva-covera"
        text="Get answers to frequently asked questions about CHAMPVA"
      />
    </p>
    <p>
      <va-link
        href="/resources/getting-care-through-champva/"
        text="Find out if you can get care at a local VA medical center when you’re covered under CHAMPVA"
      />
    </p>
  </>
);

const FormFooter = () => (
  <div className="row vads-u-margin-y--4">
    <div className="usa-width-two-thirds medium-8 columns print-full-width">
      <va-need-help>
        <div slot="content">{GetFormHelp}</div>
      </va-need-help>
    </div>
  </div>
);

export default FormFooter;
