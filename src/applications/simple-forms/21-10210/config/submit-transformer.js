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
        witnessRelationshipToClaimantAnswers[SERVED_WITH_CLAIMANT] ||
        witnessRelationshipToClaimantAnswers[SERVED_WITH_VETERAN] ||
        false,
      'family-or-friend':
        witnessRelationshipToClaimantAnswers[FAMILY_OR_FRIEND_OF_CLAIMANT] ||
        witnessRelationshipToClaimantAnswers[FAMILY_OR_FRIEND_OF_VETERAN] ||
        false,
      'coworker-or-supervisor':
        witnessRelationshipToClaimantAnswers[
          COWORKER_OR_SUPERVISOR_OF_CLAIMANT
        ] ||
        witnessRelationshipToClaimantAnswers[
          COWORKER_OR_SUPERVISOR_OF_VETERAN
        ] ||
        false,
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
