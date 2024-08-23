import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { answerReviewLabel } from '../../helpers';
import {
  SHORT_NAME_MAP,
  REVIEW_LABEL_MAP,
} from '../../constants/question-data-map';
import { updateEditMode, updateRouteMap } from '../../actions';
import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

const ReviewPage = ({
  formResponses,
  router,
  viewedIntroPage,
  questionFlowChanged,
  toggleEditMode,
  routeMap,
  setRouteMap,
}) => {
  const H1 = 'Review your answers';
  // console.log(routeMap)

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

  const onBackClick = () => {
    const previousRoute = routeMap[routeMap.length - 2];
    setRouteMap(routeMap.slice(0, -1));
    router.push(previousRoute);
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
            className="vads-u-margin-bottom--0 vads-u-padding-y--3 answer-review-box"
          >
            <div className="answer-review-label">
              <p className="vads-u-margin--0 answer-review">
                <span className="vads-u-font-weight--bold">{reviewLabel}</span>
                <span data-testid={`answer-${shortName}`}>{reviewAnswer}</span>
              </p>
              <va-link
                class="vads-u-padding-left--2"
                data-testid="duw-edit-link"
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
        onSecondaryClick={onBackClick}
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
  questionFlowChanged: PropTypes.bool.isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  routeMap: PropTypes.array.isRequired,
};

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  setRouteMap: updateRouteMap,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
  questionFlowChanged:
    state?.dischargeUpgradeWizard?.duwForm?.questionFlowChanged,
  routeMap: state?.dischargeUpgradeWizard?.duwForm?.routeMap,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
