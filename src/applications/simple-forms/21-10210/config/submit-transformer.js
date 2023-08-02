import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  SERVED_WITH_VETERAN,
  FAMILY_OR_FRIEND_OF_VETERAN,
  COWORKER_OR_SUPERVISOR_OF_VETERAN,
  SERVED_WITH_CLAIMANT,
  FAMILY_OR_FRIEND_OF_CLAIMANT,
  COWORKER_OR_SUPERVISOR_OF_CLAIMANT,
} from '../definitions/constants';

export default function transformForSubmit(formConfig, form) {
  let transformedData = JSON.parse(sharedTransformForSubmit(formConfig, form));

  const witnessRelationshipToClaimantAnswers =
    transformedData?.witnessRelationshipToClaimant;

  if (witnessRelationshipToClaimantAnswers) {
    const booleanWitnessRelationshipToClaimant = {
      'served-with':
        witnessRelationshipToClaimantAnswers.includes(SERVED_WITH_CLAIMANT) ||
        witnessRelationshipToClaimantAnswers.includes(SERVED_WITH_VETERAN),
      'family-or-friend':
        witnessRelationshipToClaimantAnswers.includes(
          FAMILY_OR_FRIEND_OF_CLAIMANT,
        ) ||
        witnessRelationshipToClaimantAnswers.includes(
          FAMILY_OR_FRIEND_OF_VETERAN,
        ),
      'coworker-or-supervisor':
        witnessRelationshipToClaimantAnswers.includes(
          COWORKER_OR_SUPERVISOR_OF_CLAIMANT,
        ) ||
        witnessRelationshipToClaimantAnswers.includes(
          COWORKER_OR_SUPERVISOR_OF_VETERAN,
        ),
    };

    transformedData = {
      ...transformedData,
      witnessRelationshipToClaimant: {
        ...booleanWitnessRelationshipToClaimant,
      },
    };
  }

  return JSON.stringify(transformedData);
}
