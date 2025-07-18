import React from 'react';
import { PropTypes } from 'prop-types';
import { isReactComponent } from '~/platform/utilities/ui';
import {
  createPageListByChapter,
  getActiveChapters,
  getActiveExpandedPages,
} from '~/platform/forms-system/exportsFile';
import { useSelector } from 'react-redux';
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import classNames from 'classnames';

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

export const reviewEntry = (description, key, uiSchema, label, data) => {
  if (!data && data !== 0 && data !== false) return null;

  const keyString = generateReviewEntryKey(key, label, data);

  const className = nextClass;
  nextClass = '';

  // Ensure data is renderable - use safe stringify
  const renderableData =
    typeof data === 'object' && data !== null && !Array.isArray(data)
      ? safeStringify(data)
      : data;

  // for multiple lines of data under one label
  if (Array.isArray(data)) {
    return (
      <li key={keyString} className={className}>
        <div className="vads-u-color--gray">{label}</div>
        {data.map((item, index) => {
          const renderableItem =
            typeof item === 'object' && item !== null
              ? safeStringify(item)
              : item;
          return <div key={`${keyString}-${index}`}>{renderableItem}</div>;
        })}
      </li>
    );
  }

  return (
    <li key={keyString} className={className}>
      <div className="vads-u-color--gray">{label}</div>
      <div>{renderableData}</div>
    </li>
  );
};

const fieldEntries = (key, uiSchema, data, schema, schemaFromState, index) => {
  if (data === undefined || data === null) return null;
  if (key.startsWith('view:') || key.startsWith('ui:')) return null;

  let schemaPropertiesKey = schema.properties?.[key];
  if (schemaPropertiesKey?.$ref) {
    schemaPropertiesKey = schemaFromState.properties?.[key];
  }
  if (schemaPropertiesKey === undefined || !uiSchema) return null;

  const {
    'ui:confirmationField': ConfirmationField,
    'ui:description': description,
    'ui:reviewField': ReviewField,
    'ui:reviewWidget': ReviewWidget,
  } = uiSchema;

  const label =
    uiSchema['ui:title'] ||
    schemaFromState?.properties?.[key]?.title ||
    schema?.properties?.[key]?.title;

  let refinedData = Array.isArray(data) ? data[index] : data;
  refinedData = typeof data === 'object' ? data[key] : data;

  // Handle object data - convert to string if it's an object
  if (
    typeof refinedData === 'object' &&
    refinedData !== null &&
    !Array.isArray(refinedData)
  ) {
    // Check if it has specific keys that indicate it's form data
    if (
      refinedData.none !== undefined ||
      Object.keys(refinedData).length === 1
    ) {
      // Handle special cases like {none: true} or single-key objects
      const objectKey = Object.keys(refinedData)[0];
      refinedData =
        refinedData[objectKey] === true
          ? objectKey
          : String(refinedData[objectKey]);
    } else {
      // Use safe stringify instead of JSON.stringify
      refinedData = safeStringify(refinedData);
    }
  }

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
    // Handle checkbox group data
    if (typeof data === 'object' && data !== null) {
      refinedData =
        Object.keys(data)
          .filter(k => data[k])
          .join(', ') || 'None selected';
    }
  } else if (
    uiSchema['ui:webComponentField']?.identifier === 'VaCheckboxField'
  ) {
    refinedData = refinedData ? 'Selected' : 'Not selected';
  }

  const dataType = schemaPropertiesKey.type;

  if (ConfirmationField) {
    if (typeof ConfirmationField === 'function') {
      const {
        data: confirmData = refinedData,
        label: confirmLabel = label,
      } = ConfirmationField({
        formData: refinedData || data,
      });
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
        schemaPropertiesKey,
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
        schemaPropertiesKey.items,
        schemaFromState?.properties?.[key].items?.[index],
      );
    });
  }

  return reviewEntry(description, key, uiSchema, label, refinedData);
};

