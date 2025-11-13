import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import { useNotificationSettingsUtils } from '@@profile/hooks';
import { Document } from './Document';
import { NotEnrolledAlert } from './NotEnrolledAlert';
import { DataErrorAlert } from './DataErrorAlert';

export const Documents = () => {
  const facilities = useSelector(selectPatientFacilities, shallowEqual);
  const { usePaperlessDeliveryGroup } = useNotificationSettingsUtils();
  const group = usePaperlessDeliveryGroup();
  const documents = group?.[0]?.items;
  const notEnrolled = !facilities?.length;
  const hasDocuments = !!documents?.length;

  if (notEnrolled) {
    return <NotEnrolledAlert />;
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--3 vads-u-margin-bottom--2">
        Documents available for paperless delivery
      </h2>
      {!hasDocuments && <DataErrorAlert />}
      {hasDocuments && (
        <fieldset>
          <legend>
            <h3 className="vads-u-font-size--h5 vads-u-color--black vads-u-font-weight--normal vads-u-margin-top--0 vads-u-margin-bottom--0">
              Select a document for paperless delivery. You can change this at
              any time.
            </h3>
          </legend>
          {documents.map(id => (
            <Document key={id} document={id} />
          ))}
        </fieldset>
      )}
    </>
  );
};
