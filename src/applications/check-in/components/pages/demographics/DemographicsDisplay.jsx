import React from 'react';
import ConfirmablePage from '../ConfirmablePage';

export default function DemographicsDisplay({
  header = 'Is this your current contact information?',
  subtitle = 'We can better follow up with you after your appointment when we have your current information.',
  demographics = [],
  yesAction = () => {},
  noAction = () => {},
  Footer,
  isPreCheckIn = true,
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
    <>
      <ConfirmablePage
        header={header}
        subtitle={subtitle}
        dataFields={demographicFields}
        data={demographics}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
        isPreCheckIn={isPreCheckIn}
      />
    </>
  );
}
