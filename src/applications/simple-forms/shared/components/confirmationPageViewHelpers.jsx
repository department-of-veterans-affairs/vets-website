import React from 'react';
import { isReactComponent } from '~/platform/utilities/ui';

const getChapterTitle = (chapterFormConfig, formData, formConfig) => {
  const onReviewPage = true;

  let chapterTitle = chapterFormConfig.title;

  if (typeof chapterFormConfig.title === 'function') {
    chapterTitle = chapterFormConfig.title({
      formData,
      formConfig,
      onReviewPage,
    });
  }
  if (chapterFormConfig.reviewTitle) {
    chapterTitle = chapterFormConfig.reviewTitle;
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

const fieldEntries = (key, uiSchema, data, schema) => {
  if (key.startsWith('view:') || key.startsWith('ui:')) return null;
  if (schema.properties[key] === undefined) return null;

  const {
    'ui:title': label,
    'ui:description': description,
    'ui:confirmationData': confirmationData,
    'ui:reviewField': ReviewField,
    'ui:reviewWidget': ReviewWidget,
  } = uiSchema;

  let refinedData = typeof data === 'object' ? data[key] : data;
  const dataType = schema.properties[key].type;

  if (typeof confirmationData === 'function') {
    const {
      data: confirmData = refinedData,
      label: confirmLabel = label,
    } = confirmationData({ formData: refinedData });
    return reviewEntry(description, key, uiSchema, confirmLabel, confirmData);
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
      fieldEntries(objKey, objVal, data[objKey], schema.properties[key]),
    );
  }

  if (dataType === 'array') {
    return data.flatMap(dataPoint =>
      Object.entries(uiSchema.items).flatMap(([arrKey, arrVal]) =>
        fieldEntries(
          arrKey,
          arrVal,
          dataPoint[arrKey],
          schema.properties[key].items,
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

const buildFields = (chapter, formData) => {
  return chapter.expandedPages.flatMap(page =>
    Object.entries(page.uiSchema).flatMap(([uiSchemaKey, uiSchemaValue]) => {
      const data = formData[uiSchemaKey];
      return fieldEntries(uiSchemaKey, uiSchemaValue, data, page.schema);
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

export const ChapterSectionCollection = ({
  chapters,
  formData,
  formConfig,
}) => {
  return chapters.map(chapter => {
    const chapterTitle = getChapterTitle(
      chapter.formConfig,
      formData,
      formConfig,
    );
    const fields = buildFields(chapter, formData).filter(item => item != null);
    return (
      fields.length > 0 && (
        <div key={`chapter_${chapter.name}`}>
          <h3>{chapterTitle}</h3>
          <ul style={{ listStyle: 'none' }}>{fields}</ul>
        </div>
      )
    );
  });
};
