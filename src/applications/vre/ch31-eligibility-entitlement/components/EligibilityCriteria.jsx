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

  const periods = veteranProfile?.servicePeriod || [];
  const count = periods.length;
  const label = count === 1 ? 'period' : 'periods';
  const scdDetails = disabilityRating?.scdDetails ?? [];
  return (
    <>
      <h2 className="vads-u-margin-top--4">Basic eligibility criteria</h2>
      <p>
        A Veteran must have a compensable service-connected disability (SCD)
        rating of 10 percent or more and must have served on active military
        duty on or after September 16, 1940, as defined in 38 C.F.R. § 3.7.
        Additionally, the Veteran must have an Other Than Dishonorable Discharge
        for at least one active period or qualifying service.
      </p>

      <va-additional-info trigger="VA review process for hospitalized service members with SCD">
        <p>
          For Service members hospitalized or recently hospitalized with an SCD
          while awaiting separation, the VA must determine that the condition is
          likely compensable under 38 U.S.C. Chapter 11, which requires an SCD
          rating, Integrated Disability Evaluation System (IDES) rating, or Memo
          rating.
        </p>
      </va-additional-info>

      <ul className="vads-u-margin-top--4 vads-u-padding-left--0 vads-u-padding-bottom--4">
        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={svcStyle.icon}
            srtext={svcStyle.icon}
            size={3}
            class={`${
              svcStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>Qualifying military service:</strong>
            <va-additional-info trigger="Service history details">
              <p className="vads-u-padding-bottom--1">
                Applicant has {count} {label} of qualifying military service
                after September 16, 1940:
              </p>

              <ul style={{ listStyleType: 'disc' }}>
                {periods.map((sp, i) => (
                  <React.Fragment key={i}>
                    <li>
                      Entered Active Duty (EOD):{' '}
                      {formatDate(sp?.serviceBeganDate)}
                    </li>
                    <li>Released: {formatDate(sp?.serviceEndDate)}</li>
                  </React.Fragment>
                ))}
              </ul>
            </va-additional-info>
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={codStyle.icon}
            srtext={codStyle.icon}
            size={3}
            class={`${
              codStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Character of Discharge:{' '}
              {veteranProfile?.characterOfDischarge || '—'}
            </strong>
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={drStyle.icon}
            srtext={drStyle.icon}
            size={3}
            class={`${
              drStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Disability rating:{' '}
              {disabilityRating?.combinedScd != null
                ? `${disabilityRating.combinedScd}%`
                : '—'}
            </strong>
            {scdDetails.length > 0 && (
              <va-additional-info trigger="SCD details">
                <ul
                  className="vads-u-margin-top--1"
                  style={{ listStyleType: 'disc' }}
                >
                  {scdDetails.map(detail => (
                    <li key={detail?.code}>
                      {detail?.code} - {detail?.name} - {detail?.percentage}%
                    </li>
                  ))}
                </ul>
              </va-additional-info>
            )}
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={irndStyle.icon}
            srtext={irndStyle.icon}
            size={3}
            class={`${
              irndStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Initial rating notification date: {formatDate(irndDate)}
            </strong>
          </div>
        </li>

        <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
          <va-icon
            icon={etdStyle.icon}
            srtext={etdStyle.icon}
            size={3}
            class={`${
              etdStyle.cls
            } vads-u-margin-right--1 vads-u-margin-top--0p5`}
          />
          <div>
            <strong>
              Eligibility termination date:{' '}
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
  veteranProfile: PropTypes.shape({
    characterOfDischarge: PropTypes.string,
    servicePeriod: PropTypes.arrayOf(
      PropTypes.shape({
        serviceBeganDate: PropTypes.string,
        serviceEndDate: PropTypes.string,
        characterOfDischarge: PropTypes.string,
      }),
    ),
  }),
  disabilityRating: PropTypes.shape({
    combinedScd: PropTypes.number,
    scdDetails: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
        percentage: PropTypes.number,
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
