import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  representative,
  query,
}) => {
  const [
    reportOutdatedInformationModalIsShowing,
    setReportOutdatedInformationModalIsShowing,
  ] = useState(false);

  const addressExists =
    addressLine1 || addressLine2 || addressLine3 || city || state || zipCode;

  const { contact, extension } = parsePhoneNumber(phone);

  const showReportOutdatedInformationModal = e => {
    e.preventDefault();
    setReportOutdatedInformationModalIsShowing(true);
  };

  const closeReportOutdatedInformationModal = e => {
    e.preventDefault();
    setReportOutdatedInformationModalIsShowing(false);
  };

  return (
    <>
      <VaModal
        modalTitle="Report Outdated Information"
        onCloseEvent={closeReportOutdatedInformationModal}
        onPrimaryButtonClick={closeReportOutdatedInformationModal}
        onSecondaryButtonClick={closeReportOutdatedInformationModal}
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        visible={reportOutdatedInformationModalIsShowing}
        uswds
      >
        <va-checkbox-group
          error={null}
          hint={null}
          required
          label="Describe the issue"
          label-header-level=""
          uswds
        >
          <va-checkbox
            label="Incorrect address"
            name="example"
            uswds
            value="1"
          />
          <va-checkbox
            label="Incorrect phone number"
            name="example"
            uswds
            value="2"
          />
          <va-checkbox label="Incorrect email" name="example" uswds value="3" />
        </va-checkbox-group>

        <va-text-input
          hint={null}
          label="If your issue isn't listed, describe the issue here"
          name="my-input"
          onBlur={function noRefCheck() {}}
          onInput={function noRefCheck() {}}
          uswds
        />
      </VaModal>
      <div className="vads-u-padding-y--4">
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
            onClick={showReportOutdatedInformationModal}
            secondary
            text="Report outdated information"
            uswds
          />
        </div>
      </div>
    </>
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
  representative: PropTypes.string,
  state: PropTypes.string,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
