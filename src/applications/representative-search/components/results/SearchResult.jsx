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
  representative,
  representativeId,
  query,
}) => {
  const [
    reportOutdatedInformationModalIsShowing,
    setReportOutdatedInformationModalIsShowing,
  ] = useState(false);

  const [reportItems, setReportItems] = useState({
    phone: false,
    email: false,
    address: false,
  });

  const [commentInput, setCommentInput] = useState('');

  const addressExists =
    addressLine1 || addressLine2 || addressLine3 || city || state || zipCode;

  const { contact, extension } = parsePhoneNumber(phone);

  const handleCheckboxChange = event => {
    const {
      target: { id, checked },
    } = event;

    const prevState = { ...reportItems };

    switch (id) {
      case '1':
        prevState.phone = checked;
        break;
      case '2':
        prevState.email = checked;
        break;
      case '3':
        prevState.address = checked;
        break;
      default:
        break;
    }

    setReportItems(prevState);
  };

  const assembleJSONBody = () => {
    const reportRequestBody = {
      representativeId,
      flags: [],
    };

    // push checked items to flags array
    Object.keys(reportItems).forEach(key => {
      if (reportItems[key] === true) {
        const flagObject = { flagType: key, flaggedValue: reportItems[key] };
        reportRequestBody.flags.push(flagObject);
      }
    });

    // push text input to flags array
    if (commentInput) {
      reportRequestBody.flags.push({
        flagType: 'other',
        flaggedValue: commentInput,
      });
    }
    return reportRequestBody;
  };

  const onSubmitReportOutdatedInformation = () => {
    const reportRequestBody = assembleJSONBody();
    submitRepresentativeReport(reportRequestBody);
    setReportOutdatedInformationModalIsShowing(false);
  };

  return (
    <>
      <VaModal
        modalTitle="Report Outdated Information"
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
        <VaCheckboxGroup
          error={null}
          hint={null}
          onVaChange={handleCheckboxChange}
          required
          label="Describe the issue"
          label-header-level=""
          uswds
        >
          <va-checkbox
            label="Incorrect phone number"
            name="phone"
            uswds
            id="1"
          />
          <va-checkbox label="Incorrect email" name="email" uswds id="2" />
          <va-checkbox label="Incorrect address" name="address" uswds id="3" />
        </VaCheckboxGroup>
        <va-text-input
          hint={null}
          label="If your issue isn't listed, describe the issue here"
          value={commentInput}
          name="my-input"
          // onBlur={function noRefCheck() {}}
          maxlength={250}
          onInput={e => setCommentInput(e.target.value)}
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
            onClick={() => {
              setReportOutdatedInformationModalIsShowing(true);
            }}
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
  representativeId: PropTypes.string,
  state: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
