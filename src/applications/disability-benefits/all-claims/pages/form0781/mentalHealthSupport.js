import {
  mentalHealthSupportPageTitle,
  mentalHealthSupportDescription,
} from '../../content/mentalHealthSupport';
import { titleWithTag, form0781HeadingTag } from '../../content/form0781';

export const uiSchema = {
  'ui:title': titleWithTag(mentalHealthSupportPageTitle, form0781HeadingTag),
  'ui:description': mentalHealthSupportDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
