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
  questionFlowChanged,
  toggleEditMode,
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
    toggleEditMode(true);
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
              <p
                className="vads-u-font-weight--bold vads-u-margin--0"
                data-testid={`label-${shortName}`}
              >
                {reviewLabel}
              </p>
              <va-link
                class="vads-u-padding-left--2"
                href="#"
                onClick={event => {
                  event.preventDefault();
                  onEditAnswerClick(ROUTES[shortName]);
                }}
                name={shortName}
                label={`Edit ${reviewLabel}`}
                text="Edit"
              />
            </div>
            <p>{reviewAnswer}</p>
          </li>
        )
      );
    });
  };

  return (
    <>
      <h1>{H1}</h1>
      {questionFlowChanged && (
        <va-alert-expandable
          class="vads-u-margin-top--4"
          status="info"
          trigger="Your information was updated."
        >
          Changing the answers to one or more questions caused the review screen
          to update with new information.
        </va-alert-expandable>
      )}
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
  toggleEditMode: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
  questionFlowChanged:
    state?.dischargeUpgradeWizard?.duwForm?.questionFlowChanged,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
