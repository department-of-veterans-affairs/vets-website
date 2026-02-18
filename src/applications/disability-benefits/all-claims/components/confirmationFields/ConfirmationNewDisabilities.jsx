import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../../utils';
import { formatDateString } from '../../content/conditions';
import { DISABILITY_CAUSE_LABELS } from '../../constants';

const getCauseLabel = cause => {
  return DISABILITY_CAUSE_LABELS[cause] || '';
};

const ConfirmationNewDisabilities = ({ formData }) => {
  const { newDisabilities = [] } = formData || {};

  return (
    <>
      {newDisabilities.map(dis => {
        // guard is necessary for legacy 0781 conditions that do not have a cause
        const cause = dis?.cause || 'Claimed';
        const capitalizedConditionType =
          cause === 'VA'
            ? 'VA'
            : cause.charAt(0).toUpperCase() + cause.slice(1).toLowerCase();
        const causeLabel = getCauseLabel(cause);
        const conditionDate = formatDateString(dis?.conditionDate);

        return (
          <li key={dis.condition}>
            <h4>{capitalizeEachWord(dis.condition)}</h4>

            {capitalizedConditionType && (
              <>
                <div className="vads-u-color--gray">Type of condition</div>
                <div className="vads-u-margin-bottom--2">
                  {capitalizedConditionType} condition
                </div>
              </>
            )}

            {causeLabel && (
              <>
                <div className="vads-u-color--gray">Cause</div>
                <div className="vads-u-margin-bottom--2">{causeLabel}</div>
              </>
            )}

            {dis.primaryDescription && (
              <>
                <div className="vads-u-color--gray">Description</div>
                <div className="vads-u-margin-bottom--2">
                  {dis.primaryDescription}
                </div>
              </>
            )}

            {conditionDate && (
              <>
                <div className="vads-u-color--gray">Date</div>
                <div className="vads-u-margin-bottom--2">{conditionDate}</div>
              </>
            )}

            {dis.cause === 'SECONDARY' &&
              dis?.['view:secondaryFollowUp']?.causedByDisability && (
                <>
                  <div className="vads-u-color--gray">Caused by</div>
                  <div className="vads-u-margin-bottom--2">
                    {dis['view:secondaryFollowUp']?.causedByDisability}
                  </div>
                  {dis['view:secondaryFollowUp']
                    ?.causedByDisabilityDescription && (
                    <>
                      <div className="vads-u-color--gray">Description</div>
                      <div className="vads-u-margin-bottom--2">
                        {
                          dis['view:secondaryFollowUp']
                            ?.causedByDisabilityDescription
                        }
                      </div>
                    </>
                  )}
                </>
              )}

            {dis.cause === 'WORSENED' &&
              dis?.['view:worsenedFollowUp'] && (
                <>
                  {dis['view:worsenedFollowUp'].worsenedDescription && (
                    <>
                      <div className="vads-u-color--gray">
                        Worsened description
                      </div>
                      <div className="vads-u-margin-bottom--2">
                        {dis['view:worsenedFollowUp'].worsenedDescription}
                      </div>
                    </>
                  )}
                  {dis['view:worsenedFollowUp'].worsenedEffects && (
                    <>
                      <div className="vads-u-color--gray">Worsened effects</div>
                      <div className="vads-u-margin-bottom--2">
                        {dis['view:worsenedFollowUp'].worsenedEffects}
                      </div>
                    </>
                  )}
                </>
              )}

            {dis.cause === 'VA' &&
              dis?.['view:vaFollowUp'] && (
                <>
                  {dis['view:vaFollowUp'].vaMistreatmentDescription && (
                    <>
                      <div className="vads-u-color--gray">
                        VA mistreatment description
                      </div>
                      <div className="vads-u-margin-bottom--2">
                        {dis['view:vaFollowUp'].vaMistreatmentDescription}
                      </div>
                    </>
                  )}
                  {dis['view:vaFollowUp'].vaMistreatmentLocation && (
                    <>
                      <div className="vads-u-color--gray">
                        VA mistreatment location
                      </div>
                      <div className="vads-u-margin-bottom--2">
                        {dis['view:vaFollowUp'].vaMistreatmentLocation}
                      </div>
                    </>
                  )}
                  {dis['view:vaFollowUp'].vaMistreatmentDate && (
                    <>
                      <div className="vads-u-color--gray">
                        VA mistreatment date
                      </div>
                      <div className="vads-u-margin-bottom--2">
                        {dis['view:vaFollowUp'].vaMistreatmentDate}
                      </div>
                    </>
                  )}
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
