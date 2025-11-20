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

const veteranMarriagesOptions = {
  arrayPath: 'veteran.otherMarriages',
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

export const veteranMarriagesListPages = arrayBuilderPages(
  veteranMarriagesOptions,
  pageBuilder => ({
    veteranMarriagesSummary: pageBuilder.summaryPage({
      title: 'Does the Veteran have another marriage to add?',
      path: 'veteran-list-summary',
      uiSchema: {
        'view:hasMarriages': arrayBuilderYesNoUI(veteranMarriagesOptions, {
          title: 'Does the Veteran have another marriage to add?',
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
    veteranMarriageSpouseName: pageBuilder.itemPage({
      title: 'Marriage - Spouse name',
      path: 'veteran-list/:index/spouse-name',
      uiSchema: {
        ...arrayBuilderItemFirstPageTitleUI({
          title: 'Marriage - Spouse name',
          nounSingular: veteranMarriagesOptions.nounSingular,
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
    veteranMarriageType: pageBuilder.itemPage({
      title: 'Marriage - Type',
      path: 'veteran-list/:index/type',
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
    veteranMarriageDate: pageBuilder.itemPage({
      title: 'Marriage - Date',
      path: 'veteran-list/:index/date',
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
    veteranMarriagePlace: pageBuilder.itemPage({
      title: 'Marriage - Place',
      path: 'veteran-list/:index/place',
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
    veteranMarriageEndDate: pageBuilder.itemPage({
      title: 'Marriage - End date',
      path: 'veteran-list/:index/end-date',
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
    veteranMarriageEndPlace: pageBuilder.itemPage({
      title: 'Marriage - End place',
      path: 'veteran-list/:index/end-place',
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
    veteranMarriageHowEnded: pageBuilder.itemPage({
      title: 'Marriage - How it ended',
      path: 'veteran-list/:index/how-ended',
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
