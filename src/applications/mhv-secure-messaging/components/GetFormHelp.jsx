import React from 'react';
import { smFooter } from '../util/constants';

const GetFormHelp = () => {
  return (
    <div>
      <h2 className="vads-u-font-size--lg">Need help?</h2>
      <div className="vads-u-border-top--2px vads-u-border-color--primary">
        <p>
          If you want to send messages to a team that’s not listed here, contact
          your VA health facility.
        </p>
        <p>
          Ask to speak to the My HealtheVet coordinator or secure messaging
          administrator. They may be able to add the team for you.
        </p>
        <p>
          <a
            href="/find-locations"
            target="_blank"
            data-dd-action-name={`${smFooter.FIND_FACILITY}`}
          >
            Find your VA health facility
          </a>
        </p>
      </div>
    </div>
  );
};

export default GetFormHelp;
