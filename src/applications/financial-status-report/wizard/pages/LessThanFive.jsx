import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import ContactDMC from '../components/Contacts';

const LessThanFive = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert':
        'no submission needed to request an extended monthly payment plan of up to 5 years',
    });
  }, []);

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p>
        <strong>
          We’ve changed our process for extended monthly payment plans as part
          of COVID-19 debt relief.
        </strong>
      </p>
      <p>
        You don't need to submit a Financial Status Report (VA Form 5655) to
        request an extended monthly payment plan of up to 5 years. During this
        time, you can request a plan online, by phone, or by mail.
      </p>
      <ul>
        <li>
          <strong>Online: </strong>
          <a
            href="https://iris.custhelp.va.gov/app/ask"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Go to our online question form (called IRIS)',
              });
            }}
          >
            Go to our online question form (called IRIS)
          </a>
          . On the IRIS page, select <strong>Debt Management Center</strong>,
          your debt type, and <strong>Payment Plan</strong> within the Topic
          dropdown. For Inquiry Type, select <strong>Question</strong>. Write
          your request within the <strong>Question</strong> section.
        </li>
        <li>
          <strong>Phone: </strong>
          <ContactDMC />
        </li>
        <li>
          <strong>Mail: </strong>
          <div>Debt Management Center</div>
          <div>P.O. Box 11930</div>
          <div>St. Paul, MN 55111-0930</div>
        </li>
      </ul>
    </div>
  );
};

export default {
  name: PAGE_NAMES.lessThan,
  component: LessThanFive,
};
