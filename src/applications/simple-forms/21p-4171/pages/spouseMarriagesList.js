import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  fullNameUI,
  fullNameSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const spouseMarriagesOptions = {
  arrayPath: 'spouse.otherMarriages',
  nounSingular: 'marriage',
  nounPlural: 'marriages',
  required: false,
  maxItems: 10,
  isItemIncomplete: item =>
    !item?.toWhomMarried?.first ||
    !item?.toWhomMarried?.last ||
    !item?.marriageDate ||
    !item?.marriageType ||
    !item?.marriagePlace ||
    !item?.endDate ||
    !item?.endPlace ||
    !item?.howEnded,
  text: {
    getItemName: item => {
      const name = item?.toWhomMarried;
      if (!name) return 'Unknown spouse';
      return `${name.first || ''} ${name.middle || ''} ${name.last || ''}`
        .trim()
        .replace(/\s+/g, ' ');
    },
    cardDescription: item => {
      const date = item?.marriageDate || 'Unknown date';
      const type = item?.marriageType || 'Unknown type';
      return `${type} marriage on ${date}`;
    },
  },
};

export const spouseMarriagesListPages = arrayBuilderPages(
  spouseMarriagesOptions,
  pageBuilder => ({
    spouseMarriagesSummary: pageBuilder.summaryPage({
      title: 'Does the spouse have another marriage to add?',
      path: 'spouse-list-summary',
      uiSchema: {
        'view:hasMarriages': arrayBuilderYesNoUI(spouseMarriagesOptions, {
          title: 'Does the spouse have another marriage to add?',
          labels: {
            Y: 'Yes, I have another marriage to add',
            N: "No, I don't have another marriage to add",
          },
        }),
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasMarriages': arrayBuilderYesNoSchema,
        },
        required: ['view:hasMarriages'],
      },
    }),
    spouseMarriageSpouseName: pageBuilder.itemPage({
      title: 'Marriage - Spouse name',
      path: 'spouse-list/:index/spouse-name',
      uiSchema: {
        ...arrayBuilderItemFirstPageTitleUI({
          title: 'Marriage - Spouse name',
          nounSingular: spouseMarriagesOptions.nounSingular,
        }),
        toWhomMarried: fullNameUI(),
      },
      schema: {
        type: 'object',
        properties: {
          toWhomMarried: fullNameSchema,
        },
        required: ['toWhomMarried'],
      },
    }),
    spouseMarriageType: pageBuilder.itemPage({
      title: 'Marriage - Type',
      path: 'spouse-list/:index/type',
      uiSchema: {
        marriageType: textUI({
          title: 'Type of marriage',
          hint: 'Ceremonial, etc.',
        }),
      },
      schema: {
        type: 'object',
        properties: {
          marriageType: {
            ...textSchema,
            maxLength: 50,
          },
        },
        required: ['marriageType'],
      },
    }),
    spouseMarriageDate: pageBuilder.itemPage({
      title: 'Marriage - Date',
      path: 'spouse-list/:index/date',
      uiSchema: {
        marriageDate: currentOrPastDateUI('Date of marriage'),
      },
      schema: {
        type: 'object',
        properties: {
          marriageDate: currentOrPastDateSchema,
        },
        required: ['marriageDate'],
      },
    }),
    spouseMarriagePlace: pageBuilder.itemPage({
      title: 'Marriage - Place',
      path: 'spouse-list/:index/place',
      uiSchema: {
        marriagePlace: textUI('Place of marriage'),
      },
      schema: {
        type: 'object',
        properties: {
          marriagePlace: {
            ...textSchema,
            maxLength: 100,
          },
        },
        required: ['marriagePlace'],
      },
    }),
    spouseMarriageEndDate: pageBuilder.itemPage({
      title: 'Marriage - End date',
      path: 'spouse-list/:index/end-date',
      uiSchema: {
        endDate: currentOrPastDateUI('Date marriage ended'),
      },
      schema: {
        type: 'object',
        properties: {
          endDate: currentOrPastDateSchema,
        },
        required: ['endDate'],
      },
    }),
    spouseMarriageEndPlace: pageBuilder.itemPage({
      title: 'Marriage - End place',
      path: 'spouse-list/:index/end-place',
      uiSchema: {
        endPlace: textUI('Place marriage ended'),
      },
      schema: {
        type: 'object',
        properties: {
          endPlace: {
            ...textSchema,
            maxLength: 100,
          },
        },
        required: ['endPlace'],
      },
    }),
    spouseMarriageHowEnded: pageBuilder.itemPage({
      title: 'Marriage - How it ended',
      path: 'spouse-list/:index/how-ended',
      uiSchema: {
        howEnded: radioUI({
          title: 'How marriage ended',
          labels: {
            death: 'Death',
            divorce: 'Divorce',
            other: 'Other',
          },
        }),
      },
      schema: {
        type: 'object',
        properties: {
          howEnded: radioSchema(['death', 'divorce', 'other']),
        },
        required: ['howEnded'],
      },
    }),
  }),
);
