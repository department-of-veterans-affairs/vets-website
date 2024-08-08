import React from 'react';

// TODO: Add email addresses
const questions = [
  {
    text: 'Would you like to join the pilot?',
    email: 'addAnEmail@va.gov',
    linkText: 'Contact add org here',
  },
  {
    text: 'Do you need help with SEP and other VA digital tools?',
    email: 'addAnEmail@va.gov',
    linkText: 'Contact add org here',
  },
  {
    text: 'Do you have questions about the accreditation process?',
    email: 'ogcaccreditationmailbox@va.gov',
    linkText: 'Contact OGC',
  },
];

const NotInPilotAlert = () => (
  <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
    <div className="vads-l-row">
      <va-alert
        class="arp-full-width-alert"
        data-testid="not-in-pilot-alert"
        status="info"
        visible
      >
        <h2 data-testid="not-in-pilot-alert-heading" slot="headline">
          Accredited Representative Portal is currently in pilot
        </h2>
        <div>
          <ul data-testid="not-in-pilot-alert-description">
            {questions.map((question, index) => (
              <li key={index}>
                <span className="arp-full-width-alert__questions">
                  {question.text}{' '}
                </span>
                <a href={`mailto:${question.email}`}>{question.linkText}</a>
              </li>
            ))}
          </ul>
        </div>
      </va-alert>
    </div>
  </div>
);

export default NotInPilotAlert;
