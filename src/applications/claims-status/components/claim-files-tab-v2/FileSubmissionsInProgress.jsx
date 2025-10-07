import PropTypes from 'prop-types';
import React from 'react';

const generateInProgressDocs = evidenceSubmissions => {
  return evidenceSubmissions || []; // TODO: add logic to filter out unnecessary fields
};

const getSortedInProgressItems = evidenceSubmissions => {
  const items = generateInProgressDocs(evidenceSubmissions);

  return items.sort((item1, item2) => {
    return new Date(item2.createdAt) - new Date(item1.createdAt);
  });
};

const FileSubmissionsInProgress = ({ claim }) => {
  const { evidenceSubmissions, supportingDocuments } = claim.attributes;

  const numSupportingDocuments = supportingDocuments.length;
  const currentPageItems = getSortedInProgressItems(evidenceSubmissions);

  return (
    <div
      className="file-submissions-in-progress-container"
      data-testid="file-submissions-in-progress"
    >
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        File submissions in progress
      </h3>
      <p>
        Documents you submitted for review using this tool, or the VA: Health
        and Benefits mobile app, that we haven’t received yet. It can take up to
        2 days for us to receive them.
      </p>
      <div data-testid="file-submissions-in-progress-cards">
        {currentPageItems.length === 0 ? (
          <div>
            {numSupportingDocuments === 0 ? (
              <p>You don’t have any file submissions in progress.</p>
            ) : (
              <p>We’ve received all the files you’ve uploaded.</p>
            )}
          </div>
        ) : (
          <p>Placeholder for {currentPageItems.length} in progress items</p>
        )}
      </div>
    </div>
  );
};

FileSubmissionsInProgress.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default FileSubmissionsInProgress;
