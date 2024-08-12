// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Relative imports
import AlertMessage from '../AlertMessage';
import { branchOfService, board } from '../../helpers';
import { venueWarning, upgradeVenueWarning } from '../../constants';

const Warnings = ({ formValues }) => {
  const renderVenueWarnings = () => {
    const prevAppType = formValues['10_prevApplicationType'];
    const reason = formValues['4_reason'];
    const dischargeYear = formValues['2_dischargeYear'];
    const dischargeMonth = formValues['3_dischargeMonth'] || 1;
    const oldDischarge =
      moment().diff(moment([dischargeYear, dischargeMonth]), 'years', true) >=
      15;

    return (
      <>
        <AlertMessage
          content={venueWarning}
          isVisible={prevAppType === '4' && reason !== '8'}
          status="warning"
        />
        <AlertMessage
          content={upgradeVenueWarning}
          isVisible={prevAppType === '4' && reason === '8' && !oldDischarge}
          status="warning"
        />
      </>
    );
  };

  const renderDischargeWarning = () => {
    const boardToSubmit = board(formValues);
    const prevAppType = formValues['7_courtMartial'];

    const alertContent = `Because you answered that you’re not sure if your discharge was the
        outcome of a general court-martial, it’s important for you to check your
        military records. The results below are for Veterans who have discharges
        that are administrative or the result of a special or summary
        court-martial.`;

    return (
      <AlertMessage
        content={alertContent}
        isVisible={boardToSubmit.abbr === 'DRB' && prevAppType === '3'}
        status="warning"
      />
    );
  };

  const renderApplicationWarning = () => {
    const prevAppType = formValues['10_prevApplicationType'];
    const reason = formValues['4_reason'];

    const alertContent = `Because you answered that you weren’t sure where you applied for an
        upgrade before, it’s important for you to check your records. The
        instructions below are for Veterans who had a successful upgrade
        application reviewed by the${' '}
        ${branchOfService(formValues['1_branchOfService'])} Discharge Review
        Board (DRB).`;

    return (
      <AlertMessage
        content={alertContent}
        isVisible={reason === '8' && prevAppType === '3'}
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
  formValues: PropTypes.object.isRequired,
};

export default Warnings;
