import React from 'react';
import PropTypes from 'prop-types';

const SpouseDependentListItem = () => (
  <li>
    A spouse, unless you live apart, are estranged, and don’t help pay for their
    support. We recognize same-sex and common-law marriages
  </li>
);

const ChildCriteriaList = () => (
  <ul>
    <li>
      They’re under 18 years old, <strong>or</strong>
    </li>
    <li>
      They’re between the ages of 18 and 23 years old and were enrolled in
      school full time, <strong>or</strong>
    </li>
    <li>
      They’re living with a permanent disability that happened before they
      turned 18 years old
    </li>
  </ul>
);

export const DependentDescription = ({ claimantType }) => {
  let content = null;

  switch (claimantType) {
    case 'VETERAN':
      content = (
        <div>
          <ul className="vads-u-margin-top--0">
            <SpouseDependentListItem />
            <li>
              An unmarried child (including adopted children or stepchildren)
            </li>
            <li>
              If your dependent is an unmarried child, one of these must also be
              true:
              <ChildCriteriaList />
            </li>
          </ul>
          <p>
            <strong>Note:</strong> A natural or adoptive parent has custody of a
            child unless custody is legally removed. For pension purposes, a
            child who has attained age 18 remains in the custody of the person
            who had custody before the child turned 18 unless custody is legally
            removed.
          </p>
        </div>
      );
      break;
    case 'SPOUSE':
      content = (
        <div>
          <p className="vads-u-margin-top--0">
            An unmarried child (including an adopted child or stepchild) who you
            support and who meets one of the requirements listed below:
          </p>
          <ChildCriteriaList />
        </div>
      );
      break;
    case 'CUSTODIAN':
      content = (
        <div>
          <ul className="vads-u-margin-top--0">
            <SpouseDependentListItem />
            <li>
              The Veteran’s surviving unmarried child/children who you support
              and who meets one of the requirements listed below:
              <ChildCriteriaList />
            </li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            <strong>Note:</strong> If the child’s custodian is an institution,
            income and assets do not need to be reported.
          </p>
        </div>
      );
      break;
    case 'PARENT':
      content = (
        <p className="vads-u-margin-top--0">
          A spouse, unless you live apart, are estranged, and don’t help pay for
          their support. We recognize same-sex and common-law marriages
        </p>
      );
      break;
    default:
      content = null;
  }

  if (!content) return null;

  return (
    <va-additional-info trigger="Who we consider a dependent">
      {content}
    </va-additional-info>
  );
};

DependentDescription.propTypes = {
  claimantType: PropTypes.oneOf(['VETERAN', 'SPOUSE', 'CUSTODIAN', 'PARENT'])
    .isRequired,
};
