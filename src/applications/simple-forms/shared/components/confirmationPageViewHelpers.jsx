import React from 'react';
import { isReactComponent } from '~/platform/utilities/ui';

let arrayMap = {};
let nextClass = '';
let reviewEntryKeys = {};

function resetDefaults() {
  arrayMap = {};
  nextClass = '';
  reviewEntryKeys = {};
}

export const getChapterTitle = (chapterFormConfig, formData, formConfig) => {
  const onReviewPage = true;

  let chapterTitle = chapterFormConfig.reviewTitle || chapterFormConfig.title;

  if (typeof chapterTitle === 'function') {
    chapterTitle = chapterTitle({
      formData,
      formConfig,
      onReviewPage,
    });
  }

  return chapterTitle || '';
};

const addMarginIfNewIndex = (arrayKey, index) => {
  if (!arrayMap[arrayKey]) {
    arrayMap[arrayKey] = new Set();
  }

  nextClass =
    // eslint-disable-next-line no-unneeded-ternary
    index > 0 && !arrayMap[arrayKey].has(index) ? 'vads-u-margin-top--4' : '';

  arrayMap[arrayKey].add(index);
};

const generateReviewEntryKey = (key, label, data) => {
  let keyString = `review-${key}-${label}-${data}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // increment if we find a duplicate
  if (!Object.prototype.hasOwnProperty.call(reviewEntryKeys, keyString)) {
    reviewEntryKeys[keyString] = 0;
  } else {
    reviewEntryKeys[keyString] += 1;
    keyString += `-${reviewEntryKeys[keyString]}`;
  }

  return keyString;
};

const reviewEntry = (description, key, uiSchema, label, data) => {
  if (!data) return null;

  const keyString = generateReviewEntryKey(key, label, data);

  const className = nextClass;
  nextClass = '';

  return (
    <li key={keyString} className={className}>
      <div className="vads-u-color--gray">{label}</div>
      <div>{data}</div>
    </li>
  );
};

const fieldEntries = (key, uiSchema, data, schema, schemaFromState, index) => {
  if (data === undefined || data === null) return null;
  if (key.startsWith('view:') || key.startsWith('ui:')) return null;
  if (schema.properties[key] === undefined || !uiSchema) return null;

  const {
    'ui:confirmationField': ConfirmationField,
    'ui:description': description,
    'ui:reviewField': ReviewField,
    'ui:reviewWidget': ReviewWidget,
  } = uiSchema;

  const label =
    uiSchema['ui:title'] || schemaFromState?.properties?.[key].title;

  let refinedData = Array.isArray(data) ? data[index] : data;
  refinedData = typeof data === 'object' ? data[key] : data;

  // long term, make this a switch statement
  if (
    uiSchema['ui:widget'] === 'yesNo' &&
    uiSchema['ui:options']?.labels?.[refinedData ? 'Y' : 'N']
  ) {
    refinedData = uiSchema['ui:options'].labels[refinedData ? 'Y' : 'N'];
  } else if (uiSchema['ui:options']?.labels?.[refinedData]) {
    refinedData = uiSchema['ui:options'].labels[refinedData];
  } else if (
    uiSchema['ui:webComponentField']?.identifier === 'VaCheckboxGroupField'
  ) {
    refinedData = data;
  } else if (
    uiSchema['ui:webComponentField']?.identifier === 'VaCheckboxField'
  ) {
    refinedData = refinedData ? 'Selected' : '';
  }

  const dataType = schema.properties[key].type;

  if (ConfirmationField) {
    if (typeof ConfirmationField === 'function') {
      const {
        data: confirmData = refinedData,
        label: confirmLabel = label,
      } = ConfirmationField({ formData: refinedData });
      return reviewEntry(description, key, uiSchema, confirmLabel, confirmData);
    }

    if (isReactComponent(ConfirmationField)) {
      return <ConfirmationField formData={refinedData} />;
    }

    return null;
  }

  if (
    uiSchema['ui:widget'] === 'date' ||
    ['VaMemorableDateField', 'VaDateField'].includes(
      uiSchema['ui:webComponentField']?.identifier,
    )
  ) {
    const confirmData = new Date(`${refinedData}T00:00:00`).toLocaleDateString(
      'en-us',
      {
        year: 'numeric',
        month: 'long',
        ...(!uiSchema?.['ui:options']?.monthYearOnly && { day: 'numeric' }),
      },
    );
    return reviewEntry(description, key, uiSchema, label, confirmData);
  }

  if (isReactComponent(ReviewField)) {
    const reviewProps = {
      children: { props: { uiSchema, formData: refinedData } },
    };
    return <ReviewField {...reviewProps} />;
  }

  if (isReactComponent(ReviewWidget)) {
    const reviewProps = { name: label, value: refinedData };
    refinedData = <ReviewWidget {...reviewProps} />;
  }

  if (dataType === 'object') {
    return Object.entries(uiSchema).flatMap(([objKey, objVal]) =>
      fieldEntries(
        objKey,
        objVal,
        data[objKey],
        schema.properties[key],
        schemaFromState?.properties?.[key],
      ),
    );
  }

  if (dataType === 'array' && data && data.length) {
    if (index == null) {
      // single page array data
      return data.flatMap((_, i) => {
        return fieldEntries(key, uiSchema, data, schema, schemaFromState, i);
      });
    }

    // multi page array data
    addMarginIfNewIndex(key, index);
    return Object.entries(uiSchema?.items).flatMap(([arrKey, arrVal]) => {
      return fieldEntries(
        arrKey,
        arrVal,
        data[index][arrKey],
        schema.properties[key].items,
        schemaFromState?.properties?.[key].items?.[index],
      );
    });
  }

  return reviewEntry(description, key, uiSchema, label, refinedData);
};

export const buildFields = (chapter, formData, pagesFromState) => {
  return chapter.expandedPages.flatMap(page => {
    return Object.entries(page.uiSchema).flatMap(
      ([uiSchemaKey, uiSchemaValue]) => {
        const data = formData[uiSchemaKey];
        return fieldEntries(
          uiSchemaKey,
          uiSchemaValue,
          data,
          page.schema,
          pagesFromState?.[page.pageKey]?.schema,
          page.index,
        );
      },
    );
  });
};

/**
 * @param {{
 *   chapters: {
 *     name: string,
 *     formConfig: Object,
 *     expandedPages: Object[]
 *   }[],
 *   formData: Object,
 *   formConfig: Object
 * }} props
 * @returns {JSX.Element[]}
 */
export const ChapterSectionCollection = ({
  chapters,
  formData,
  formConfig,
  pagesFromState,
}) => {
  resetDefaults();
  return chapters.map(chapter => {
    const chapterTitle = getChapterTitle(
      chapter.formConfig,
      formData,
      formConfig,
    );
    const fields = buildFields(chapter, formData, pagesFromState).filter(
      item => item != null,
    );
    return (
      fields.length > 0 && (
        <div key={`chapter_${chapter.name}`}>
          <h3>{chapterTitle}</h3>
          <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
            {fields}
          </ul>
        </div>
      )
    );
  });
};
