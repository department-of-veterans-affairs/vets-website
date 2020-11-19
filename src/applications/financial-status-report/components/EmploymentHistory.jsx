import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setDeductionsData, setEmploymentHistoryData } from '../actions';
import moment from 'moment';

const PrimaryEmploymentRecord = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  save,
  showPrimaryRecord,
  employmentHistory,
  setEmploymentHistory,
}) => {
  const { SchemaField } = registry.fields;

  const [employment, setEmployment] = useState([]);
  const [deductions, setDeductions] = useState([
    { id: 0, type: 'Federal taxes', value: null },
    { id: 1, type: 'State taxes', value: null },
    { id: 2, type: 'Retirement (401k)', value: null },
    { id: 3, type: 'Social security', value: null },
  ]);

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
        deductions,
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
        employmentHistory={employmentHistory}
        setEmploymentHistory={setEmploymentHistory}
        deductions={deductions}
        setDeductions={setDeductions}
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

const PayrollDeductions = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  deductions,
  setDeductions,
}) => {
  const { SchemaField } = registry.fields;

  const handleAddDeduction = () => {
    const [last] = deductions.slice(-1);
    let { id } = last;
    const newId = ++id;
    setDeductions(prevState => [
      ...prevState,
      { id: newId, type: 'New Deduction', value: null },
    ]);
  };

  const handleUpdate = (id, value) => {
    const itemIndex = deductions.findIndex(obj => obj.id === id);
    setDeductions(prevState => [
      ...prevState.map((item, index) => {
        if (!value && index === itemIndex) return { ...item, value: 0 };
        return index === itemIndex ? { ...item, value } : item;
      }),
    ]);
  };

  const total = deductions.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  return (
    <>
      <h4>Payroll deductions</h4>
      <p>You can find your payroll deductions in a recent paycheck.</p>
      <div className="input-payroll-deduction">
        {deductions.map((item, i) => (
          <div key={i}>
            <label className="deduction-label">{item.type}</label>
            <SchemaField
              schema={schema.properties.payrollDeductions}
              uiSchema={uiSchema.payrollDeductions}
              onBlur={onBlur}
              registry={registry}
              idSchema={idSchema}
              formData={deductions[i]?.value ? deductions[i]?.value : ''}
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

const EmploymentRecordReview = ({ record, edit }) => {
  return (
    <div className="employment-record-review">
      <h3 className="review-tile">
        {record.employmentType} employment at {record.employerName}
      </h3>
      <div className="review-sub-title">
        {moment(record.employmentStart).format('MMMM D, YYYY')} to Present
      </div>
      {record.monthlyIncome && (
        <div className="review-content">
          <strong>Monthly net income:</strong> ${record.monthlyIncome}
        </div>
      )}
      <button
        className="btn-edit usa-button-secondary"
        onClick={() => edit(record)}
      >
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
  employmentHistory,
  setEmploymentHistory,
}) => {
  const [savedRecords, setSavedRecords] = useState([]);
  const [showPrimaryRecord, setShowPrimaryRecord] = useState(true);
  const [showSecondaryRecord, setShowSecondaryRecord] = useState(false);

  const handleAddRecord = () => {
    setShowSecondaryRecord(true);
    setEmploymentHistory([
      ...employmentHistory,
      {
        employmentType: null,
        employmentStart: null,
        employmentEnd: null,
        employerName: null,
      },
    ]);
  };

  const handleEditRecord = record => {
    const filtered = savedRecords.filter(
      item => item.employerName !== record.employerName,
    );
    setSavedRecords(filtered);
    if (record.monthlyIncome) {
      setShowPrimaryRecord(true);
    } else {
      setShowSecondaryRecord(true);
    }
  };

  const handleSaveRecord = data => {
    setSavedRecords(prevState => [...prevState, data]);
  };

  useEffect(
    () => {
      setEmploymentHistory(savedRecords);
    },
    [setEmploymentHistory, savedRecords],
  );

  return (
    <>
      <div className="employment-history-title">{title}</div>
      {savedRecords
        .sort((a, b) => b.employmentStart.localeCompare(a.employmentStart))
        .map((item, i) => {
          return (
            <EmploymentRecordReview
              key={i}
              record={item}
              edit={handleEditRecord}
            />
          );
        })}
      {showPrimaryRecord && (
        <PrimaryEmploymentRecord
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          onBlur={onBlur}
          save={data => handleSaveRecord(data)}
          showPrimaryRecord={setShowPrimaryRecord}
          employmentHistory={employmentHistory}
          setEmploymentHistory={setEmploymentHistory}
        />
      )}
      {showSecondaryRecord && (
        <SecondaryEmploymentRecord
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          onBlur={onBlur}
          save={data => handleSaveRecord(data)}
          showSecondaryRecord={setShowSecondaryRecord}
          employmentHistory={employmentHistory}
          setEmploymentHistory={setEmploymentHistory}
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
  setDeductions: data => dispatch(setDeductionsData(data)),
  setEmploymentHistory: data => dispatch(setEmploymentHistoryData(data)),
});

const mapStateToProps = state => ({
  title: 'Please provide your employment history for the past two years.',
  employmentHistory: state.fsr.employmentHistory,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmploymentHistory);
