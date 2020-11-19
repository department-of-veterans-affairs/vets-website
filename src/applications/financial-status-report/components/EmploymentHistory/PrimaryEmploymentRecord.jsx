import React, { useState } from 'react';
import PayrollDeductions from './PayrollDeductions';

const PrimaryEmploymentRecord = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  save,
  showPrimaryRecord,
}) => {
  const { SchemaField } = registry.fields;

  const [employment, setEmployment] = useState({
    deductions: [
      { id: 0, type: 'Federal taxes', value: null },
      { id: 1, type: 'State taxes', value: null },
      { id: 2, type: 'Retirement (401k)', value: null },
      { id: 3, type: 'Social security', value: null },
    ],
  });

  const handleUpdate = (key, value) => {
    setEmployment({
      ...employment,
      [key]: value,
    });
  };

  const handleSave = (e, data) => {
    e.preventDefault();
    const {
      employerName,
      employmentStart,
      employmentType,
      monthlyIncome,
    } = data;
    if (employerName && employmentStart && employmentType && monthlyIncome) {
      showPrimaryRecord(false);
      save({
        ...data,
      });
    }
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
          formData={employment?.employmentType}
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
          formData={employment?.employmentStart}
          onChange={value => handleUpdate('employmentStart', value)}
        />
      </div>
      <div className="input-employer-name">
        <SchemaField
          schema={schema.properties.employerName}
          uiSchema={uiSchema.employerName}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={employment?.employerName}
          onChange={value => handleUpdate('employerName', value)}
        />
      </div>
      <h4>Employment income</h4>
      <div className="input-monthly-income">
        <SchemaField
          schema={schema.properties.monthlyIncome}
          uiSchema={uiSchema.monthlyIncome}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={employment?.monthlyIncome}
          onChange={value => handleUpdate('monthlyIncome', value)}
        />
      </div>
      <PayrollDeductions
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        onBlur={onBlur}
        deductions={employment.deductions}
        setDeductions={setEmployment}
      />
      <button
        className="btn-save usa-button-primary"
        onClick={e => handleSave(e, employment)}
      >
        Save
      </button>
    </div>
  );
};

export default PrimaryEmploymentRecord;
