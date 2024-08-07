/* eslint-disable camelcase */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReportModal = ({
  representativeName,
  representativeId,
  address,
  phone,
  email,
  existingReports,
  onCloseReportModal,
  submitRepresentativeReport,
  cancelRepresentativeReport,
  testReportObject,
}) => {
  const [reportObject, setReportObject] = useState({
    phone: null,
    email: null,
    address: null,
  });

  const [reportIsBlankError, setReportIsBlankError] = useState(false);

  // render conditions
  const totalReportableItems =
    (address !== null) + (phone !== null) + (email !== null);
  const someItemsReported = existingReports;
  const notAllItemsReported =
    !someItemsReported ||
    Object.keys(existingReports).length < totalReportableItems;
  const addressReportable = address && !existingReports?.address;
  const emailReportable = email && !existingReports?.email;
  const phoneReportable = phone && !existingReports?.phone;

  const handleCheckboxChange = event => {
    setReportIsBlankError(false);
    const {
      target: { id, checked },
    } = event;

    const newState = { ...reportObject };

    switch (id) {
      case '1':
        newState.address = checked ? address : null;
        break;
      case '2':
        newState.email = checked ? email : null;
        break;
      case '3':
        newState.phone = checked ? phone : null;
        break;
      default:
        break;
    }

    setReportObject(newState);
  };

  const onSubmitModal = async () => {
    const formattedReportObject = {
      representativeId,
      reports: {},
    };

    // push non-null items to reports object
    Object.keys(reportObject).forEach(prop => {
      if (reportObject[prop] !== null) {
        formattedReportObject.reports[prop] = reportObject[prop];
      }
    });

    if (!Object.keys(formattedReportObject.reports).length) {
      setReportIsBlankError(true);
      return;
    }

    try {
      await submitRepresentativeReport(formattedReportObject);
    } catch {
      setReportObject({
        phone: null,
        email: null,
        address: null,
      });
    }

    onCloseReportModal();
  };

  const onCancelOrClose = () => {
    cancelRepresentativeReport();
    onCloseReportModal();
  };
  return (
    <>
      <VaModal
        onCloseEvent={onCancelOrClose}
        onPrimaryButtonClick={
          notAllItemsReported ? onSubmitModal : onCancelOrClose
        }
        onSecondaryButtonClick={onCancelOrClose}
        primaryButtonText={notAllItemsReported ? 'Submit' : 'Close'}
        secondaryButtonText={notAllItemsReported ? 'Cancel' : null}
        visible
        uswds
      >
        {/* These buttons trigger methods for unit testing - temporary workaround for shadow root issues with va checkboxes */}

        {testReportObject ? (
          <>
            <button
              id="set-report-object-button"
              label="unit test button"
              type="button"
              onClick={() => setReportObject({ ...testReportObject })}
            />
            <button
              label="unit test button"
              id="submit-modal-test-button"
              type="button"
              onClick={() => onSubmitModal()}
            />
          </>
        ) : null}
        <h2
          className="report-modal-header"
          style={{ fontSize: 20, marginTop: 10 }}
        >
          Report outdated information for {representativeName}
        </h2>
        {someItemsReported && (
          <>
            <h3 style={{ fontSize: 17, marginTop: 20 }}>
              You reported this information
            </h3>
            <ul>
              {existingReports.address && <li>Outdated address</li>}
              {existingReports.email && <li>Outdated email</li>}
              {existingReports.phone && <li>Outdated phone number</li>}
            </ul>
          </>
        )}
        {someItemsReported &&
          notAllItemsReported && (
            <>
              <h3 style={{ fontSize: 17, marginBottom: 0 }}>
                You can add to your report
              </h3>
            </>
          )}

        {notAllItemsReported && (
          <>
            <VaCheckboxGroup
              error={reportIsBlankError ? 'Please select an item' : null}
              hint={null}
              onVaChange={handleCheckboxChange}
              label="Select the information we need to update"
              label-header-level=""
              uswds
            >
              {addressReportable && (
                <va-checkbox label="Address" name="address" uswds id="1" />
              )}
              {emailReportable && (
                <va-checkbox label="Email" name="email" uswds id="2" />
              )}
              {phoneReportable && (
                <va-checkbox label="Phone number" name="phone" uswds id="3" />
              )}
            </VaCheckboxGroup>
          </>
        )}
      </VaModal>
    </>
  );
};

export default ReportModal;

ReportModal.propTypes = {
  address: PropTypes.string,
  cancelRepresentativeReport: PropTypes.func,
  email: PropTypes.string,
  existingReports: PropTypes.shape({
    address: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
  phone: PropTypes.string,
  representativeId: PropTypes.string,
  representativeName: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  testReportObject: PropTypes.object,
  onCloseReportModal: PropTypes.func,
};
