import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, pickStatusStyle } from '../helpers';

const EligibilityCriteria = ({
  veteranProfile,
  disabilityRating,
  irndDate,
  eligibilityTerminationDate,
  qualifyingMilitaryServiceStatus,
  characterOfDischargeStatus,
  disabilityRatingStatus,
  irndStatus,
  eligibilityTerminationDateStatus,
}) => {
  const svcStyle = pickStatusStyle(qualifyingMilitaryServiceStatus);
  const codStyle = pickStatusStyle(characterOfDischargeStatus);
  const drStyle = pickStatusStyle(disabilityRatingStatus);
  const irndStyle = pickStatusStyle(irndStatus);
  const etdStyle = pickStatusStyle(eligibilityTerminationDateStatus);
  return (
    <>
      <h2 className="vads-u-margin-top--4">Eligibility Criteria</h2>
      <ul className="vads-u-margin-top--0 vads-u-padding-left--0 vads-u-padding-bottom--4">
        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={svcStyle.icon}
            size={3}
            class={`${
              svcStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>Qualifying Military Service:</strong>
            <p className="vads-u-margin-y--0">
              Applicant has{' '}
              {Array.isArray(veteranProfile?.servicePeriod)
                ? veteranProfile.servicePeriod.length
                : 0}{' '}
              period(s) of qualifying military service after September 16, 1940:
            </p>
            <ul className="vads-u-margin-top--0">
              {(veteranProfile?.servicePeriod || []).map((sp, index) => (
                <React.Fragment key={index}>
                  <li>
                    Entered Active Duty (EOD):{' '}
                    {formatDate(sp?.serviceBeganDate)};
                  </li>
                  <li>Released: {formatDate(sp?.serviceEndDate)};</li>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={codStyle.icon}
            size={3}
            class={`${
              codStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Character of discharge:{' '}
              {veteranProfile?.characterOfDischarge || '—'}
            </strong>
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={drStyle.icon}
            size={3}
            class={`${
              drStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Disability Rating:{' '}
              {Number.isFinite(disabilityRating?.combinedScd)
                ? `${disabilityRating.combinedScd}%`
                : '—'}
            </strong>
            {Array.isArray(disabilityRating?.scdDetails) &&
              disabilityRating.scdDetails.length > 0 && (
                <>
                  <p className="vads-u-margin-y--0">SCD Details:</p>
                  <ul className="vads-u-margin-top--0">
                    {disabilityRating.scdDetails.map(detail => (
                      <li key={detail?.code}>
                        {detail?.code} - {detail?.name} - {detail?.percentage}%
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={irndStyle.icon}
            size={3}
            class={`${
              irndStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Initial rating Notification Date: {formatDate(irndDate)}
            </strong>
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={etdStyle.icon}
            size={3}
            class={`${
              etdStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Eligibility Termination Date:{' '}
              {formatDate(eligibilityTerminationDate)}
            </strong>
          </div>
        </li>
      </ul>
    </>
  );
};

const StatusType = PropTypes.oneOf(['Eligible', 'Ineligible']);

EligibilityCriteria.propTypes = {
  veteranProfile: PropTypes.object,
  disabilityRating: PropTypes.shape({
    combinedScd: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    scdDetails: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    ),
  }),
  irndDate: PropTypes.any,
  eligibilityTerminationDate: PropTypes.any,
  qualifyingMilitaryServiceStatus: StatusType,
  characterOfDischargeStatus: StatusType,
  disabilityRatingStatus: StatusType,
  irndStatus: StatusType,
  eligibilityTerminationDateStatus: StatusType,
};

export default EligibilityCriteria;
