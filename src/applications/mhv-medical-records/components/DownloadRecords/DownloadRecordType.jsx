import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { format } from 'date-fns';
import NeedHelpSection from './NeedHelpSection';
import { updateReportRecordType } from '../../actions/downloads';
import { pageTitles } from '../../util/constants';
import { sendDataDogAction } from '../../util/helpers';

const DownloadRecordType = () => {
  const history = useHistory();
  const dispatch = useDispatch();
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

  const dateFilter = useSelector(state => state.mr.downloads?.dateFilter);
  const { fromDate, toDate, option: dateFilterOption } = dateFilter;

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectionError, setSelectionError] = useState(null);

  const checkboxGroupRef = useRef(null);

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.DOWNLOAD_FORMS_PAGES_TITLE);
    },
    [dispatch],
  );

  const handleCheckAll = () => {
    setSelectionError(null);

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

    if (newCheckAll === true) {
      setSelectedRecords([
        'labTests',
        'careSummaries',
        'vaccines',
        'allergies',
        'medications',
        'vitals',
        'conditions',
        'militaryService',
        'demographics',
        'pastAppts',
        'upcomingAppts',
      ]);
    } else if (newCheckAll === false) {
      setSelectedRecords([]);
    }
    sendDataDogAction('Select All VA records - Record type');
  };

  const handleSingleCheck = (recordType, e) => {
    const { checked } = e.detail;
    setCheckAll(false);
    setSelectionError(null);

    const newArray = selectedRecords;
    if (checked === true) {
      newArray.push(recordType);
    } else if (checked === false) {
      newArray.splice(newArray.indexOf(recordType), 1);
    }
    setSelectedRecords(newArray);
    sendDataDogAction(`${e.target.label} - Record type`);
  };

  useEffect(
    () => {
      if (!dateFilterOption) {
        history.push('/download/date-range');
      }
    },
    [dateFilterOption, history],
  );

  const selectedDateRange = useMemo(
    () => {
      if (dateFilterOption === 'any') {
        return 'Any';
      }
      if (dateFilterOption === 'custom') {
        return 'Custom';
      }
      return `Last ${dateFilterOption} months`;
    },
    [dateFilterOption],
  );

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
          Date range: <strong>{selectedDateRange}</strong>{' '}
          {dateFilterOption && dateFilterOption !== 'any'
            ? `(${format(new Date(fromDate), 'PPP')} to ${format(
                new Date(toDate),
                'PPP',
              )})`
            : ''}
        </p>
      </div>
      <div className="vads-u-margin-bottom--3">
        <va-checkbox-group error={selectionError} ref={checkboxGroupRef}>
          <VaCheckbox
            label="Select all VA records"
            checkbox-description="Includes all available VA records for the date range you selected."
            checked={checkAll}
            onVaChange={handleCheckAll}
            data-testid="select-all-records-checkbox"
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Lab and test results"
            checked={labTestCheck}
            onVaChange={e => {
              setLabTestCheck(e.detail.checked);
              handleSingleCheck('labTests', e);
            }}
            data-testid="labs-and-test-results-checkbox"
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Care summaries and notes"
            checked={careSummariesCheck}
            onVaChange={e => {
              setCareSummariesCheck(e.detail.checked);
              handleSingleCheck('careSummaries', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Vaccines"
            checked={vaccineCheck}
            onVaChange={e => {
              setVaccineCheck(e.detail.checked);
              handleSingleCheck('vaccines', e);
            }}
            data-testid="vaccines-checkbox"
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Allergies and reactions"
            checked={allergiesCheck}
            onVaChange={e => {
              setAllergiesCheck(e.detail.checked);
              handleSingleCheck('allergies', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Health conditions"
            checked={conditionsCheck}
            onVaChange={e => {
              setConditionsCheck(e.detail.checked);
              handleSingleCheck('conditions', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Vitals"
            checked={vitalsCheck}
            onVaChange={e => {
              setVitalsCheck(e.detail.checked);
              handleSingleCheck('vitals', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Medications"
            checkbox-description="Includes VA medications and supplies. And medications prescribed by non-VA providers, if you filled them through a VA pharmacy or told your provider about them.  When you download medication records, we also include a list of allergies and reactions in your VA medical records."
            checked={medicationsCheck}
            onVaChange={e => {
              setMedicationsCheck(e.detail.checked);
              handleSingleCheck('medications', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Upcoming VA appointments"
            checked={upcomingAppCheck}
            onVaChange={e => {
              setUpcomingAppCheck(e.detail.checked);
              handleSingleCheck('upcomingAppts', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="Past VA appointments"
            checkbox-description="Includes appointments from the last 2 years only."
            checked={pastAppCheck}
            onVaChange={e => {
              setPastAppCheck(e.detail.checked);
              handleSingleCheck('pastAppts', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="VA demographics records"
            checked={demoCheck}
            onVaChange={e => {
              setDemoCheck(e.detail.checked);
              handleSingleCheck('demographics', e);
            }}
          />
          <div className="vads-u-margin-top--3" />
          <VaCheckbox
            label="DOD military service information records"
            checkbox-description="Includes your Defense Department (DOD) service records from 1980 and later."
            checked={milServCheck}
            onVaChange={e => {
              setMilServCheck(e.detail.checked);
              handleSingleCheck('militaryService', e);
            }}
          />
        </va-checkbox-group>
      </div>
      <VaButtonPair
        continue
        onSecondaryClick={() => {
          history.push('/download/date-range');
          sendDataDogAction('Record type - Back - Record type');
        }}
        onPrimaryClick={() => {
          if (selectedRecords.length === 0) {
            setSelectionError(
              'Please select at least one record type to download.',
            );
            focusElement(
              '#checkbox-error-message',
              {},
              checkboxGroupRef.current.shadowRoot,
            );
            return;
          }
          dispatch(updateReportRecordType(selectedRecords)).then(
            history.push('/download/file-type'),
          );
          sendDataDogAction('Record type - Continue - Record type');
        }}
      />
      <NeedHelpSection />
    </div>
  );
};

export default DownloadRecordType;
