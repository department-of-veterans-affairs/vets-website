import React from 'react';
import PropTypes from 'prop-types';

import { getAojDescription } from '../../utils/appeals-helpers';

const Decision = ({ issues, aoj, ama = true, boardDecision = false }) => {
  const allowedIssues = issues
    .filter(issue => issue.disposition === 'allowed')
    .map((issue, i) => <li key={`allowed-${i}`}>{issue.description}</li>);
  const deniedIssues = issues
    .filter(issue => issue.disposition === 'denied')
    .map((issue, i) => <li key={`denied-${i}`}>{issue.description}</li>);
  const remandIssues = issues
    .filter(issue => issue.disposition === 'remand')
    .map((issue, i) => <li key={`remanded-${i}`}>{issue.description}</li>);

  const pluralize = {
    allowed: allowedIssues.length > 1 ? 'issues' : 'issue',
    denied: deniedIssues.length > 1 ? 'issues' : 'issue',
    remand: remandIssues.length > 1 ? 'these issues' : 'this issue',
  };

  const aojDescription = getAojDescription(aoj);

  let allowedBlock = null;
  let deniedBlock = null;
  let remandBlock = null;
  if (allowedIssues.length) {
    allowedBlock = (
      <div data-testid="allowed-items">
        <h5 className="allowed-items">Granted</h5>
        <p>
          The {boardDecision ? 'judge' : 'reviewer'} granted the following{' '}
          {pluralize.allowed}:
        </p>
        <ul>{allowedIssues}</ul>
      </div>
    );
  }
  if (deniedIssues.length) {
    deniedBlock = (
      <div data-testid="denied-items">
        <h5 className="denied-items">Denied</h5>
        <p>
          The {boardDecision ? 'judge' : 'reviewer'} denied the following{' '}
          {pluralize.denied}:
        </p>
        <ul>{deniedIssues}</ul>
      </div>
    );
  }
  if (remandIssues.length) {
    remandBlock = (
      <div data-testid="remand-items">
        <h5 className="remand-items">Remand</h5>
        <p>
          The judge is sending {pluralize.remand} back to the {aojDescription}{' '}
          to{' '}
          {ama
            ? 'correct an error'
            : 'gather more evidence or to fix a mistake before deciding whether to grant or deny'}
          :
        </p>
        <ul>{remandIssues}</ul>
      </div>
    );
  }

  return (
    <div>
      <div className="decision-items">
        {allowedBlock}
        {allowedBlock &&
          boardDecision && (
            <p>
              If this decision changes your disability rating or your
              eligibility for VA benefits, you should see this change made in 1
              to 2 months.
            </p>
          )}
        {deniedBlock}
        {remandBlock}
        {remandBlock &&
          ama && (
            <p>
              After the {aojDescription} has completed the judge’s instructions
              to correct the error, they will make a new decision.
            </p>
          )}
      </div>
      <p>Please see your decision for more details.</p>
    </div>
  );
};

Decision.propTypes = {
  aoj: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired,
  ama: PropTypes.bool,
  boardDecision: PropTypes.bool,
};

export default Decision;