export const buildFields = (chapter, formData, pagesFromState) => {
  return chapter.expandedPages.flatMap(page => {
    // page level ui:confirmationField
    const ConfirmationField = page.uiSchema['ui:confirmationField'];

    if (ConfirmationField) {
      if (isReactComponent(ConfirmationField)) {
        return <ConfirmationField formData={formData} />;
      }

      throw new Error(
        'Page level ui:confirmationField must be a React component',
      );
    }

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

const useChapterSectionCollection = formConfig => {
  const form = useSelector(state => state.form);
  const formData = form.data;

  // Add this debugging to see what's causing the issue - but safely
  console.log('typeof formData:', typeof formData);
  console.log('formData keys:', formData ? Object.keys(formData) : 'no data');

  // Check for problematic data structures - but avoid circular references
  if (formData) {
    Object.entries(formData).forEach(([key, value]) => {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        console.log(`Object found at key "${key}":`, safeStringify(value));
      }
    });
  }

  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);
  const pagesFromState = form.pages;
  console.log('form from selector - cn', chapterNames);
  console.log('formData from selector - pbc', pagesByChapter);
  console.log('formData from selector - pfs', pagesFromState);

  const chapters = useSelector(state =>
    chapterNames.map(chapterName => {
      const pages = pagesByChapter[chapterName];
      const expandedPages = getActiveExpandedPages(pages, formData);
      const chapterFormConfig = formConfig.chapters[chapterName];

      return {
        expandedPages: expandedPages.map(
          page =>
            page.appStateSelector
              ? { ...page, appStateData: page.appStateSelector(state) }
              : page,
        ),
        formConfig: chapterFormConfig,
        name: chapterName,
      };
    }),
  );

  return { chapters, formData, pagesFromState };
};

/**
 * @param {{
 *   formConfig: {
 *    chapters: Record<string, any>
 *   },
 *   header?: string
 *   collapsible?: boolean
 *   className?: string
 * }} props
 * @returns {JSX.Element[]}
 */

// Copied form ChapterSectionCollection.jsx
export const ReviewTable = ({
  formConfig,
  collapsible = false,
  header = 'Information you submitted on this form',
  className,
}) => {
  const { chapters, formData, pagesFromState } = useChapterSectionCollection(
    formConfig,
  );

  // Reset defaults to ensure no state is carried over between renders
  resetDefaults();

  // Group table rows by chapter
  const tableRowsByChapter = {};

  chapters.forEach(chapter => {
    const chapterTitle = getChapterTitle(
      chapter.formConfig,
      formData,
      formConfig,
    );

    const fields = buildFields(chapter, formData, pagesFromState);
    const chapterRows = [];

    // Convert fields to table data
    fields.forEach(field => {
      if (field && React.isValidElement(field)) {
        // Extract data from the field element
        const fieldProps = field.props;
        const children = fieldProps?.children;

        if (Array.isArray(children) && children.length >= 2) {
          const label = children[0]?.props?.children || 'Unknown';
          const value = children[1]?.props?.children || 'No value';

          chapterRows.push({
            field: label,
            value: typeof value === 'object' ? safeStringify(value) : value,
          });
        }
      }
    });

    if (chapterRows.length > 0) {
      tableRowsByChapter[chapterTitle] = chapterRows;
    }
  });

  const chapterNames = Object.keys(tableRowsByChapter);

  if (chapterNames.length === 0) {
    return (
      <div className="vads-u-margin-y--2">
        <p>No form data available to review.</p>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'confirmation-review-table',
        className || 'vads-u-margin-top--2',
      )}
    >
      <h2 className="vads-u-margin-bottom--2">{header}</h2>
      {chapterNames.map((chapterTitle, chapterIndex) => (
        <div
          key={`chapter-${chapterIndex}`}
          className="vads-u-margin-bottom--4"
        >
          <h3 className="vads-u-margin-bottom--2">{chapterTitle}</h3>
          <va-table
            table-title="TESTING: This is a stacked bordered table."
            table-type="bordered"
          >
            <va-table-row slot="headers">
              <span>Question</span>
              <span>Answer</span>
            </va-table-row>
            {tableRowsByChapter[chapterTitle].map((row, rowIndex) => (
              <va-table-row key={`${chapterTitle}-row-${rowIndex}`}>
                <span>{row.field}</span>
                <span style={{ wordBreak: 'break-word' }}>{row.value}</span>
              </va-table-row>
            ))}
          </va-table>
        </div>
      ))}
    </div>
  );
};

ReviewTable.propTypes = {
  formConfig: PropTypes.object.isRequired,
  className: PropTypes.string,
  collapsible: PropTypes.bool,
  header: PropTypes.string,
};

// Add this helper function at the top of the file
const safeStringify = (obj, maxDepth = 3, currentDepth = 0) => {
  if (currentDepth >= maxDepth) return '[Object too deep]';

  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) return `[${obj.length} items]`;

  const seen = new Set();

  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular Reference]';
        seen.add(value);

        // Skip React-specific properties that cause circular references
        if (
          key === '_context' ||
          key === 'Provider' ||
          key === '_owner' ||
          key === '_store'
        ) {
          return '[React Object]';
        }
      }
      return value;
    });
  } catch (error) {
    return '[Object - Cannot stringify]';
  }
};
