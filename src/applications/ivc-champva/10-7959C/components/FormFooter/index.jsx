import React from 'react';
import { CONTACTS } from '../../utils/imports';

const GetFormHelp = (
  <>
    <p className="help-talk">
      <strong>If you have trouble using this online form,</strong> call us at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
    <p className="help-talk">
      <strong>
        If you need help gathering your information or filling out your form,
      </strong>{' '}
      you can appoint a VA accredited representative.{' '}
      <va-link
        href="/get-help-from-accredited-representative/"
        text="Get help filling out a form"
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
