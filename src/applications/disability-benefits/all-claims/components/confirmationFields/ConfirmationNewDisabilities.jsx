import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../../utils';
import { formatDateString } from '../../content/conditions';
import { DISABILITY_CAUSE_LABELS } from '../../constants';

const getCauseLabel = cause => DISABILITY_CAUSE_LABELS[cause] || '';
const ConfirmationNewDisabilities = ({ formData }) => {
  const { newDisabilities = [] } = formData || {};
  return (
    <>
      {newDisabilities
        .filter(dis => dis?.condition !== 'Rated Disability')
        .map((dis, index) => {
          // Guard is necessary for legacy 0781 conditions that do not have a cause
          const cause = dis?.cause || 'Claimed';
          const isVaCause = cause === 'VA';
          const capitalizedConditionType = isVaCause
            ? 'VA'
            : cause.charAt(0).toUpperCase() + cause.slice(1).toLowerCase();
          const causeLabel = getCauseLabel(cause);
          const conditionDate = formatDateString(dis?.conditionDate);
          const condition = dis?.condition?.trim();
          const key = condition
            ? `${cause}-${condition}`
            : `${cause}-unknown-${index}`;

          // --- Backward-compatible field accessors ---
          // SECONDARY (new shape OR legacy nested shape)
          const causedByDisability =
            dis?.causedByDisability ??
            dis?.['view:secondaryFollowUp']?.causedByDisability;
          const causedByDisabilityDescription =
            dis?.causedByDisabilityDescription ??
            dis?.['view:secondaryFollowUp']?.causedByDisabilityDescription;

          // WORSENED (new shape OR legacy nested shape)
          const worsenedDescription =
            dis?.worsenedDescription ??
            dis?.['view:worsenedFollowUp']?.worsenedDescription;
          const worsenedEffects =
            dis?.worsenedEffects ??
            dis?.['view:worsenedFollowUp']?.worsenedEffects;

          // VA (new shape OR legacy nested shape)
          const vaMistreatmentDescription =
            dis?.vaMistreatmentDescription ??
            dis?.['view:vaFollowUp']?.vaMistreatmentDescription;
          const vaMistreatmentLocation =
            dis?.vaMistreatmentLocation ??
            dis?.['view:vaFollowUp']?.vaMistreatmentLocation;
          const vaMistreatmentDate =
            dis?.vaMistreatmentDate ??
            dis?.['view:vaFollowUp']?.vaMistreatmentDate;

          const shouldShowVaTreatmentDate = isVaCause && !!vaMistreatmentDate;
          const shouldShowConditionDate =
            !!conditionDate && !shouldShowVaTreatmentDate;

          return (
            <li key={key}>
              <h4>{capitalizeEachWord(condition)}</h4>

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

              {dis?.primaryDescription && (
                <>
                  <div className="vads-u-color--gray">Description</div>
                  <div className="vads-u-margin-bottom--2">
                    {dis.primaryDescription}
                  </div>
                </>
              )}

              {shouldShowConditionDate && (
                <>
                  <div className="vads-u-color--gray">Date</div>
                  <div className="vads-u-margin-bottom--2">{conditionDate}</div>
                </>
              )}

              {cause === 'SECONDARY' &&
                causedByDisability && (
                  <>
                    <div className="vads-u-color--gray">Caused by</div>
                    <div className="vads-u-margin-bottom--2">
                      {causedByDisability}
                    </div>
                    {causedByDisabilityDescription && (
                      <>
                        <div className="vads-u-color--gray">Description</div>
                        <div className="vads-u-margin-bottom--2">
                          {causedByDisabilityDescription}
                        </div>
                      </>
                    )}
                  </>
                )}

              {cause === 'WORSENED' &&
                (worsenedDescription || worsenedEffects) && (
                  <>
                    {worsenedDescription && (
                      <>
                        <div className="vads-u-color--gray">
                          Worsened description
                        </div>
                        <div className="vads-u-margin-bottom--2">
                          {worsenedDescription}
                        </div>
                      </>
                    )}
                    {worsenedEffects && (
                      <>
                        <div className="vads-u-color--gray">
                          Worsened effects
                        </div>
                        <div className="vads-u-margin-bottom--2">
                          {worsenedEffects}
                        </div>
                      </>
                    )}
                  </>
                )}

              {cause === 'VA' &&
                (vaMistreatmentDescription ||
                  vaMistreatmentLocation ||
                  vaMistreatmentDate) && (
                  <>
                    {vaMistreatmentDescription && (
                      <>
                        <div className="vads-u-color--gray">
                          VA mistreatment description
                        </div>
                        <div className="vads-u-margin-bottom--2">
                          {vaMistreatmentDescription}
                        </div>
                      </>
                    )}
                    {vaMistreatmentLocation && (
                      <>
                        <div className="vads-u-color--gray">
                          VA mistreatment location
                        </div>
                        <div className="vads-u-margin-bottom--2">
                          {vaMistreatmentLocation}
                        </div>
                      </>
                    )}
                    {shouldShowVaTreatmentDate && (
                      <>
                        <div className="vads-u-color--gray">
                          VA mistreatment date
                        </div>
                        <div className="vads-u-margin-bottom--2">
                          {vaMistreatmentDate}
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
