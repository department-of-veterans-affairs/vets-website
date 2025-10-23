import { AdditionalExposuresSummaryDescription } from '../../components/ToxicExposureSummary';
import {
  additionalExposuresPageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': titleWithSubtitle(additionalExposuresPageTitle, 'Summary'),
  'ui:description': AdditionalExposuresSummaryDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
