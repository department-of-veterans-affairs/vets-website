import React from 'react';
import { PropTypes } from 'prop-types';
import { isReactComponent } from '~/platform/utilities/ui';
import constants from 'vets-json-schema/dist/constants.json';
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

// Create country code to name mapping
const COUNTRY_CODE_TO_NAME = constants.countries.reduce((acc, country) => {
  acc[country.value] = country.label;
  return acc;
}, {});

function resetDefaults() {
  arrayMap = {};
  nextClass = '';
  reviewEntryKeys = {};
}

export const getChapterTitle = (chapterFormConfig, formData, formConfig) => {
  const onReviewPage = false;

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
  if (!data) return null;

  const keyString = generateReviewEntryKey(key, label, data);
  const className = classNames(
    nextClass,
    'vads-u-line-height--6',
    'vads-u-padding-bottom--1',
  );
  nextClass = '';

  // for multiple lines of data under one label
  if (Array.isArray(data)) {
    return (
      <li key={keyString} className={className}>
        <div className="vads-u-color--gray">{label}</div>
        {data.map((item, index) => {
          return <div key={`${keyString}-${index}`}>{item}</div>;
        })}
      </li>
    );
  }

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
    uiSchema?.['ui:title'] ||
    schemaFromState?.properties?.[key]?.title ||
    schema?.properties?.[key]?.title;

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
  } else if (key === 'country' && COUNTRY_CODE_TO_NAME[refinedData]) {
    // Handle country codes - show full names, but keep 'USA' as 'USA'
    refinedData =
      refinedData === 'USA' ? 'USA' : COUNTRY_CODE_TO_NAME[refinedData];
  } else if (
    uiSchema['ui:webComponentField']?.identifier === 'VaCheckboxGroupField'
  ) {
    refinedData = data;
  } else if (
    uiSchema['ui:webComponentField']?.identifier === 'VaCheckboxField'
  ) {
    refinedData = refinedData ? 'Selected' : '';
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

export const getPageTitle = (pageFormConfig, formData, formConfig) => {
  // Check for review title first, fallback to page title
  const onReviewPage = false;
  let pageTitle = pageFormConfig.reviewTitle || pageFormConfig.title;

  if (typeof pageTitle === 'function') {
    try {
      pageTitle = pageTitle({
        formData,
        formConfig,
        onReviewPage,
      });
    } catch (e) {
      // Handle exceptions and fallback to empty string
      pageTitle = '';
    }
  }

  return pageTitle || '';
};

export const buildFields = (
  chapter,
  formData,
  pagesFromState,
  showPageTitles,
) => {
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

    const fields = Object.entries(page.uiSchema).flatMap(
      ([uiSchemaKey, uiSchemaValue]) => {
        if (['ratedDisabilities', 'newDisabilities'].includes(uiSchemaKey)) {
          return []; // Skip rendering these fields
        }
        const data = formData?.[uiSchemaKey];
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

    if (showPageTitles) {
      const pageTitle = getPageTitle(page, formData, chapter.formConfig);
      const presentFields = fields.filter(item => item != null);

      if (presentFields.length > 0) {
        return [
          <li key={`page-li-${page.pageKey}`}>
            <h4 key={`page-title-${page.pageKey}`}>{pageTitle}</h4>
            <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
              {presentFields}
            </ul>
          </li>,
        ];
      }
      return [];
    }

    return fields;
  });
};

const useChapterSectionCollection = formConfig => {
  const form = useSelector(state => state.form);
  const formData = form.data;
  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);
  const pagesFromState = form.pages;

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
 *   showPageTitles?: boolean
 * }} props
 * @returns {JSX.Element[]}
 */
export const ChapterSectionCollection = ({
  formConfig,
  collapsible = true,
  header = 'Information you submitted on this form',
  className,
  showPageTitles = false,
}) => {
  const { chapters, formData, pagesFromState } = useChapterSectionCollection(
    formConfig,
  );
  let hasFields = false;

  resetDefaults();

  const content = chapters.map((chapter, index) => {
    const chapterTitle = getChapterTitle(
      chapter.formConfig,
      formData,
      formConfig,
    );
    const fields = buildFields(
      chapter,
      formData,
      pagesFromState,
      showPageTitles,
    ).filter(item => item != null);

    hasFields = hasFields || fields.length > 0;

    if (fields.length === 0) return null;

    return (
      <React.Fragment key={`chapter_${chapter.name}`}>
        {index > 0 && (
          <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
        )}
        <div>
          <h3>{chapterTitle}</h3>
          <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
            {fields}
          </ul>
        </div>
      </React.Fragment>
    );
  });

  if (!hasFields) {
    return null;
  }

  if (collapsible) {
    return (
      <div
        className={classNames(
          'confirmation-chapter-section-collection',
          className || 'vads-u-margin-top--2',
        )}
      >
        <VaAccordion bordered open-single uswds>
          <VaAccordionItem header={header} bordered uswds>
            {content}
          </VaAccordionItem>
        </VaAccordion>
      </div>
    );
  }

  return content;
};

ChapterSectionCollection.propTypes = {
  formConfig: PropTypes.object.isRequired,
  className: PropTypes.string,
  collapsible: PropTypes.bool,
  header: PropTypes.string,
  pageTitles: PropTypes.bool,
  showPageTitles: PropTypes.bool,
};
