import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { PDFErrorAlert } from './VeteranStatusAlerts';

const FrequentlyAskedQuestions = ({ createPdf, pdfError = false }) => (
  <>
    <h2 className="vads-u-margin-top--2">Frequently asked questions</h2>
    <va-accordion>
      <va-accordion-item
        level={3}
        header="What if my Veteran Status Card displays incorrect information?"
      >
        <p>
          To fix an error in your disability rating, call us at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
        <p>
          To correct your service history information, call the Defense Manpower
          Data Center at <va-telephone contact={CONTACTS.DS_LOGON} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ).
        </p>
      </va-accordion-item>
      <va-accordion-item
        level={3}
        header="How can I use the Veteran Status Card?"
      >
        <p>
          This card is for identification only and doesn’t entitle you to any VA
          benefits.
        </p>
        <p>
          You can use this card to prove your Veteran status to businesses and
          organizations offering discounts. Acceptance may vary, so check with
          specific entities in advance. Additional documentation may be
          required.
        </p>
      </va-accordion-item>
      {createPdf && (
        <va-accordion-item
          level={3}
          header="How do I get a physical version of my Veteran Status Card?"
        >
          <p>
            You can print a copy of your Veteran Status Card and cut it out to
            keep in your wallet.
          </p>
          <va-link
            filetype="PDF"
            // exception to eslint: the url is a dynamically generated blob url
            // eslint-disable-next-line no-script-url
            href="javascript:void(0)"
            text="Print your Veteran Status Card (PDF)"
            onClick={createPdf}
          />
          {pdfError && (
            <div className="vads-u-margin-top--4">
              <PDFErrorAlert />
            </div>
          )}
          <p>
            <strong>Note:</strong> The Veteran Status Card is for identification
            only and doesn’t guarantee benefits. Additional documentation may be
            required. You may be unable to print your Veteran Status Card if
            you’re ineligible, if there are issues with your records, or if a
            system error occurs.
          </p>
        </va-accordion-item>
      )}
      <va-accordion-item
        level={3}
        header="What other types of Veteran ID are available?"
      >
        <p>
          Other options include the Veteran Health Identification Card (VHIC),
          Department of Defense (DoD) ID Card, and Veteran designation on
          state-issued IDs or driver’s licenses.
        </p>
        <va-link
          href="/records/get-veteran-id-cards/"
          text="Learn about other types of Veteran ID cards"
        />
      </va-accordion-item>
    </va-accordion>
  </>
);

FrequentlyAskedQuestions.propTypes = {
  createPdf: PropTypes.func,
  pdfError: PropTypes.bool,
};

export default FrequentlyAskedQuestions;
