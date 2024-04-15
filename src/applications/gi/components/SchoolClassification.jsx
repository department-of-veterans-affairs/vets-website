import React from 'react';
import classNames from 'classnames';
import environment from 'platform/utilities/environment';
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

  const getLabel = (condition, prodLabel, devLabel) => {
    if (!condition) return '';
    return environment.isProduction() ? prodLabel : devLabel;
  };

  const institutionTraits = displayTraits
    ? [
        getLabel(menonly === 1, 'Men-only', 'Men’s colleges and universities'),
        getLabel(
          womenonly === 1,
          'Women-only',
          'Women’s colleges and universities',
        ),
        getLabel(
          hbcu,
          'Historically Black College or University',
          'Historically Black Colleges and Universities',
        ),
        relaffil && religiousAffiliations[relaffil],
        getLabel(
          hsi === 1,
          'Hispanic-serving institutions',
          'Hispanic-Serving Institutions',
        ),
        getLabel(
          nanti === 1,
          'Native American-serving institutions',
          'Native American-Serving Nontribal Institutions',
        ),
        getLabel(
          annhi === 1,
          'Alaska Native-serving institutions',
          'Alaska Native-Serving Institutions',
        ),
        getLabel(
          aanapii === 1,
          'Asian American Native American Pacific Islander-serving institutions',
          'Asian American and Native American Pacific Islander-Serving Institutions',
        ),
        getLabel(
          pbi === 1,
          'Predominantly Black institutions',
          'Predominantly Black Institutions',
        ),
        getLabel(
          tribal === 1,
          'Tribal college and university',
          'Tribal Colleges and Universities',
        ),
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
