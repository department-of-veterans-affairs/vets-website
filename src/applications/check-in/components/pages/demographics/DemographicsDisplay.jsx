import React from 'react';
import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function DemographicsDisplay({
  header = 'Is this your current contact information?',
  subtitle = 'We can better follow up with you after your appointment when we have your current information.',
  demographics = {},
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
    <>
      <ConfirmablePage
        header={header}
        subtitle={subtitle}
        dataFields={demographicFields}
        data={demographics}
        yesAction={yesAction}
        noAction={noAction}
        Footer={Footer}
      />
    </>
  );
}

DemographicsDisplay.propTypes = {
  Footer: PropTypes.elementType,
  demographics: PropTypes.object,
  header: PropTypes.string,
  noAction: PropTypes.func,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
};
