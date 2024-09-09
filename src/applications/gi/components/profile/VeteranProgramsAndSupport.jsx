import React from 'react';
import {
  createId,
  formatCurrency,
  formatNumber,
  showSchoolContentBasedOnType,
} from '../../utils/helpers';
import LearnMoreLabel from '../LearnMoreLabel';
import { ariaLabels } from '../../constants';

export default function VeteranProgramsAndSupport({
  constants,
  institution,
  showModal,
}) {
  const programs = {
    eightKeys: {
      modal: 'eightKeys',
      text: '8 Keys to Veteran Success',
      link: false,
      ariaLabel: ariaLabels.learnMore.eightKeys,
    },
    dodmou: {
      modal: 'ta',
      text: 'Military Tuition Assistance (TA)',
      link: false,
      ariaLabel: ariaLabels.learnMore.militaryTuitionAssistance,
    },
    poe: {
      modal: 'poe',
      text: 'Principles of Excellence',
      link: false,
      ariaLabel: ariaLabels.learnMore.principlesOfExcellence,
    },
    studentVeteran: {
      modal: 'vetgroups',
      text: 'Student Veteran Group',
      link: {
        href: institution.studentVeteranLink,
        text: 'Visit the site',
      },
      ariaLabel: ariaLabels.learnMore.studentVeteranGroup,
    },
    vetSuccessName: {
      modal: 'vsoc',
      text: 'VetSuccess on Campus',
      link: {
        href:
          institution.vetSuccessEmail &&
          `mailto:${institution.vetSuccessEmail}`,
        text: `Email ${institution.vetSuccessName}`,
      },
      ariaLabel: ariaLabels.learnMore.vetSuccess,
    },
  };
  const available = Object.keys(programs).filter(
    key => !!institution[key] === true,
  );
  const { type } = institution;

  const programLabel = programKey => {
    const program = programs[programKey];
    const showLink = program.link && program.link.href;

    const link =
      (showLink && (
        <span>
          &nbsp;
          <a
            href={program.link.href}
            target="_blank"
            rel="noopener noreferrer"
            id={createId(program.link.text)}
          >
            {program.link.text}
          </a>
        </span>
      )) ||
      '';

    return (
      <div className="veteran-programs" key={programKey}>
        <va-icon icon="check" size={3} class="vads-u-color--green" />
        &nbsp;
        <strong>
          <LearnMoreLabel
            text={program.text}
            onClick={() => {
              showModal(program.modal);
            }}
            ariaLabel={program.ariaLabel}
            buttonId={createId(program.text)}
          />
          {showLink && ':'}
        </strong>
        {link}
      </div>
    );
  };

  const veteranPrograms = (
    <div className="usa-width-one-half medium-6 columns">
      <h3 className="small-screen-font">Veteran Programs</h3>
      {available.length > 0 ? (
        <div>{available.map(program => programLabel(program))}</div>
      ) : (
        <p>
          Please contact the school or their military office directly for
          information on the Veteran programs they offer.
        </p>
      )}
    </div>
  );

  const historicalInformation = (
    <div className="usa-width-one-half medium-6 columns">
      <div className="historical-information table">
        <h3>Historical Information</h3>
        <va-table class="vads-u-margin-top--0">
          <va-table-row slot="headers">
            <span>Benefit</span>
            <span>Recipients</span>
            <span>Total paid (FY {constants.FISCALYEAR})</span>
          </va-table-row>
          <va-table-row>
            <span>Post-9/11 GI Bill</span>
            <span>{formatNumber(institution.p911Recipients)}</span>
            <span>{formatCurrency(institution.p911TuitionFees)}</span>
          </va-table-row>
          {showSchoolContentBasedOnType(type) && (
            <va-table-row>
              <span>Yellow Ribbon</span>
              <span>{formatNumber(institution.p911YrRecipients)}</span>
              <span>{formatCurrency(institution.p911YellowRibbon)}</span>
            </va-table-row>
          )}
        </va-table>
      </div>
    </div>
  );

  return (
    <div className="row veteran-programs-and-support">
      {veteranPrograms}
      {historicalInformation}
    </div>
  );
}
