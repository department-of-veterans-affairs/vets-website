import React from 'react';
import { formatReadableDate } from '../helpers';

export default function ServicePeriodAccordionView({ formData }) {
  const {
    separationReason,
    serviceBranch,
    serviceCharacter,
    trainingPeriods,
    exclusionPeriods,
  } = formData;

  const servicePeriodFrom = formatReadableDate(formData?.dateRange?.from, 2);
  const servicePeriodTo = formatReadableDate(formData?.dateRange?.to, 2);

  function formatDateList(periods) {
    if (!trainingPeriods || !trainingPeriods.length) {
      return [];
    }

    let key = 0;
    return periods.map(period => (
      <span
        // eslint-disable-next-line no-plusplus
        key={`service-period-${key++}`}
        className="service-history-details_period"
      >
        {formatReadableDate(period.from, 2)} {` – `}
        {formatReadableDate(period.to, 2)}
      </span>
    ));
  }

  const formattedTrainingPeriods = formatDateList(trainingPeriods);
  const formattedExclusionPeriods = formatDateList(exclusionPeriods);

  return (
    <dl className="service-history-details">
      <dt className="service-history-details_term">Branch of service</dt>
      <dd className="service-history-details_definition">{serviceBranch}</dd>

      <dt className="service-history-details_term">Service period</dt>
      <dd className="service-history-details_definition">
        {servicePeriodFrom && (
          <>
            {servicePeriodFrom} &ndash; {servicePeriodTo}
          </>
        )}
      </dd>

      <dt className="service-history-details_term">Character of service</dt>
      <dd className="service-history-details_definition">
        {servicePeriodTo ? serviceCharacter : 'Not Applicable'}
      </dd>

      <dt className="service-history-details_term">Separation reason</dt>
      <dd className="service-history-details_definition">
        {servicePeriodTo ? separationReason : 'Not Applicable'}
      </dd>

      {!!formattedTrainingPeriods.length && (
        <>
          <dt className="service-history-details_term">Training period</dt>
          <dd className="service-history-details_definition">
            {formattedTrainingPeriods}
          </dd>
        </>
      )}

      {!!formattedExclusionPeriods.length && (
        <>
          <dt className="service-history-details_term">Exclusion period</dt>
          <dd className="service-history-details_definition">
            {formattedExclusionPeriods}
          </dd>
        </>
      )}
    </dl>
  );
}
