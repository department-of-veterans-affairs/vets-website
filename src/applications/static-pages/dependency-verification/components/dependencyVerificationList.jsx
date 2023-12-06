import React from 'react';

const DependencyVerificationList = ({ dependents }) => {
  return (
    <div className="vads-u-margin-top--4">
      {dependents.map((dependent, index) => {
        return (
          <div
            key={index}
            className="vads-l-row vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding--2"
          >
            <h2 className="vads-u-margin--0 vads-u-font-size--h5">
              {dependent.fullName}
            </h2>
            <p className="vads-l-col--12 vads-u-margin-bottom--0">
              {dependent.dependencyStatusTypeDescription}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DependencyVerificationList;
