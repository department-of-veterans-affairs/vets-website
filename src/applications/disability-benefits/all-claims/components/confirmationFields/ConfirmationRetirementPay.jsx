import React from 'react';

import {
  PageTitle,
  reviewEntry,
} from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

const ConfirmationRetirementPay = ({
  page,
  formData,
  showPageTitles,
  chapterFormConfig,
}) => {
  const addField = (fields, key, refineData) => {
    let data = formData[key];
    if (data === undefined) return;

    const uiSchema = page.uiSchema[key];
    if (refineData) data = refineData(data, uiSchema);

    const title = uiSchema['ui:title'];

    fields.push(reviewEntry(undefined, key, undefined, title, data));
  };

  const fields = [];

  addField(fields, 'view:hasMilitaryRetiredPay', (data, uiSchema) => {
    return uiSchema['ui:options'].labels[data ? 'Y' : 'N'];
  });

  addField(fields, 'militaryRetiredPayBranch');

  if (fields.length === 0) return [];
  if (!showPageTitles) return fields;

  return (
    <PageTitle
      page={page}
      formData={formData}
      chapterFormConfig={chapterFormConfig}
    >
      {fields}
    </PageTitle>
  );
};

export default ConfirmationRetirementPay;
