import React from 'react';
import PropTypes from 'prop-types';
import BasicLink from '../../shared/components/web-component-wrappers/BasicLink';
import ShowIssuesList from '../../shared/components/ShowIssuesList';
import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <h3 className="vads-u-margin-top--0">
        You’re requesting a Higher-Level Review for these issues:
      </h3>
      {ShowIssuesList({ issues })}
      <p>
        <BasicLink
          disable-analytics
          path={CONTESTABLE_ISSUES_PATH}
          search="?redirect"
          text="Go back to add more issues"
        />
      </p>
    </>
  );
};

SummaryTitle.propTypes = {
  formData: PropTypes.shape({}),
};
