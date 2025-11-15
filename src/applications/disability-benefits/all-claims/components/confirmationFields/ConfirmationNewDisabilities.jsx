import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../utils';

const ConfirmationNewDisabilities = ({ formData }) => {
  const { newDisabilities = [] } = formData || {};

  return (
    <>
      {newDisabilities.map(dis => {
        // guard is necessary for legacy 0781 conditions that do not have a cause
        const cause = dis?.cause || 'Claimed';
        const capitalizedCause =
          cause === 'VA'
            ? 'VA'
            : cause.charAt(0).toUpperCase() + cause.slice(1).toLowerCase();
        return (
          <li key={dis.condition}>
            <h4>{capitalizeEachWord(dis.condition)} </h4>
            <div className="vads-u-color--gray">Description </div>
            {capitalizedCause} condition; {dis.primaryDescription}
            {dis.cause === 'SECONDARY' &&
              dis?.['view:secondaryFollowUp']?.causedByDisability && (
                <>
                  {'Caused by '}
                  {dis['view:secondaryFollowUp']?.causedByDisability}
                  {'; '}
                  {dis['view:secondaryFollowUp']?.causedByDisabilityDescription}
                </>
              )}
            {dis.cause === 'WORSENED' &&
              dis?.['view:worsenedFollowUp'] && (
                <>
                  {' '}
                  {dis['view:worsenedFollowUp'].worsenedDescription}
                  {'; '}
                  {dis['view:worsenedFollowUp'].worsenedEffects}
                </>
              )}
            {dis.cause === 'VA' &&
              dis?.['view:vaFollowUp'] && (
                <>
                  {'VA mistreatment on  '}
                  {dis['view:vaFollowUp'].vaMistreatmentDate} {' at '}
                  {dis['view:vaFollowUp'].vaMistreatmentLocation}
                  {'; '}
                  {dis['view:vaFollowUp'].vaMistreatmentDescription}
                </>
              )}
          </li>
        );
      })}
    </>
  );
};

ConfirmationNewDisabilities.propTypes = {
  formData: PropTypes.shape({
    newDisabilities: PropTypes.array,
  }),
};

export default ConfirmationNewDisabilities;
