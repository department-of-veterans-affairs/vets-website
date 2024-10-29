import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import NeedHelpSection from './NeedHelpSection';

const DownloadRecordType = () => {
  const history = useHistory();
  const [checkAll, setCheckAll] = useState(false);
  const [labTestCheck, setLabTestCheck] = useState(false);
  const [careSummariesCheck, setCareSummariesCheck] = useState(false);
  const [vaccineCheck, setVaccineCheck] = useState(false);
  const [allergiesCheck, setAllergiesCheck] = useState(false);
  const [conditionsCheck, setConditionsCheck] = useState(false);
  const [vitalsCheck, setVitalsCheck] = useState(false);
  const [medicationsCheck, setMedicationsCheck] = useState(false);
  const [upcomingAppCheck, setUpcomingAppCheck] = useState(false);
  const [pastAppCheck, setPastAppCheck] = useState(false);
  const [demoCheck, setDemoCheck] = useState(false);
  const [milServCheck, setMilServCheck] = useState(false);

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setLabTestCheck(newCheckAll);
    setCareSummariesCheck(newCheckAll);
    setVaccineCheck(newCheckAll);
    setAllergiesCheck(newCheckAll);
    setConditionsCheck(newCheckAll);
    setVitalsCheck(newCheckAll);
    setMedicationsCheck(newCheckAll);
    setUpcomingAppCheck(newCheckAll);
    setPastAppCheck(newCheckAll);
    setDemoCheck(newCheckAll);
    setMilServCheck(newCheckAll);
  };

  const handleSingleDeselect = () => {
    setCheckAll(false);
  };

  return (
    <div>
      <h1>Select records and download report</h1>
      <div
        style={{
          margin: '1.9rem 0',
        }}
      >
        <va-segmented-progress-bar
          current={2}
          heading-text="Select types of records to include"
          total={3}
        />
      </div>
      <h2>Select types of records to include</h2>
      <div className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <p>
          Date range: <strong>Last 3 months</strong> (January 1, 2024 to March
          31, 2024)
        </p>
      </div>
      <div className="vads-u-margin-bottom--3">
        <va-checkbox-group>
          <VaCheckbox
            label="Select all VA records"
            checkbox-description="Includes all available VA records for the date range you selected."
            checked={checkAll}
            onVaChange={handleCheckAll}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Lab and test results"
            checked={labTestCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Care summaries and notes"
            checked={careSummariesCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Vaccines"
            checked={vaccineCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Allergies and reactions"
            checked={allergiesCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Health conditions"
            checked={conditionsCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Vitals"
            checked={vitalsCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Medications"
            checkbox-description="Includes VA medications and supplies. And medications prescribed by non-VA providers, if you filled them through a VA pharmacy or told your provider about them.  When you download medication records, we also include a list of allergies and reactions in your VA medical records."
            checked={medicationsCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Upcoming VA appointments"
            checked={upcomingAppCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Past VA appointments"
            checkbox-description="From last 2 years only"
            checked={pastAppCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="VA demographics records"
            checked={demoCheck}
            onVaChange={handleSingleDeselect}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="DOD military service information records"
            checkbox-description="Includes your Defense Department (DOD) service records from 1980 and later."
            checked={milServCheck}
            onVaChange={handleSingleDeselect}
          />
        </va-checkbox-group>
      </div>
      <VaButtonPair
        continue
        onSecondaryClick={() => {
          history.push('/download/date-range');
        }}
        onPrimaryClick={() => {
          history.push('/download/file-type');
        }}
      />
      <NeedHelpSection />
    </div>
  );
};

export default DownloadRecordType;
