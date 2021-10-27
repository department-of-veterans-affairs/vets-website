import React from 'react';
import PropTypes from 'prop-types';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const BalanceQuestions = ({ facilityLocation, facilityPhone }) => (
  <article className="vads-u-padding--0">
    <h2 id="balance-questions">
      What to do if you have questions about your balance
    </h2>
    <h3>Questions about your payment or relief options</h3>
    <p>
      Contact the VA Health Resource Center at
      <Telephone contact={'866-400-1238'} className="vads-u-margin-x--0p5" />
      (TTY:
      <Telephone
        contact={CONTACTS[711]}
        pattern={PATTERNS['3_DIGIT']}
        className="vads-u-margin-left--0p5"
      />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
    <h3>Questions about your treatment or your charges</h3>
    <p>
      {facilityLocation && facilityPhone ? (
        <span>
          Contact the {facilityLocation} at
          <Telephone
            contact={facilityPhone}
            className="vads-u-margin-left--0p5"
          />
          .
        </span>
      ) : (
        <span>Contact the VA health care facility listed on your bill.</span>
      )}
    </p>
  </article>
);

BalanceQuestions.propTypes = {
  facilityLocation: PropTypes.string,
  facilityPhone: PropTypes.string,
};

export default BalanceQuestions;
