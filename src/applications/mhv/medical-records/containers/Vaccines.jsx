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
      <RecordList records={vaccines} type="vaccine" />
    </div>
  );
};

export default Vaccines;
