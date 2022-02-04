import React, { useCallback } from 'react';
import propTypes from 'prop-types';
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
  const loadingMessage = useCallback(() => {
    return (
      <>
        <va-loading-indicator
          data-testid="loading-message"
          message="Saving your responses..."
        />
      </>
    );
  }, []);
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
        LoadingMessage={loadingMessage}
        Footer={Footer}
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  Footer: propTypes.elementType,
  header: propTypes.string,
  isSendingData: propTypes.bool,
  nextOfKin: propTypes.object,
  noAction: propTypes.func,
  subtitle: propTypes.string,
  yesAction: propTypes.func,
};
