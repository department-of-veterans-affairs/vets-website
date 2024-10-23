import React from 'react';
import {
  EditAddress,
  EditEmail,
  EditMobilePhone,
} from 'platform/forms-system/src/js/components/EditContactInfo';
import { FormNavButtons } from 'platform/forms-system/exportsFile';

export const EditOtherContactInformation = props => {
  const { goBack, goForward } = props;
  return (
    <div>
      <EditMobilePhone />

      <EditEmail />

      <EditAddress />

      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};
