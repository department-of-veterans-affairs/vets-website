import { GulfWar1990SummaryDescription } from '../../components/ToxicExposureSummary';
import {
  gulfWar1990PageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': titleWithSubtitle(gulfWar1990PageTitle, 'Summary'),
  'ui:description': GulfWar1990SummaryDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
