import ClaimantInformationComponent from './staticClaimantComponent.jsx';
import { claimantStaticInformation } from '../../utilities';

export const schema = claimantStaticInformation;

export const uiSchema = {
  'ui:description': ClaimantInformationComponent,
};
