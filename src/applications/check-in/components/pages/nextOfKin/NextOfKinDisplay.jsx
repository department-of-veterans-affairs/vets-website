import React from 'react';
import DemographicItem from '../../DemographicItem';

export default function NextOfKinDisplay({
  header = 'Is this your current next of kin information?',
  subtitle = '',
  nextOfKin = [],
  yesAction = () => {},
  noAction = () => {},
  Footer,
}) {
  const nextOfKinFields = [
    { title: 'Name', key: 'name' },
    { title: 'Relationship', key: 'relationship' },
    { title: 'Address', key: 'address' },
    { title: 'Phone', key: 'phone' },
    { title: 'Work phone', key: 'workPhone' },
  ];
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 check-in-next-of-kin">
      <h1>{header}</h1>
      {subtitle && <p className="vads-u-font-family--serif">{subtitle}</p>}
      <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
        <dl>
          {nextOfKinFields.map(nextOfKinField => (
            <React.Fragment key={nextOfKinField.key}>
              <dt className="vads-u-font-size--h3 vads-u-font-family--serif">
                {nextOfKinField.title}
              </dt>
              <dd>
                {nextOfKinField.key in nextOfKin &&
                nextOfKin[nextOfKinField.key] ? (
                  <DemographicItem
                    demographic={nextOfKin[nextOfKinField.key]}
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
