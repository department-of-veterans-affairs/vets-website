import React, { useState } from 'react';

const SecondaryEmploymentRecord = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  save,
  showSecondaryRecord,
}) => {
  const { SchemaField } = registry.fields;

  const handleSave = (e, data) => {
    e.preventDefault();
    const { employerName, employmentStart, employmentType } = data;
    if (employerName && employmentStart && employmentType) {
      showSecondaryRecord(false);
      save(data);
    }
  };

  const [employment, setEmployment] = useState({
    employmentType: '',
  });

  const handleUpdate = (key, value) => {
    setEmployment({
      ...employment,
      [key]: value,
    });
  };

  return (
    <div className="employment-history-container">
      <div className="input-employment-type">
        <SchemaField
          schema={schema.properties.employmentType}
          uiSchema={uiSchema.employmentType}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={employment.employmentType}
          onChange={value => handleUpdate('employmentType', value)}
        />
      </div>
      <div className="input-employment-start">
        <SchemaField
          schema={schema.properties.employmentStart}
          uiSchema={uiSchema.employmentStart}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={employment.employmentStart}
          onChange={value => handleUpdate('employmentStart', value)}
        />
      </div>
      <div className="input-employment-start">
        <SchemaField
          schema={schema.properties.employmentEnd}
          uiSchema={uiSchema.employmentEnd}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={employment.employmentEnd}
          onChange={value => handleUpdate('employmentEnd', value)}
        />
      </div>
      <div className="input-employer-name">
        <SchemaField
          schema={schema.properties.employerName}
          uiSchema={uiSchema.employerName}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={employment.employerName}
          onChange={value => handleUpdate('employerName', value)}
        />
      </div>
      <button
        className="btn-save usa-button-primary"
        onClick={e => handleSave(e, employment)}
      >
        Save
      </button>
    </div>
  );
};

export default SecondaryEmploymentRecord;
