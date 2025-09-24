import { HerbicideSummaryDescription } from '../../components/ToxicExposureSummary';
import {
  herbicidePageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': titleWithSubtitle(herbicidePageTitle, 'Summary'),
  'ui:description': HerbicideSummaryDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
