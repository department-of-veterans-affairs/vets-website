// TODO: this is a placeholder; structure will be added in ticket #97079
import { eventsPageTitle } from '../../content/traumaticEventsIntro';

import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(eventsPageTitle),
};

export const schema = {
  type: 'object',
  properties: {},
};
