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
      <h4>Payroll deductions</h4>
      <p>You can find your payroll deductions in a recent paycheck.</p>
      <div>
        <div className="input-payroll-deduction">
          <SchemaField
            schema={schema.properties.payrollDeduction}
            uiSchema={uiSchema.payrollDeduction}
            onBlur={onBlur}
            registry={registry}
            idSchema={idSchema}
            formData={formData.payrollDeduction}
            onChange={value =>
              onChange({ ...formData, payrollDeduction: value })
            }
          />
        </div>
        <div className="add-item-link-section">
          <i className="fas fa-plus plus-icon" />
          <a className="add-item-link" onClick={() => {}}>
            Add payroll deduction
          </a>
        </div>
        <button className="btn-save" onClick={() => {}}>
          Save
        </button>
      </div>
    </>
  );
};

// const PayrollDeductions = ({
//   item,
//   update,
//   remove,
//   setSavedItem,
//   registry,
//   schema,
//   uiSchema,
//   idSchema,
// }) => {
//   return (
//     <div className="input-payroll-deduction">
//       <SchemaField
//         schema={schema.properties.payrollDeduction}
//         uiSchema={uiSchema.payrollDeduction}
//         onBlur={onBlur}
//         registry={registry}
//         idSchema={idSchema}
//         formData={formData.payrollDeduction}
//         onChange={value => onChange({ ...formData, payrollDeduction: value })}
//       />
//     </div>
//   );
// };

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
