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

const reviewEntry = (description, key, value, label, data) => {
  if (!data) return null;

  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = isReactComponent(description)
    ? value['ui:description']
    : null;

  return (
    <li key={`review_${key}_${value}`}>
      <div className="vads-u-color--gray">
        {label}
        {textDescription && <p>{textDescription}</p>}
        {!textDescription && !DescriptionField && description}
      </div>
      <div>{data}</div>
    </li>
  );
};

const fieldEntries = (key, value, data, schema) => {
  if (key.startsWith('view:') || key.startsWith('ui:')) return null;

  const label = value['ui:title'];
  const description = value['ui:description'];
  let refinedData = typeof data === 'object' ? data[key] : data;
  const dataType = schema.properties[key].type;

  const ReviewField = value['ui:reviewField'];
  const ReviewWidget = value['ui:reviewWidget'];

  if (isReactComponent(ReviewField)) {
    const reviewProps = { children: { props: { formData: refinedData } } };
    return <ReviewField {...reviewProps} />;
  }

  if (isReactComponent(ReviewWidget)) {
    const reviewProps = { name: label, value: refinedData };
    refinedData = <ReviewWidget {...reviewProps} />;
  }

  if (dataType === 'object') {
    return Object.entries(value).flatMap(([objKey, objVal]) => {
      return fieldEntries(objKey, objVal, data[objKey], schema.properties[key]);
    });
  }

  if (dataType === 'array') {
    return data.map(dataPoint => {
      return Object.entries(value.items).flatMap(([arrKey, arrVal]) => {
        return fieldEntries(
          arrKey,
          arrVal,
          dataPoint[arrKey],
          schema.properties[key].items,
        );
      });
    });
  }

  return reviewEntry(description, key, value, label, refinedData);
};

const buildFields = (chapter, formData) => {
  return chapter.expandedPages.flatMap(page =>
    Object.entries(page.uiSchema).flatMap(([uiSchemaKey, uiSchemaValue]) => {
      const data = formData[uiSchemaKey];
      return fieldEntries(uiSchemaKey, uiSchemaValue, data, page.schema);
    }),
  );
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
