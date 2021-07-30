import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const GetHelp = () => {
  return (
    <div>
      <h2>What if I have questions about my balance?</h2>
      <p>
        <strong className="vads-u-margin-x--0p5">
          For questions about your payment or relief options,
        </strong>
        contact the VA Health Resource Center at
        <Telephone contact={'800-698-2411'} className="vads-u-margin-x--0p5" />
        (TTY:
        <Telephone
          contact={CONTACTS[711]}
          pattern={PATTERNS['3_DIGIT']}
          className="vads-u-margin-left--0p5"
        />
        ). We’re here Monday through Friday, 8:00 a.m. t 8:00 p.m. ET.
      </p>
      <p>
        <strong>For questions about your treatment or your charges, </strong>
        contact the VA health care facility listed on your bill.
      </p>
      <h3>Contact information for your VA health care facilities</h3>
      <dl>
        <dt>
          <h4>James A. Haley Veterans’ Hospital</h4>
        </dt>
        <dd>
          <strong>Main number:</strong> <Telephone contact={'813-972-2000'} />
        </dd>
        <dt>
          <h4>San Diego VA Medical Center</h4>
        </dt>
        <dd>
          <strong>Main number:</strong> <Telephone contact={'858-552-8585'} />
        </dd>
        <dt>
          <h4>Philadelphia VA Medical Center</h4>
        </dt>
        <dd>
          <strong>Main number:</strong> <Telephone contact={'215-823-5800'} />
        </dd>
      </dl>
    </div>
  );
};

export default GetHelp;
