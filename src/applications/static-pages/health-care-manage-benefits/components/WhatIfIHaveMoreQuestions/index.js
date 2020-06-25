// Node modules.
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const WhatIfIHaveMoreQuestions = ({ children, isCernerPatient }) => (
  <div itemScope itemType="http://schema.org/Question">
    <h2 itemProp="name" id="what-if-i-have-more-questions">
      What if I have more questions?
    </h2>
    <div
      itemProp="acceptedAnswer"
      itemScope
      itemType="http://schema.org/Answer"
    >
      <div itemProp="text">
        <div className="processed-content">
          {children}
          <p>
            Or contact the My HealtheVet help desk at{' '}
            <a href="tel:+18773270022">877-327-0022</a> (TTY:{' '}
            <a href="tel:+18008778339">800-877-8339</a>. We&apos;re here Monday
            through Friday, 7:00 a.m. to 7:00 p.m. CT.
          </p>
          <p>
            You can also{' '}
            <a
              href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
              target="_blank"
              rel="noopener noreferrer"
            >
              contact us online
            </a>
            .
          </p>

          {/* ONLY CERNER PATIENTS */}
          {isCernerPatient && (
            <p>
              <strong>
                If you have questions about appointment scheduling on My VA
                Health
              </strong>
              , you can call the My VA Health help desk at{' '}
              <a aria-label="1 8 0 0 9 6 2 1 0 2 4" href="tel:18009621024">
                1-800-962-1024
              </a>
              . You can also{' '}
              <a
                className="vads-u-color--secondary vads-u-text-decoration--none"
                href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
                target="_blank"
                rel="noopener noreferrer"
              >
                [contact us online]
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

WhatIfIHaveMoreQuestions.propTypes = {
  children: PropTypes.node,
  isCernerPatient: PropTypes.bool,
};

export default memo(WhatIfIHaveMoreQuestions);
