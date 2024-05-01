import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { answerReviewLabel } from '../../helpers';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';
import { navigateBackward } from '../../utilities/page-navigation';

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
          <li key={shortName} className="answer-review">
            {reviewLabel}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              aria-label={reviewLabel}
              className="vads-u-padding-left--2"
              href="#"
              name={shortName}
            >
              Edit
            </a>
          </li>
        )
      );
    });
  };

  return (
    <div>
      <h1>{H1}</h1>
      <div className="va-introtext">
        <p>
          If any information here is wrong, you can change your answers now.
          This will help us give you the most accurate instructions.
        </p>
      </div>
      <ul className="answers vads-u-margin-bottom--2 vads-u-padding--0">
        {renderReviewAnswers()}
      </ul>
      <VaButtonPair
        data-testid="duw-buttonPair"
        onPrimaryClick={() => router.push('/results')}
        onSecondaryClick={() => navigateBackward(router)}
        continue
      />
    </div>
  );
};

ReviewPage.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

export default connect(mapStateToProps)(ReviewPage);
