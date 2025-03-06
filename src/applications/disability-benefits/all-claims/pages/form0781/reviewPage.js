import { titleWithTag, form0781HeadingTag } from '../../content/form0781';
import {
  reviewPageTitle,
  reviewPageDescription,
} from '../../content/form0781/reviewPage';

export const uiSchema = {
  'ui:title': titleWithTag(reviewPageTitle, form0781HeadingTag),
  'ui:description': reviewPageDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
