import { GulfWar2001SummaryDescription } from '../../components/ToxicExposureSummary';
import {
  gulfWar2001PageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': titleWithSubtitle(gulfWar2001PageTitle, 'Summary'),
  'ui:description': GulfWar2001SummaryDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
