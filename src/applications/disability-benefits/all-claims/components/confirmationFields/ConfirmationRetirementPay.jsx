import React from 'react';

import { dangerous } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

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
    const field = dangerous.reviewEntry(undefined, key, undefined, title, data);

    fields.push(field);
  };

  const fields = [];

  addField(fields, 'view:hasMilitaryRetiredPay', (data, uiSchema) => {
    return uiSchema['ui:options'].labels[data ? 'Y' : 'N'];
  });

  addField(fields, 'militaryRetiredPayBranch');

  if (fields.length === 0) return [];
  if (!showPageTitles) return fields;

  return (
    <dangerous.TitledPageFields
      page={page}
      formData={formData}
      chapterFormConfig={chapterFormConfig}
    >
      {fields}
    </dangerous.TitledPageFields>
  );
};

export default ConfirmationRetirementPay;
