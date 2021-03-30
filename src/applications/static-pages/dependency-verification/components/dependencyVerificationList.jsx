import React from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const NOTONAWARD = 'NAWDDEP';

const DependencyVerificationList = ({ dependents }) => {
  return (
    <div className="vads-u-margin-top--4">
      {dependents
        .filter(dependent => {
          return (
            dependent.dependencyStatusType &&
            dependent.dependencyStatusType !== NOTONAWARD
          );
        })
        .map((dependent, index) => {
          return (
            <div
              key={index}
              className="vads-l-row vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding--2"
            >
              <h3 className="vads-u-margin--0">{dependent.fullName}</h3>
              <p className="vads-l-col--12 vads-u-margin-y--1">
                <strong>Relationship: </strong>
                {dependent.dependencyStatusTypeDescription}
              </p>
              <p className="vads-l-col--12 vads-u-margin--0">
                <strong>Date of birth: </strong>{' '}
                {format(parseISO(dependent.birthdayDate), 'MMMM d, yyyy')}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default DependencyVerificationList;
