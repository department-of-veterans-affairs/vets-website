import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
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
      'served-with': witnessRelationshipToClaimantAnswers.includes(
        SERVED_WITH_CLAIMANT,
      ),
      'family-or-friend': witnessRelationshipToClaimantAnswers.includes(
        FAMILY_OR_FRIEND_OF_CLAIMANT,
      ),
      'coworker-or-supervisor': witnessRelationshipToClaimantAnswers.includes(
        COWORKER_OR_SUPERVISOR_OF_CLAIMANT,
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
