import React from 'react';
import { connect } from 'react-redux';
import { setIncomeData } from '../actions';

const EmploymentRecord = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  formData,
  onChange,
}) => {
  const { SchemaField } = registry.fields;

  const handleSave = e => {
    e.preventDefault();
    // console.log('save');
  };

  return (
    <>
      <div className="input-employment-type">
        <SchemaField
          schema={schema.properties.employmentType}
          uiSchema={uiSchema.employmentType}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={formData.employmentType}
          onChange={value => onChange({ ...formData, employmentType: value })}
        />
      </div>
      <div className="input-employment-start">
        <SchemaField
          schema={schema.properties.employmentStart}
          uiSchema={uiSchema.employmentStart}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={formData.employmentStart}
          onChange={value => onChange({ ...formData, employmentStart: value })}
        />
      </div>
      <div className="input-employer-name">
        <SchemaField
          schema={schema.properties.employerName}
          uiSchema={uiSchema.employerName}
          onBlur={onBlur}
          registry={registry}
          idSchema={idSchema}
          formData={formData.employerName}
          onChange={value => onChange({ ...formData, employerName: value })}
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
          formData={formData.monthlyIncome}
          onChange={value => onChange({ ...formData, monthlyIncome: value })}
        />
      </div>

      {/* <SchemaField
        schema={schema.properties.payrollDeductions}
        uiSchema={uiSchema.payrollDeductions}
        onBlur={onBlur}
        registry={registry}
        idSchema={idSchema}
        formData={formData.payrollDeductions}
        onChange={() => {}}
      /> */}

      <PayrollDeductions
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        onBlur={onBlur}
        formData={formData}
        onChange={onChange}
      />
      <button className="btn-save" onClick={e => handleSave(e)}>
        Save
      </button>
    </>
  );
};

const PayrollDeductions = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  formData,
  onChange,
}) => {
  const { SchemaField } = registry.fields;

  const addDeduction = () => {
    // console.log('add deduction');
  };

  const deductionTypes = [
    'Federal taxes',
    'State taxes',
    'Retirement (401k)',
    'Social security',
  ];

  return (
    <>
      <h4>Payroll deductions</h4>
      <p>You can find your payroll deductions in a recent paycheck.</p>
      <div className="input-payroll-deduction">
        {deductionTypes.map((item, i) => (
          <div key={i}>
            <label className="deduction-label">{item}</label>
            <SchemaField
              schema={schema.properties.payrollDeductions}
              uiSchema={uiSchema.payrollDeductions}
              onBlur={onBlur}
              registry={registry}
              idSchema={idSchema}
              formData={formData.payrollDeductions}
              onChange={value =>
                onChange({ ...formData, payrollDeductions: value })
              }
            />
          </div>
        ))}
      </div>
      <div className="add-item-link-section">
        <i className="fas fa-plus plus-icon" />
        <span className="add-item-link" onClick={() => addDeduction()}>
          Add payroll deduction
        </span>
      </div>
      {/* TODO: calculate total data */}
      {/* <div className="monthly-net-income">
        <strong>Monthly net income:</strong> $(total)
      </div> */}
    </>
  );
};

const EmploymentHistory = ({
  title,
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  onChange,
  formData,
}) => {
  return (
    <>
      <div className="employment-history-title">{title}</div>
      <div className="employment-history-container">
        <EmploymentRecord
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          onBlur={onBlur}
          onChange={onChange}
          formData={formData}
        />
      </div>

      <div className="add-item-container">
        <div className="add-income-link-section">
          <i className="fas fa-plus plus-icon" />
          <a className="add-income-link" onClick={() => {}}>
            Add job
          </a>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setIncomeData(data)),
});

const mapStateToProps = state => ({
  title: 'Please provide your employment history for the past two years.',
  income: state.fsr.income,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmploymentHistory);
