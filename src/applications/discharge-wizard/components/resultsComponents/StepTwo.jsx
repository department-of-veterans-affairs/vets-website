import React from 'react';
import PropTypes from 'prop-types';
import { determineBoardObj, renderMedicalRecordInfo } from '../../helpers';

import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';
import { DRB } from '../../constants';

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
          Buddy statements or Statement in Support of Claim (VA Form 21-4138)
        </h3>
        <p>
          Buddy statements are completed by friends or colleagues who knew you
          during your service. They can also be completed by people with direct
          knowledge of your service.
        </p>
        <p>
          This person should fill out a Statement in Support of Claim (VA Form
          21-4138). Here’s what they may include in their statement:
        </p>
        <ul>
          <li>Your achievements in the military</li>
          <li>Positive relationships you formed in the military</li>
          <li>Why your discharge is unjust or incorrect</li>
          <li>Your positive contributions during your service</li>
        </ul>
        <p>They should also say how they know this information about you.</p>
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
        <h3>Achievements since your service</h3>
        <p>
          Including documentation on your achievements since service may help
          your case. It may help especially if your discharge was related to
          drug, alcohol, substance use, or other behaviors. Here are some
          examples you may want to share:
        </p>
        <ul>
          <li>A letter from an employer or community leader</li>
          <li>Evidence of successful drug or alcohol treatment</li>
          <li>Copies of degrees or certificates</li>
        </ul>
      </li>
    );
  };

  return (
    <va-process-list-item header="Gather supporting information" level="2">
      <p>
        You’ll help your case by providing as much supporting documentation as
        you can.
      </p>
      <ul>
        <li>
          <h3>Military Record</h3> In most cases, your records will be important
          to the Board’s decision. The Board may not have easy access to your
          military records, especially if you served many years ago, so we
          strongly recommend you submit any relevant documents yourself.{' '}
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
