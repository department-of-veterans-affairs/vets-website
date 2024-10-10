import React from 'react';
import PropTypes from 'prop-types';
import { determineBoardObj, stepHeaderLevel } from '../../../helpers';

import {
  SHORT_NAME_MAP,
  RESPONSES,
} from '../../../constants/question-data-map';
import { DRB } from '../../../constants';

const renderMedicalRecordInfo = formResponses => {
  if (
    [
      RESPONSES.REASON_PTSD,
      RESPONSES.REASON_TBI,
      RESPONSES.REASON_SEXUAL_ASSAULT,
    ].indexOf(formResponses[SHORT_NAME_MAP.REASON]) > -1
  ) {
    let requestQuestion;
    if (parseInt(formResponses[SHORT_NAME_MAP.DISCHARGE_YEAR], 10) >= 1992) {
      requestQuestion = (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.archives.gov/st-louis/military-personnel/ompf-background.html"
        >
          Find out how to request your military medical records (opens in a new
          tab).
        </a>
      );
    } else {
      requestQuestion = (
        <span>
          Your <strong>military medical records</strong> will be included with
          the VA medical records you request.
        </span>
      );
    }

    return (
      <li>
        <strong>Medical Records</strong>: In most cases, the Board won’t have
        easy access to your medical records, so you should submit any relevant
        documents yourself.
        <ul>
          <li>
            You can request your <strong>VA medical records</strong> by
            submitting VA Form 10-5345 to your local VA Medical Center.
            <br />
            {/* Intentionally not using <va-link> per Platform Analytics team */}
            <a
              download
              href="https://www.va.gov/find-forms/about-form-10-5345/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <va-icon
                icon="file_download"
                size={3}
                className="vads-u-margin-top--0p5 vads-u-padding-right--1"
              />
              Download VA Form 10-5345 (opens in a new tab)
            </a>
          </li>
          <li>{requestQuestion}</li>
          <li>
            You can also submit{' '}
            <strong>medical records from a private practice doctor</strong>
            —contact your doctor’s office to get the records you need.
          </li>
        </ul>
      </li>
    );
  }
  return null;
};

const StepTwo = ({ formResponses }) => {
  if (
    formResponses[SHORT_NAME_MAP.REASON] ===
    RESPONSES.REASON_DD215_UPDATE_TO_DD214
  ) {
    return null;
  }

  const boardToSubmit = determineBoardObj(formResponses);
  let militaryRecordInfo;
  if (parseInt(formResponses[SHORT_NAME_MAP.DISCHARGE_YEAR], 10) >= 1997) {
    militaryRecordInfo = (
      <p>
        You can get your complete military personnel record (your Official
        Military Personnel File, or OMPF) online.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.archives.gov/veterans/military-service-records"
        >
          Get your military personnel record (opens in a new tab).
        </a>
      </p>
    );
  } else {
    militaryRecordInfo = (
      <p>
        You can make a request online or by mail to get your complete military
        personnel record (your Official Military Personnel File, or OMPF) mailed
        to you. If at first you get only some of the available records, you
        should request the full set of records.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.archives.gov/veterans/military-service-records"
        >
          Get your military personnel record (opens in a new tab).
        </a>
      </p>
    );
  }

  let specificTypeInstruction;
  switch (formResponses[SHORT_NAME_MAP.REASON]) {
    case RESPONSES.REASON_PTSD:
      specificTypeInstruction =
        'you suffered from symptoms of PTSD or mental health conditions while in the service';
      break;
    case RESPONSES.REASON_TBI:
      specificTypeInstruction =
        'you suffered from symptoms of TBI while in the service';
      break;
    case RESPONSES.REASON_SEXUAL_ORIENTATION:
      if (
        formResponses[SHORT_NAME_MAP.DISCHARGE_TYPE] ===
        RESPONSES.DISCHARGE_DISHONORABLE
      ) {
        specificTypeInstruction =
          'your character of discharge was due only to your sexual orientation and not to bad conduct';
      }
      break;
    case RESPONSES.REASON_SEXUAL_ASSAULT:
      specificTypeInstruction =
        'the conduct that led to your discharge stemmed from military sexual assault and not other factors';
      break;
    default:
  }

  const level = stepHeaderLevel(formResponses);

  return (
    <va-process-list-item header="Add supporting information" level={level}>
      <p>
        To improve your chances of success, also include as many of the below
        documents as you can.
      </p>
      <ul>
        <li>
          <strong>Military Record</strong>: In most cases, your records will be
          important to the Board’s decision. The Board may not have easy access
          to your military records, especially if you served many years ago, so
          we strongly recommend you submit any relevant documents yourself.{' '}
          {boardToSubmit.abbr !== DRB ? (
            <span>
              Note that the {boardToSubmit.abbr} is required to help you collect
              evidence if you can demonstrate you made a reasonable attempt to
              get your records but you didn’t succeed.
            </span>
          ) : null}{' '}
          {militaryRecordInfo}{' '}
          {specificTypeInstruction && (
            <p>
              Remember, you should try to prove that {specificTypeInstruction}.
              Submit any documents from this record that help support your case
              for a discharge upgrade.
            </p>
          )}
        </li>
        {renderMedicalRecordInfo(formResponses)}
        <li>
          <strong>“Buddy Statements” or Other References From Service</strong>:
          On top of military records, you can attach statements from friends or
          colleagues you knew while in the service, or other individuals with
          direct knowledge of your time in the military. The content of the
          letter is more important than who it comes from, as long as the
          writer’s opinion is credible and they know you well. The writer should
          state how they learned about the facts or opinions they’re writing
          about. The letters may include statements about your achievements in
          the military, positive relationships you formed in the military, why
          your discharge may be unjust or incorrect, and your good deeds during
          that time.
        </li>
        <li>
          <strong>Testaments of Achievements Since Service</strong>: You may
          decide to add information about what you have achieved in your life
          since your discharge, particularly if your discharge involved any
          issues related to drugs, alcohol, or bad behavior. This can be in the
          form of a letter from an employer or community leader, evidence of
          successful drug treatment, or copies of certificates and degrees. The
          DoD will soon release more specific information about achievements
          since service, but, for now, add any achievements you would like to
          call out.
        </li>
      </ul>
    </va-process-list-item>
  );
};

StepTwo.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default StepTwo;
