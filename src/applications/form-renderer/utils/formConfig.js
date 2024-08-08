import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const selectSchemas = ({ pageTitle, additionalFields }) => {
  const schemas = {
    schema: {
      type: 'object',
      properties: {
        fullName: fullNameSchema,
      },
    },
    uiSchema: {
      ...titleUI(pageTitle),
      fullName: fullNameUI(),
    },
  };

  if (additionalFields.includeDateOfBirth) {
    schemas.schema.properties.dateOfBirth = dateOfBirthSchema;
    schemas.uiSchema.dateOfBirth = dateOfBirthUI();
  }

  return schemas;
};

const formatChapters = chapters => {
  const formattedChapters = {};

  chapters.forEach(chapter => {
    const pages = {};
    pages[chapter.id] = {
      path: chapter.id.toString(),
      title: chapter.pageTitle,
      ...selectSchemas(chapter),
    };

    formattedChapters[chapter.id] = {
      title: chapter.chapterTitle,
      pages,
    };
  });

  return formattedChapters;
};

export const createFormConfig = ({ chapters, formId, title }) => {
  return {
    formId,
    title,
    subTitle: `VA Form ${formId}`,
    chapters: formatChapters(chapters),
  };
};
