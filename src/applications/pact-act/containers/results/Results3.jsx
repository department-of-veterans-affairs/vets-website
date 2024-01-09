import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';
import { onResultsBackClick } from '../../utilities/shared';
import { QUESTION_MAP } from '../../constants/question-data-map';
import { updateCurrentPage } from '../../actions';

const Results3 = ({
  formResponses,
  router,
  updateTheCurrentPage,
  viewedIntroPage,
}) => {
  const H1 = QUESTION_MAP.RESULTS_3;

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
      <p>
        Based on your responses, we can’t tell you how the PACT Act may affect
        your eligibility for VA benefits and health care.
      </p>
      <p>
        But you could still be eligible. We encourage you to learn more and
        apply if you think you may be eligible.
      </p>
      <a
        className="vads-u-margin-top--3 vads-u-display--block"
        href="/disability/eligibility/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn about disability compensation eligibility (opens in a new tab)
      </a>
      <a
        className="vads-u-margin-top--3 vads-u-display--block"
        href="/health-care/eligibility/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn about VA health care eligibility (opens in a new tab)
      </a>
      <va-button
        back
        class="vads-u-margin-top--3"
        data-testid="paw-results-back"
        onClick={() =>
          onResultsBackClick(formResponses, router, updateTheCurrentPage)
        }
      />
    </>
  );
};

Results3.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  updateTheCurrentPage: PropTypes.func.isRequired,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

const mapDispatchToProps = {
  updateTheCurrentPage: updateCurrentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Results3);
