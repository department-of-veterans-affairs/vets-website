import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { answerReviewLabel } from '../../helpers';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import { pushToRoute } from '../../utilities/shared';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

const ReviewPage = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = 'Review your answers';
  useEffect(
    () => {
      pageSetup(H1);
    },
    [H1],
  );

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );
  const renderReviewAnswers = () => {
    return Object.keys(SHORT_NAME_MAP).map(shortName => {
      if (formResponses[shortName] === null) {
        return null;
      }

      const reviewLabel = answerReviewLabel(shortName, formResponses);

      return (
        reviewLabel && (
          <div key={shortName} className="answer-review">
            <p className="vads-u-padding-right--2">{reviewLabel}</p>
            <va-link
              disable-analytics
              href="#"
              onClick={() => pushToRoute(shortName, router)}
              name={shortName}
              text="Edit"
              aria-label={reviewLabel}
            />
          </div>
        )
      );
    });
  };
  return (
    <div>
      <h1>{H1}</h1>
      <div className="va-introtext">
        <p>
          If any information below is incorrect, update your answers to get the
          most accurate information regarding your discharge situation.
        </p>
      </div>
      <div className="answers vads-u-margin-bottom--2">
        {renderReviewAnswers()}
      </div>
      <Link to="/results" className="vads-c-action-link--green">
        Get my results
      </Link>
    </div>
  );
};

ReviewPage.propTypes = {
  formResponses: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
