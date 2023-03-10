import React from 'react';
import classNames from 'classnames';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';

export default function SchoolClassification({
  institution,
  displayTraits = true,
  menonly = institution.menonly,
  womenonly = institution.womenonly,
  hbcu = institution.hbcu,
  relaffil = institution.relaffil,
  hsi = institution.hsi,
  nanti = institution.nanti,
  annhi = institution.annhi,
  aanapii = institution.aanapii,
  pbi = institution.pbi,
  tribal = institution.tribal,
  locationResultCard = false,
}) {
  const {
    schoolProvider,
    employerProvider,
    vetTecProvider,
    facilityCode,
  } = institution;

  const institutionTraits = displayTraits
    ? [
        menonly === 1 && 'Men-only',
        womenonly === 1 && 'Women-only',
        hbcu && 'Historically Black College or University',
        relaffil && religiousAffiliations[relaffil],
        hsi === 1 && 'Hispanic-serving institutions',
        nanti === 1 && 'Native American-serving institutions',
        annhi === 1 && 'Alaska Native-serving institutions',
        aanapii === 1 &&
          'Asian American Native American Pacific Islander-serving institutions',
        pbi === 1 && 'Predominantly Black institutions',
        tribal === 1 && 'Tribal college and university',
      ].filter(Boolean)
    : [];

  const schoolClassificationClasses = classNames('school-classification', {
    'school-header': schoolProvider,
    'employer-header': employerProvider,
    'vettec-header': vetTecProvider,
  });

  const schoolClassificationPTagClasses = classNames(
    'vads-u-color--white',
    'vads-u-padding-x--2',
    'vads-u-padding-y--1',
    {
      'vads-u-margin-top--0': !locationResultCard,
      'vads-u-margin-y--0p5': locationResultCard,
    },
  );

  return (
    <>
      <div
        className={schoolClassificationClasses}
        id={`classification-${facilityCode}`}
      >
        <p className={schoolClassificationPTagClasses}>
          <strong>
            {schoolProvider && 'School'}
            {employerProvider && 'On-the-job training / Apprenticeship'}
            {vetTecProvider && 'VET TEC'}
            {institutionTraits.length > 0 && ': '}
          </strong>
          {institutionTraits.join(', ')}
        </p>
      </div>
    </>
  );
}
