import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import ShowIssuesList from '../../shared/components/ShowIssuesList';

import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

const SummaryTitle = ({ formData, router }) => {
  const issues = getSelected(formData);

  const handleRouteChange = event => {
    event.preventDefault();
    router.push({
      pathname: CONTESTABLE_ISSUES_PATH,
      search: '?redirect',
    });
  };

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        These are the issues you’re asking the Board to review.
      </h3>
      {ShowIssuesList({ issues })}
      <p>
        <VaLink onClick={handleRouteChange} text="Go back to add more issues" />
      </p>
    </>
  );
};

SummaryTitle.propTypes = {
  formData: PropTypes.shape({}),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(SummaryTitle);
