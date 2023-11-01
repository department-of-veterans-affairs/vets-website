import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';
import { onResultsBackClick } from '../../utilities/shared';

const Results3 = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = 'Results 3 title TBD';

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
      <h1 data-testid="paw-results-3">{H1}</h1>
      <p>Placeholder content for results page 3</p>
      <va-button
        back
        class="vads-u-margin-top--3"
        data-testid="paw-results-back"
        onClick={() => onResultsBackClick(formResponses, router)}
      />
    </>
  );
};

Results3.propTypes = {
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

export default connect(mapStateToProps)(Results3);
