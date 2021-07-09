import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import ContactDMC from '../components/Contacts';
import DelayedLiveRegion from '../DelayedLiveRegion';

const Waivers = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert':
        'ask Committee of Waivers and Compromises to reconsider waiver',
    });
  }, []);

  return (
    <DelayedLiveRegion>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <h2
          className="vads-u-margin-top--0 vads-u-font-size--h6 vads-u-font-weight--normal vads-u-font-family--sans"
          id="wizard-results"
        >
          Based on the information you provided, this isn’t the form you need.
        </h2>
        <p>
          <strong className="vads-u-margin-x--0p5">
            To ask our Committee of Waivers and Compromises to reconsider your
            waiver,
          </strong>
          you’ll need to tell us why you think we should reconsider.
        </p>
        <p>You can submit your request online, by phone, or by mail.</p>
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
            your debt type, and <strong>Waiver</strong> within the Topic
            dropdown. For Inquiry Type, select <strong>Question</strong>. Write
            your request in the <strong>Question</strong> section.
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
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.waivers,
  component: Waivers,
};
