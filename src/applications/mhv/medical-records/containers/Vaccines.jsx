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
      <h1>Vaccines</h1>
      <p>
        This is a complete list of vaccines that the VA has on file for you.
      </p>
      <div className="vads-u-display--flex vads-u-margin-y--3">
        <button className="link-button vads-u-margin-right--3" type="button">
          <i className="fas fa-print vads-u-margin-right--1" />
          Print page
        </button>
        <button className="link-button" type="button">
          <i className="fas fa-download vads-u-margin-right--1" />
          Download page
        </button>
      </div>
      {content()}
    </div>
  );
};

export default Vaccines;
