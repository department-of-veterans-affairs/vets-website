import { textUI } from 'platform/forms-system/src/js/web-component-patterns';
import CountrySelect from '../../components/CountrySelect';
import {
  policeReportLocationPageTitle,
  reportLocationDescription,
} from '../../content/policeReportLocation';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import { arrayBuilderEventPageTitleUI } from '../../utils/form0781';

export default {
  uiSchema: {
    'ui:title': arrayBuilderEventPageTitleUI({
      title: titleWithTag(policeReportLocationPageTitle, form0781HeadingTag),
      editTitle: 'police report location',
    }),
    'ui:description': reportLocationDescription,
    agency: textUI({
      title: 'Name of the agency that issued the report',
    }),
    city: textUI({
      title: 'City',
    }),
    state: textUI({
      title: 'State/Province/Region',
    }),
    township: textUI({
      title: 'Township',
      classNames: 'vads-u-margin-bottom--3',
    }),
    country: {
      'ui:title': 'Country',
      'ui:widget': CountrySelect,
    },
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  },
  schema: {
    type: 'object',
    properties: {
      agency: {
        type: 'string',
      },
      city: {
        type: 'string',
      },
      state: {
        type: 'string',
      },
      township: {
        type: 'string',
      },
      country: {
        type: 'string',
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
