import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';
import { onResultsBackClick } from '../../utilities/shared';

const Results1Page1 = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = 'Results 1, page 1 title TBD';

  useEffect(() => {
    pageSetup(H1);
  });

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return (
    <>
      <h1 data-testid="paw-results-1-p1">{H1}</h1>
      <p>Placeholder content for results 1, page 1</p>
      <Link
        className="vads-c-action-link--green"
        data-testid="paw-results-1-p1-continue"
        to={ROUTES.RESULTS_1_P2}
      >
        Next page
      </Link>
      <va-button
        back
        class="vads-u-margin-top--3 vads-u-display--block"
        data-testid="paw-results-back"
        onClick={() => onResultsBackClick(formResponses, router)}
      />
    </>
  );
};

Results1Page1.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

export default connect(mapStateToProps)(Results1Page1);
