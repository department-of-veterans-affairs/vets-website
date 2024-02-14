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
  onCloseModal,
  submitRepresentativeReport,
}) => {
  const [reportObject, setReportObject] = useState({
    phone: null,
    email: null,
    address: null,
    otherComment: null,
  });

  const [otherCommentIsChecked, setOtherCommentIsChecked] = useState(false);
  const [otherCommentIsBlankError, setOtherCommentIsBlankError] = useState(
    false,
  );
  const [reportIsBlankError, setReportIsBlankError] = useState(false);

  // render conditions
  const totalReportableItems =
    (address !== null) + (phone !== null) + (email !== null) + 1;
  const someItemsReported = existingReports;
  const notAllItemsReported =
    !someItemsReported ||
    Object.keys(existingReports).length < totalReportableItems;
  const addressReportable = address && !existingReports?.address;
  const emailReportable = email && !existingReports?.email;
  const phoneReportable = phone && !existingReports?.phone;
  const otherCommentReportable = !existingReports?.otherComment;

  const handleOtherCommentInputChange = event => {
    setOtherCommentIsBlankError(false);
    const newState = { ...reportObject };
    newState.otherComment = event.target.value;
    setReportObject(newState);
  };

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
      case '4':
        setOtherCommentIsBlankError(false);
        setOtherCommentIsChecked(checked);
        break;
      default:
        break;
    }

    setReportObject(newState);
  };

  const onSubmitModal = () => {
    const formattedReportObject = { representativeId, reports: {} };

    // push non-null items to reports object
    Object.keys(reportObject).forEach(prop => {
      if (reportObject[prop] !== null) {
        formattedReportObject.reports[prop] = reportObject[prop];
      }
    });

    if (otherCommentIsChecked && !formattedReportObject.reports.otherComment) {
      setOtherCommentIsBlankError(true);
      return;
    }
    if (!Object.keys(formattedReportObject.reports).length) {
      setReportIsBlankError(true);
      return;
    }

    submitRepresentativeReport(formattedReportObject);
    setReportObject({
      phone: null,
      email: null,
      address: null,
      otherComment: null,
    });

    onCloseModal();
  };

  return (
    <>
      <VaModal
        onCloseEvent={onCloseModal}
        onPrimaryButtonClick={onSubmitModal}
        onSecondaryButtonClick={onCloseModal}
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        visible
        uswds
      >
        <h3>Report outdated information for ${representativeName}</h3>
        {someItemsReported && (
          <>
            <h3>You reported this information</h3>
            <ul>
              {existingReports.address && <li>Outdated address</li>}
              {existingReports.email && <li>Outdated email</li>}
              {existingReports.phone && <li>Outdated phone number</li>}
              {existingReports.otherComment && (
                <li>Other: "{existingReports.otherComment}"</li>
              )}
            </ul>
          </>
        )}
        {someItemsReported &&
          notAllItemsReported && (
            <>
              <h3>You can add to your report</h3>
            </>
          )}

        {notAllItemsReported && (
          <>
            <VaCheckboxGroup
              error={reportIsBlankError ? 'Please select an item' : null}
              hint={null}
              onVaChange={handleCheckboxChange}
              required
              label="Select the information we need to update"
              label-header-level=""
              uswds
            >
              {addressReportable && (
                <va-checkbox
                  label="Incorrect address"
                  name="address"
                  uswds
                  id="1"
                />
              )}
              {emailReportable && (
                <va-checkbox
                  label="Incorrect email"
                  name="email"
                  uswds
                  id="2"
                />
              )}
              {phoneReportable && (
                <va-checkbox
                  label="Incorrect phone number"
                  name="phone"
                  uswds
                  id="3"
                />
              )}
              {otherCommentReportable && (
                <va-checkbox label="Other" name="other" uswds id="4" />
              )}
            </VaCheckboxGroup>
          </>
        )}

        {otherCommentIsChecked && (
          <div className="vads-u-padding-left--4">
            <div
              className={`${
                !otherCommentIsBlankError ? 'form-expanding-group-open' : null
              } form-expanding-group-inner-enter-done`}
            >
              <va-text-input
                hint={null}
                required
                error={
                  otherCommentIsBlankError ? 'This field is required' : null
                }
                label="Describe the other information we need to update"
                value={reportObject.otherComment}
                name="my-input"
                maxlength={250}
                onInput={e => handleOtherCommentInputChange(e)}
                uswds
                charcount
              />
            </div>
          </div>
        )}
      </VaModal>
    </>
  );
};

export default ReportModal;

ReportModal.propTypes = {
  address: PropTypes.string,
  email: PropTypes.string,
  existingReports: PropTypes.shape({
    address: PropTypes.string,
    email: PropTypes.string,
    otherComment: PropTypes.string,
    phone: PropTypes.string,
  }),
  phone: PropTypes.string,
  representativeId: PropTypes.string,
  representativeName: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  onCloseModal: PropTypes.func,
};
