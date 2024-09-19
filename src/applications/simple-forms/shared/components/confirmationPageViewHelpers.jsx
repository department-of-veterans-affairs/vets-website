import React from 'react';
import { isReactComponent } from '~/platform/utilities/ui';

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

const reviewEntry = (description, key, uiSchema, label, data) => {
  if (!data) return null;

  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = isReactComponent(description)
    ? uiSchema['ui:description']
    : null;

  const keyString = `review-${key}-${label}-${data}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return (
    <li key={keyString}>
      <div className="vads-u-color--gray">
        {label}
        {textDescription && <p>{textDescription}</p>}
        {!textDescription && !DescriptionField && description}
      </div>
      <div>{data}</div>
    </li>
  );
};

const fieldEntries = (key, uiSchema, data, schema, schemaFromState) => {
  if (key.startsWith('view:') || key.startsWith('ui:')) return null;
  if (schema.properties[key] === undefined || !uiSchema) return null;

  const {
    'ui:confirmationField': ConfirmationField,
    'ui:description': description,
    'ui:reviewField': ReviewField,
    'ui:reviewWidget': ReviewWidget,
  } = uiSchema;

  const label = uiSchema['ui:title'] || schemaFromState?.properties[key].title;

  let refinedData = typeof data === 'object' ? data[key] : data;

  // long term, make this a switch statement
  if (
    uiSchema['ui:widget'] === 'radio' &&
    uiSchema['ui:options']?.labels?.[refinedData]
  ) {
    refinedData = uiSchema['ui:options'].labels[refinedData];
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
    ['VaMemorableDate', 'VaDate'].includes(
      uiSchema['ui:webComponentField']?.name,
    )
  ) {
    const confirmData = new Date(`${refinedData}T00:00:00`).toLocaleDateString(
      'en-us',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
        schemaFromState?.properties[key],
      ),
    );
  }

  if (dataType === 'array' && data) {
    return data.flatMap(dataPoint =>
      Object.entries(uiSchema.items).flatMap(([arrKey, arrVal]) =>
        fieldEntries(
          arrKey,
          arrVal,
          dataPoint[arrKey],
          schema.properties[key].items,
          schemaFromState?.properties[key].items,
        ),
      ),
    );
    // let iterator = 0;
    // return data.flatMap(dataPoint => {
    //   // if (key.startsWith('view:') || key.startsWith('ui:')) return null;

    //   iterator += 1;

    //   return (
    //     <>
    //       <h3>DataPoint {iterator}</h3>
    //       {Object.entries(uiSchema.items).flatMap(([arrKey, arrVal]) => {
    //         return (
    //           <>
    //             {fieldEntries(
    //               arrKey,
    //               arrVal,
    //               dataPoint[arrKey],
    //               schema.properties[key].items,
    //             )}
    //           </>
    //         );
    //       })}
    //     </>
    //   );
    // });
  }

  return reviewEntry(description, key, uiSchema, label, refinedData);
};

export const buildFields = (chapter, formData, pagesFromState) => {
  return chapter.expandedPages.flatMap(page =>
    Object.entries(page.uiSchema).flatMap(([uiSchemaKey, uiSchemaValue]) => {
      const data = formData[uiSchemaKey];
      return fieldEntries(
        uiSchemaKey,
        uiSchemaValue,
        data,
        page.schema,
        pagesFromState?.[page.pageKey]?.schema,
      );
    }),
  );
  // return chapter.expandedPages.flatMap(page => {
  //   if (isReactComponent(page.CustomPageReview)) {
  //     return page.CustomPageReview;
  //   }

  //   return Object.entries(page.uiSchema).flatMap(
  //     ([uiSchemaKey, uiSchemaValue]) => {
  //       const data = formData[uiSchemaKey];
  //       return fieldEntries(uiSchemaKey, uiSchemaValue, data, page.schema);
  //     },
  //   );
  // });
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
