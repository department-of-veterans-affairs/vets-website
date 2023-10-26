import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';

const Results1Page2 = ({ router, viewedIntroPage }) => {
  const H1 = 'Results 1, page 2 title TBD';

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
      <h1 data-testid="paw-results-1-p2">{H1}</h1>
      <p>Placeholder content for results 1, page 2</p>
      <va-button
        back
        class="vads-u-margin-top--3"
        data-testid="paw-results-back"
        onClick={() => router.push(ROUTES.RESULTS_1_P1)}
      />
    </>
  );
};

Results1Page2.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

export default connect(mapStateToProps)(Results1Page2);
