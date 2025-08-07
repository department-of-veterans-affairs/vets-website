import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNotificationSettingsUtils } from '@@profile/hooks';
import { Document } from './Document';

export const Documents = () => {
  const { usePaperlessDeliveryGroup } = useNotificationSettingsUtils();
  const group = usePaperlessDeliveryGroup();
  const documents = group?.[0]?.items;

  if (!group?.length || !documents?.length) {
    return (
      <VaAlert status="info" visible>
        <h2 slot="headline">Paperless delivery not available yet</h2>
        <p>
          You’re not enrolled in any VA benefits that offer paperless delivery
          options.
        </p>
      </VaAlert>
    );
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--3 vads-u-margin-bottom--2">
        Documents available for paperless delivery
      </h2>
      <fieldset>
        <legend>
          <h3 className="vads-u-font-size--h5 vads-u-color--black vads-u-margin-top--0 vads-u-margin-bottom--0">
            Select the document you no longer want to get by mail. You can
            change this at any time.
          </h3>
        </legend>
        {documents.map(id => (
          <Document key={id} document={id} />
        ))}
      </fieldset>
    </>
  );
};
