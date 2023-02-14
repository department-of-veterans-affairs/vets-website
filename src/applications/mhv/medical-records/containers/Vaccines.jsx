import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList';
import { getVaccineList } from '../actions/vaccine';

const Vaccines = () => {
  const vaccines = useSelector(state => state.mr.vaccines.vaccineList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVaccineList());
  });

  const content = () => {
    if (vaccines?.length) {
      return <RecordList records={vaccines} type="vaccine" />;
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return (
    <div className="vaccines">
      <h1>VA vaccines</h1>
      <div className="text-placeholder text-placeholder-medium" />
      <div className="text-placeholder text-placeholder-large" />
      <div className="text-placeholder text-placeholder-small" />
      <va-button
        text="Print"
        onClick={() => {}}
        data-testid="print-records-button"
      />
      {content()}
    </div>
  );
};

export default Vaccines;
