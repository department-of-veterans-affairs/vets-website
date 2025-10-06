import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../utils';

const ConfirmationNewDisabilities = ({ formData }) => {
  const { newDisabilities = [] } = formData || {};

  return (
    <div>
      {newDisabilities.map(dis => (
        <div key={dis.condition}>
          <h4>{capitalizeEachWord(dis.condition)}</h4>
          <div className="vads-u-color--gray">Description</div>
          {dis.cause.toLowerCase()} condition; {dis.primaryDescription}
          {dis.cause === 'SECONDARY' &&
            dis?.['view:secondaryFollowUp']?.causedByDisability && (
              <>
                {' '}
                (secondary to{' '}
                {dis['view:secondaryFollowUp']?.causedByDisability}
                );{' '}
                {dis['view:secondaryFollowUp']?.causedByDisabilityDescription}
              </>
            )}
          {dis.cause === 'WORSENED' &&
            dis?.['view:worsenedFollowUp'] && (
              <>
                {' '}
                {dis['view:worsenedFollowUp'].worsenedDescription}.{' '}
                {dis['view:worsenedFollowUp'].worsenedEffects}
              </>
            )}
          {dis.cause === 'VA' &&
            dis?.['view:vaFollowUp'] && (
              <>
                {' '}
                VA mistreatment on {
                  dis['view:vaFollowUp'].vaMistreatmentDate
                }{' '}
                at {dis['view:vaFollowUp'].vaMistreatmentLocation}:{' '}
                {dis['view:vaFollowUp'].vaMistreatmentDescription}
              </>
            )}
        </div>
      ))}
    </div>
  );
};

ConfirmationNewDisabilities.propTypes = {
  formData: PropTypes.shape({
    newDisabilities: PropTypes.array,
  }),
};

export default ConfirmationNewDisabilities;
