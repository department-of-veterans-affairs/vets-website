import React from 'react';
import classNames from 'classnames';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';
import environment from 'platform/utilities/environment';

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
        menonly === 1 ? (environment.isProduction() ? 'Men-only' : 'Men’s colleges and universities') : '',
        // womenonly === 1 && 'Women-only',
        womenonly === 1 ? (environment.isProduction() ? 'Women-only' : 'Women’s colleges and universities') : '',
        hbcu ? (environment.isProduction() ? 'Historically Black College or University' : 'Historically Black Colleges and Universities') :'',
        relaffil && religiousAffiliations[relaffil],
        hsi === 1 ? (environment.isProduction() ? 'Hispanic-serving institutions' : 'Hispanic-Serving Institutions') : '',
        nanti === 1 ? (environment.isProduction() ? 'Native American-serving institutions' : 'Native American-Serving Nontribal Institutions') : '',
        annhi === 1 ? (environment.isProduction() ? 'Alaska Native-serving institutions' : 'Alaska Native-Serving Institutions') : '',
        aanapii === 1 ? (environment.isProduction() ?
          'Asian American Native American Pacific Islander-serving institutions': 'Asian American and Native American Pacific Islander-Serving Institutions') :'',
        pbi === 1 ? (environment.isProduction() ? 'Predominantly Black institutions' : 'Predominantly Black Institutions'):'',
        tribal === 1 ? (environment.isProduction() ? 'Tribal college and university' : 'Tribal Colleges and Universities') : '',
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
