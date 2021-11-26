import React from 'react';
import DemographicItem from '../DemographicItem';

export default function DemographicsDisplay({
  header = 'Is this your current contact information?',
  subtitle = 'We can better follow up with you after your appointment when we have your current information.',
  demographics = [],
  yesAction = () => {},
  noAction = () => {},
  Footer,
}) {
  const demographicFields = [
    { title: 'Mailing address', key: 'mailingAddress' },
    { title: 'Home address', key: 'homeAddress' },
    { title: 'Home phone', key: 'homePhone' },
    { title: 'Mobile phone', key: 'mobilePhone' },
    { title: 'Work phone', key: 'workPhone' },
    { title: 'Email address', key: 'emailAddress' },
  ];
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 check-in-demographics">
      <h1>{header}</h1>
      <p className="vads-u-font-family--serif">{subtitle}</p>
      <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
        <dl data-testid="demographics-fields">
          {demographicFields.map(demographicField => (
            <React.Fragment key={demographicField.key}>
              <dt className="vads-u-font-size--h3 vads-u-font-family--serif">
                {demographicField.title}
              </dt>
              <dd>
                {demographicField.key in demographics &&
                demographics[demographicField.key] ? (
                  <DemographicItem
                    demographic={demographics[demographicField.key]}
                  />
                ) : (
                  'Not available'
                )}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
      <button
        onClick={yesAction}
        className={'usa-button-secondary'}
        data-testid="yes-button"
      >
        Yes
      </button>
      <button
        onClick={noAction}
        className="usa-button-secondary vads-u-margin-top--2"
        data-testid="no-button"
      >
        No
      </button>
      <Footer />
    </div>
  );
}
