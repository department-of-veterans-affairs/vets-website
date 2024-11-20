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

  const renderBuddyStatements = () => {
    return (
      <li>
        <h3>
          Buddy statements (also called a Statement in Support of Claim or VA
          Form 21-4138)
        </h3>
        <p>
          These are statements from friends or colleagues who knew you during
          your service, or individuals with direct knowledge of your service.
        </p>
        <p>
          The person will need to fill out a Statement in Support of Claim (VA
          Form 21-4138). They may include this information about you in their
          statement:
        </p>
        <ul>
          <li>Your achievements in the military</li>
          <li>Positive relationships you formed in the military</li>
          <li>Why your discharge is unjust or incorrect</li>
          <li>Your positive contributions during your service</li>
        </ul>
        <p>
          The writer should also say in their statement how they know this
          information.{' '}
        </p>
        {/* Intentionally not using <va-link> per Platform Analytics team */}
        <a
          href="http://www.vba.va.gov/pubs/forms/VBA-21-4138-ARE.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get VA Form 21-4138 to download (opens in a new tab)
        </a>
      </li>
    );
  };

  const renderTestaments = () => {
    return (
      <li>
        <h3>Testaments of achievements since your service</h3>
        <p>
          You may want to include this type of evidence with your application,
          especially if your discharge involved issues related to drugs,
          alcohol, or bad behavior. Examples include these types of documents:
        </p>
        <ul>
          <li>A letter from an employer or community leader</li>
          <li>Evidence of successful drug or alcohol treatment</li>
          <li>Copies of degrees or certificates</li>
        </ul>
      </li>
    );
  };

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
        {renderBuddyStatements()}
        {renderTestaments()}
      </ul>
    </va-process-list-item>
  );
};

StepTwo.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default StepTwo;
