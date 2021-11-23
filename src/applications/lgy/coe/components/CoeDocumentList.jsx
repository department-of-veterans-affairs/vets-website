import React from 'react';

const documents = [
  {
    id: 0,
    title: 'a document',
    type: 'PDF',
    timestamp: 'January 12, 2021',
  },
  {
    id: 1,
    title: 'another document',
    type: 'PDF',
    timestamp: 'February 11, 2021',
  },
];

export const CoeDocumentList = () => {
  return (
    <>
      <h2 className="vads-u-margin-bottom--0">
        You have letters about your COE request
      </h2>
      <p className="vads-u-border-color--gray-lighter vads-u-border-bottom--1px vads-u-margin--0 vads-u-padding-y--4">
        We’ve emailed you notification letters about your COE request. Please
        read these and follow the steps they outline. You may need to take
        action before we can make a final decision.
      </p>
      {documents.map((document, key) => {
        return (
          <div
            key={key}
            className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-margin-top--4 vads-u-padding-bottom--4"
          >
            <h3 className="vads-u-font-family--serif vads-u-margin--0">
              {document.title}
            </h3>
            <p className="vads-u-margin-y--1p5">
              Date Sent: {document.timestamp}
            </p>
            <a className="vads-u-margin--0" href="#">
              <i className="fas fa-download vads-u-padding-right--1" />
              {document.title} {document.type}
            </a>
          </div>
        );
      })}
    </>
  );
};
