import React from 'react';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NewTabAnchor from './NewTabAnchor';

export default function NeedHelp() {
  return (
    <div className="vads-u-margin-top--9 vads-u-margin-bottom--3">
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Need help?
      </h2>
      <hr
        aria-hidden="true"
        className="vads-u-margin-y--1p5 vads-u-border-color--primary"
      />
      <p className="vads-u-margin-top--0">
        If you need help scheduling an appointment, please call your VA or
        community care health facility.{' '}
        <NewTabAnchor href="/find-locations">
          Find your health facility’s phone number.
        </NewTabAnchor>
      </p>
      <p className="vads-u-margin-top--0">
        To report a technical issue with the VA appointments tool, or if you
        have a question about using the tool, please call{' '}
        <VaTelephone
          contact="8774705947"
          data-testid="technical-issue-telephone"
        />{' '}
        (<VaTelephone contact="711" tty data-testid="tty-telephone" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p className="vads-u-margin-top--0">
        For questions about joining a VA Video Connect appointment, please call{' '}
        <VaTelephone
          contact="8666513180"
          data-testid="video-question-telephone"
        />{' '}
        (<VaTelephone contact="711" tty />
        ). We’re here 24/7.
      </p>
      <p className="vads-u-margin-top--0">
        <NewTabAnchor href="https://veteran.apps.va.gov/feedback-web/v1/?appId=85870ADC-CC55-405E-9AC3-976A92BBBBEE">
          Leave feedback about this application
        </NewTabAnchor>
      </p>
    </div>
  );
}
