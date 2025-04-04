import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ALL_BEHAVIOR_CHANGE_DESCRIPTIONS } from '../constants';
import { deleteCombatAnswersModalTitle } from '../content/form0781/behaviorIntroCombatPage';

/**
 * Content displayed in a modal if a user opts into filling out the behavioral questions section of Form 0781, fills out some of that flow, changes their mind, goes back to this page and opts out.
 *
 * The modal will list all behavioral changes the user selected on the BehavioralListPage, before asking if they want to opt out and delete all their selections and any additional info they provided on these behaviors.
 *
 * Because there is a large number of behaviors listed on the BehavioralListPage and we don't have room for them in this modal, we truncate the list to show:
 * - Up to the first four behaviors selected
 * - If there are more than four behaviors selected, displays the first three and a note that says "and N other behavioral changes", where N is the number of remaining changes selected
 */
export const BehaviorIntroCombatPageModalContent = forwardRef(
  ({ formData }, modalRef) => {
    const allBehaviors = {
      ...formData.workBehaviors,
      ...formData.healthBehaviors,
      ...formData.otherBehaviors,
    };

    const selectedBehaviors = Object.keys(allBehaviors).filter(
      k => allBehaviors[k] === true,
    );

    const behaviorDescriptions = selectedBehaviors.map(
      behaviorName => ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorName],
    );

    const describedBehaviorsCount = behaviorDescriptions.length;
    const firstThreeBehaviors = behaviorDescriptions.slice(0, 3);

    const displayRemainingBehaviors = () => {
      if (describedBehaviorsCount === 4) {
        return (
          <li key={4}>
            <b>{behaviorDescriptions[3]}</b>
          </li>
        );
      }

      return (
        <li key={4}>
          And, <b>{describedBehaviorsCount - 3} other behavioral changes</b>
        </li>
      );
    };

    return (
      <>
        <h4
          ref={modalRef}
          className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0"
        >
          {deleteCombatAnswersModalTitle}
        </h4>
        <p>
          <b>What to know: </b>
          If you change to skip questions about behavioral changes, we’ll delete
          information you provided about:
        </p>
        <ul>
          {firstThreeBehaviors.map((behaviorDescription, i) => (
            <li key={i}>
              <b>{behaviorDescription}</b>
            </li>
          ))}

          {behaviorDescriptions.length > 3 && displayRemainingBehaviors()}
        </ul>
        <p>
          <b>Do you want to skip questions about behavioral changes?</b>
        </p>
      </>
    );
  },
);

BehaviorIntroCombatPageModalContent.propTypes = {
  formData: PropTypes.shape({
    workBehaviors: PropTypes.object,
    healthBehaviors: PropTypes.object,
    otherBehaviors: PropTypes.object,
  }),
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default BehaviorIntroCombatPageModalContent;
