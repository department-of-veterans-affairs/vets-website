import React from 'react';
import PropTypes from 'prop-types';
import AlertMessage from './AlertMessage';
import { determineBranchOfService, determineBoardObj } from '../../helpers';
import { venueWarning, DRB } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

const Warnings = ({ formResponses }) => {
  const renderVenueWarnings = () => {
    const prevAppType = formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE];
    const reason = formResponses[SHORT_NAME_MAP.REASON];

    return (
      <>
        <AlertMessage
          content={venueWarning}
          isVisible={
            prevAppType === RESPONSES.NOT_SURE &&
            reason !== RESPONSES.REASON_DD215_UPDATE_TO_DD214
          }
          status="warning"
        />
      </>
    );
  };

  const renderDischargeWarning = () => {
    const boardToSubmit = determineBoardObj(formResponses);
    const courtMartial = formResponses[SHORT_NAME_MAP.COURT_MARTIAL];

    const alertContent = `Because you answered that you’re not sure if your discharge was the outcome of a general court-martial, 
    it’s important for you to check your military records. 
    These results are for Veterans who have discharges that are administrative or the result of a special or summary court-martial.`;

    return (
      <AlertMessage
        content={alertContent}
        isVisible={
          boardToSubmit.abbr === DRB && RESPONSES.NOT_SURE === courtMartial
        }
        status="warning"
      />
    );
  };

  const renderApplicationWarning = () => {
    const prevAppType = formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE];
    const reason = formResponses[SHORT_NAME_MAP.REASON];

    const alertContent = `Because you answered that you weren’t sure where you applied for an upgrade before, 
        it’s important for you to check your records. 
        These instructions are for Veterans who had a successful upgrade application reviewed by the${' '}
        ${determineBranchOfService(
          formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
        )} 
        Discharge Review Board (DRB). For more reliable information, 
        please review your records to find out which board you sent your earlier application to, 
        and complete the questions again.`;

    return (
      <AlertMessage
        content={alertContent}
        isVisible={
          reason === RESPONSES.REASON_DD215_UPDATE_TO_DD214 &&
          prevAppType === RESPONSES.NOT_SURE
        }
        status="warning"
      />
    );
  };

  return (
    <>
      {renderVenueWarnings()}
      {renderDischargeWarning()}
      {renderApplicationWarning()}
    </>
  );
};

Warnings.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default Warnings;
