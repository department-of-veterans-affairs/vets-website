import React from 'react';
import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function NextOfKinDisplay({
  header = 'Is this your current next of kin information?',
  subtitle = '',
  nextOfKin = {},
  yesAction = () => {},
  noAction = () => {},
  isSendingData = false,
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
    <>
      <ConfirmablePage
        header={header}
        subtitle={subtitle}
        dataFields={nextOfKinFields}
        data={nextOfKin}
        yesAction={yesAction}
        noAction={noAction}
        isLoading={isSendingData}
        LoadingMessage={() => {
          return (
            <>
              <va-loading-indicator
                data-testid="loading-message"
                message="Saving your responses..."
              />
            </>
          );
        }}
        Footer={Footer}
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  header: PropTypes.string,
  isSendingData: PropTypes.bool,
  nextOfKin: PropTypes.object,
  noAction: PropTypes.func,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
  Footer: PropTypes.node,
};
