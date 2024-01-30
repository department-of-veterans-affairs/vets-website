import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RepresentativeDirectionsLink from './RepresentativeDirectionsLink';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

const SearchResult = ({
  officer,
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  state,
  zipCode,
  phone,
  distance,
  email,
  submitRepresentativeReport,
  reports,
  representative,
  representativeId,
  query,
}) => {
  const [reportObject, setReportObject] = useState({
    phone: null,
    email: null,
    address: null,
    otherComment: null,
  });

  const [
    reportOutdatedInformationModalIsShowing,
    setReportOutdatedInformationModalIsShowing,
  ] = useState(false);

  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists =
    addressLine1 || addressLine2 || addressLine3 || city || state || zipCode;

  // concatenating address for user reports
  const address =
    [
      addressLine1.trim(),
      (addressLine2 || '').trim(),
      (addressLine3 || '').trim(),
    ]
      .filter(Boolean)
      .join(' ') +
    (city ? ` ${city},` : '') +
    (state ? ` ${state}` : '') +
    (zipCode ? ` ${zipCode}` : '');

  // for conditional rendering of the modal
  const reportableItemsCount =
    (address !== null) + (phone !== null) + (email !== null) + 1;

  const handleOtherCommentInputChange = event => {
    const newState = { ...reportObject };
    newState.otherComment = event.target.value;
    setReportObject(newState);
  };

  const handleCheckboxChange = event => {
    const {
      target: { id, checked },
    } = event;

    const newState = { ...reportObject };

    switch (id) {
      case '1':
        newState.phone = checked ? phone : null;
        break;
      case '2':
        newState.email = checked ? email : null;
        break;
      case '3':
        newState.address = checked ? address : null;
        break;
      default:
        break;
    }

    setReportObject(newState);
  };

  const onSubmitReportOutdatedInformation = () => {
    const formattedReportObject = { representativeId, reports: {} };

    // push non-null items to reports object
    Object.keys(reportObject).forEach(prop => {
      if (reportObject[prop] !== null) {
        formattedReportObject.reports[prop] = reportObject[prop];
      }
    });

    submitRepresentativeReport(formattedReportObject);
    setReportObject({
      phone: null,
      email: null,
      address: null,
      otherComment: null,
    });
    setReportOutdatedInformationModalIsShowing(false);
  };

  return (
    <div className="report-outdated-information-modal">
      <VaModal
        modalTitle={`Report Outdated Information for 
          ${officer}`}
        onCloseEvent={() => setReportOutdatedInformationModalIsShowing(false)}
        onPrimaryButtonClick={onSubmitReportOutdatedInformation}
        onSecondaryButtonClick={() =>
          setReportOutdatedInformationModalIsShowing(false)
        }
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        visible={reportOutdatedInformationModalIsShowing}
        uswds
      >
        {reports && (
          <>
            <h3>You reported this information</h3>
            <ul>
              {reports.phone && <li>Outdated phone number</li>}
              {reports.email && <li>Outdated email</li>}
              {reports.address && <li>Outdated address</li>}
              {reports.otherComment && <li>Other: "{reports.otherComment}"</li>}
            </ul>
          </>
        )}
        {reports &&
          Object.keys(reports).length < reportableItemsCount && (
            <>
              <h3>You can add to your report</h3>
            </>
          )}

        {(!reports ||
          (reports && Object.keys(reports).length < reportableItemsCount)) && (
          <>
            <VaCheckboxGroup
              error={null}
              hint={null}
              onVaChange={handleCheckboxChange}
              required
              label="Select the information we need to update"
              label-header-level=""
              uswds
            >
              {!reports?.phone && (
                <va-checkbox
                  label="Incorrect phone number"
                  name="phone"
                  uswds
                  id="1"
                />
              )}
              {email &&
                !reports?.email && (
                  <va-checkbox
                    label="Incorrect email"
                    name="email"
                    uswds
                    id="2"
                  />
                )}
              {!reports?.address && (
                <va-checkbox
                  label="Incorrect address"
                  name="address"
                  uswds
                  id="3"
                />
              )}
            </VaCheckboxGroup>
          </>
        )}

        {!reports?.otherComment && (
          <va-text-input
            hint={null}
            label="Describe the other information we need to update"
            value={reportObject.otherComment}
            name="my-input"
            maxlength={250}
            onInput={e => handleOtherCommentInputChange(e)}
            uswds
          />
        )}
      </VaModal>
      <div className="vads-u-padding-y--4">
        {reports && (
          <va-alert
            class="vads-u-margin-bottom--1"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            slim
            status="info"
            uswds
            visible="true"
          >
            <p className="vads-u-margin-y--0">
              Thank you for reporting outdated information.
            </p>
          </va-alert>
        )}
        {distance && (
          <div>
            <strong>{parseFloat(JSON.parse(distance).toFixed(2))} Mi</strong>
          </div>
        )}
        {officer && (
          <div className="vads-u-font-family--serif vads-u-padding-top--0p5">
            <h3>{officer}</h3>
          </div>
        )}
        {addressExists && (
          <div className="vads-u-margin-top--1p5">
            <div>
              {addressLine1}, {addressLine2}
            </div>
            <div>
              {city} {state} {zipCode}
            </div>
            <RepresentativeDirectionsLink
              representative={representative}
              query={query}
            />
          </div>
        )}
        {phone && (
          <div className="vads-u-margin-top--1p5">
            <strong>Main number: </strong>
            <va-telephone contact={contact} extension={extension} />
          </div>
        )}
        {email && (
          <div className="vads-u-margin-top--1p5">
            <strong>E-mail: </strong> <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}
        <div className="vads-u-margin-top--2">
          <va-button
            onClick={() => {
              setReportOutdatedInformationModalIsShowing(true);
            }}
            secondary
            text="Report outdated information"
            uswds
          />
        </div>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  city: PropTypes.string,
  distance: PropTypes.number,
  email: PropTypes.string,
  officer: PropTypes.string,
  phone: PropTypes.string,
  query: PropTypes.object,
  reports: PropTypes.shape({
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    otherComment: PropTypes.string,
  }),
  representative: PropTypes.string,
  representativeId: PropTypes.string,
  state: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
