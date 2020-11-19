import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setDeductionsData, setEmploymentHistoryData } from '../../actions';
import PrimaryEmploymentRecord from './PrimaryEmploymentRecord';
import SecondaryEmploymentRecord from './SecondaryEmploymentRecord';
import ReviewEmploymentRecord from './ReviewEmploymentRecord';

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
  const [editData, setEditData] = useState(null);

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

  const handleEditRecord = (e, record) => {
    e.preventDefault();
    const [editing] = savedRecords.filter(
      item => item.employerName === record.employerName,
    );
    if (record.monthlyIncome) {
      setShowPrimaryRecord(true);
      setEditData(editing);
    } else {
      setShowSecondaryRecord(true);
      setEditData(editing);
    }
    const filtered = savedRecords.filter(
      item => item.employerName !== record.employerName,
    );
    setSavedRecords(filtered);
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
            <ReviewEmploymentRecord
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
          editData={editData}
          setEditData={setEditData}
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
          editData={editData}
          setEditData={setEditData}
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
