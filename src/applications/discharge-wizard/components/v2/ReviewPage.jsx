import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { answerReviewLabel } from '../../helpers';
import {
  SHORT_NAME_MAP,
  REVIEW_LABEL_MAP,
} from '../../constants/question-data-map';
import { updateEditMode } from '../../actions';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';
import { navigateBackward } from '../../utilities/page-navigation';

const ReviewPage = ({
  formResponses,
  router,
  viewedIntroPage,
  setEditMode,
}) => {
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

  const onEditAnswerClick = route => {
    setEditMode(true);
    router.push(route);
  };

  const renderReviewAnswers = () => {
    return Object.keys(SHORT_NAME_MAP).map(shortName => {
      if (formResponses[shortName] === null) {
        return null;
      }
      const reviewLabel = REVIEW_LABEL_MAP[shortName];
      const reviewAnswer = answerReviewLabel(shortName, formResponses);

      return (
        reviewLabel && (
          <li
            key={shortName}
            className="vads-u-margin-bottom--0 vads-u-padding-y--3 vads-u-padding-x--1p5 answer-review-box"
          >
            <div className="answer-review-label">
              <div className="vads-u-font-weight--bold">{reviewLabel}</div>
              <va-link
                class="hydrated vads-u-padding-left--2"
                onClick={() => onEditAnswerClick(ROUTES[shortName])}
                name={shortName}
                text="Edit"
              />
            </div>
            <div>{reviewAnswer}</div>
          </li>
        )
      );
    });
  };

  return (
    <>
      <h1>{H1}</h1>
      <va-alert class="vads-u-margin-top--4" status="info">
        <h4 className="usa-alert-heading">
          You can apply for VA benefits using your honorable characterization.
        </h4>
      </va-alert>
      <p className="vads-u-margin-bottom--4 vads-u-margin-top--0">
        If any information here is wrong, you can change your answers now. This
        will help us give you the most accurate instructions.
      </p>
      <ul className="answers vads-u-margin-bottom--2 vads-u-padding--0">
        {renderReviewAnswers()}
      </ul>
      <VaButtonPair
        data-testid="duw-buttonPair"
        class="small-screen:vads-u-margin-x--0p5"
        onPrimaryClick={() => router.push('/results')}
        onSecondaryClick={() => navigateBackward(router)}
        continue
      />
    </>
  );
};

ReviewPage.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  setEditMode: updateEditMode,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
