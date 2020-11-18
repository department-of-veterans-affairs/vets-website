import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setDeductions } from '../actions';
import moment from 'moment';

const EmploymentRecord = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  formData,
  onChange,
  setData,
  deductions,
  save,
  showEmploymentRecord,
}) => {
  const { SchemaField } = registry.fields;

  const handleSave = (e, data) => {
    e.preventDefault();
    const {
      employerName,
      employmentStart,
      employmentType,
      monthlyIncome,
    } = data;
    if (employerName && employmentStart && employmentType && monthlyIncome) {
      showEmploymentRecord(false);
      save(e, data);
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
      <PayrollDeductions
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        onBlur={onBlur}
        formData={formData}
        onChange={onChange}
        setData={setData}
        deductions={deductions}
      />
      <button
        className="btn-save usa-button-primary"
        onClick={e => handleSave(e, formData)}
      >
        Save
      </button>
    </div>
  );
};

const PayrollDeductions = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  // formData,
  // deductions,
  // setData,
}) => {
  const { SchemaField } = registry.fields;

  const [deductionTypes, setDeductionTypes] = useState([
    { id: 0, type: 'Federal taxes', value: null },
    { id: 1, type: 'State taxes', value: null },
    { id: 2, type: 'Retirement (401k)', value: null },
    { id: 3, type: 'Social security', value: null },
  ]);

  const handleAddDeduction = () => {
    const [last] = deductionTypes.slice(-1);
    let { id } = last;
    const newId = ++id;

    setDeductionTypes(prevState => [
      ...prevState,
      { id: newId, type: 'New Deduction', value: null },
    ]);
  };

  const handleUpdate = (id, value) => {
    const itemIndex = deductionTypes.findIndex(obj => obj.id === id);

    setDeductionTypes(prevState => [
      ...prevState.map((item, index) => {
        if (!value && index === itemIndex) return { ...item, value: 0 };
        return index === itemIndex ? { ...item, value } : item;
      }),
    ]);
  };

  const total = deductionTypes.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  return (
    <>
      <h4>Payroll deductions</h4>
      <p>You can find your payroll deductions in a recent paycheck.</p>
      <div className="input-payroll-deduction">
        {deductionTypes.map((item, i) => (
          <div key={i}>
            <label className="deduction-label">{item.type}</label>
            <SchemaField
              schema={schema.properties.payrollDeductions}
              uiSchema={uiSchema.payrollDeductions}
              onBlur={onBlur}
              registry={registry}
              idSchema={idSchema}
              formData={
                deductionTypes[i]?.value ? deductionTypes[i]?.value : ''
              }
              onChange={value => handleUpdate(i, value)}
            />
          </div>
        ))}
      </div>
      <div className="add-item-link-section">
        <i className="fas fa-plus plus-icon" />
        <span className="add-item-link" onClick={() => handleAddDeduction()}>
          Add payroll deduction
        </span>
      </div>
      {total > 0 && (
        <div className="monthly-net-income">
          <strong>Monthly net income:</strong> ${total}
        </div>
      )}
    </>
  );
};

const EmploymentRecordReview = ({ record }) => {
  const handleEdit = e => {
    e.preventDefault();
    // console.log('formData: ', formData);
  };

  return (
    <div className="employment-record-review">
      <h3 className="review-tile">
        {record.employmentType} employment at {record.employerName}
      </h3>
      <div className="review-sub-title">
        {moment(record.employmentStart).format('MMMM D, YYYY')} to Present
      </div>
      <div className="review-content">
        <strong>Monthly net income:</strong> ${record.monthlyIncome}
      </div>
      <button className="btn-edit usa-button-secondary" onClick={handleEdit}>
        Edit
      </button>
    </div>
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
  setData,
  deductions,
}) => {
  const [saved, setSaved] = useState([]);
  const [showEmploymentRecord, setShowEmploymentRecord] = useState(true);

  const handleSave = (e, data) => {
    setSaved(prevState => [...prevState, data]);
  };

  const handleAddRecord = () => {
    // console.log('add job');
    setShowEmploymentRecord(true);
  };

  return (
    <>
      <div className="employment-history-title">{title}</div>
      {saved.map((item, i) => {
        return <EmploymentRecordReview key={i} record={item} />;
      })}
      {showEmploymentRecord && (
        <EmploymentRecord
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          onBlur={onBlur}
          onChange={onChange}
          formData={formData}
          setData={setData}
          deductions={deductions}
          save={(e, data) => handleSave(e, data)}
          showEmploymentRecord={setShowEmploymentRecord}
        />
      )}
      <div className="add-item-container">
        <div className="add-income-link-section">
          <i className="fas fa-plus plus-icon" />
          <a className="add-income-link" onClick={handleAddRecord}>
            Add job
          </a>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setDeductions(data)),
});

const mapStateToProps = state => ({
  title: 'Please provide your employment history for the past two years.',
  deductions: state.fsr.deductions,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmploymentHistory);
