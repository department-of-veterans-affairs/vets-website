import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import NeedHelpSection from './NeedHelpSection';
import { updateReportRecordType } from '../../actions/downloads';
import { pageTitles } from '../../util/constants';
import { sendDataDogAction, formatDate } from '../../util/helpers';
import useFocusOutline from '../../hooks/useFocusOutline';

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
  const recordFilter = useSelector(state => state.mr.downloads?.recordFilter);

  const { fromDate, toDate, option: dateFilterOption } = dateFilter;

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectionError, setSelectionError] = useState(null);

  const checkboxGroupRef = useRef(null);
  const progressBarRef = useRef(null);

  useFocusOutline(progressBarRef);

  useEffect(
    () => {
      setTimeout(() => {
        const heading = progressBarRef?.current?.shadowRoot?.querySelector(
          'h2',
        );
        focusElement(heading);
      }, 400);
      updatePageTitle(pageTitles.DOWNLOAD_FORMS_PAGES_TITLE);
    },
    [progressBarRef],
  );

  // Pre-populate local state from Redux recordFilter
  useEffect(
    () => {
      if (recordFilter && recordFilter.length > 0) {
        setSelectedRecords(recordFilter);
        setLabTestCheck(recordFilter.includes('labTests'));
        setCareSummariesCheck(recordFilter.includes('careSummaries'));
        setVaccineCheck(recordFilter.includes('vaccines'));
        setAllergiesCheck(recordFilter.includes('allergies'));
        setConditionsCheck(recordFilter.includes('conditions'));
        setVitalsCheck(recordFilter.includes('vitals'));
        setMedicationsCheck(recordFilter.includes('medications'));
        setUpcomingAppCheck(recordFilter.includes('upcomingAppts'));
        setPastAppCheck(recordFilter.includes('pastAppts'));
        setDemoCheck(recordFilter.includes('demographics'));
        setMilServCheck(recordFilter.includes('militaryService'));

        if (recordFilter.length === 11) {
          setCheckAll(true);
        }
      }
    },
    [recordFilter],
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

    let newRecords = [...selectedRecords];
    if (checked) {
      if (!newRecords.includes(recordType)) {
        newRecords.push(recordType);
      }
    } else {
      newRecords = newRecords.filter(record => record !== recordType);
    }
    setSelectedRecords(newRecords);
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
        return 'All time';
      }
      if (dateFilterOption === 'custom') {
        return 'Custom';
      }
      return `Last ${dateFilterOption} months`;
    },
    [dateFilterOption],
  );

  const handleBack = () => {
    dispatch(updateReportRecordType(selectedRecords));

    history.push('/download/date-range');
    sendDataDogAction('Record type - Back - Record type');
  };

  const handleSubmit = () => {
    if (selectedRecords.length === 0) {
      setSelectionError('Please select at least one record type to download.');
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
          header-level={2}
          ref={progressBarRef}
        />
      </div>

      <form>
        <fieldset>
          <legend
            className="vads-u-display--block vads-u-width--full vads-u-font-size--source-sans-normalized vads-u-font-weight--normal vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light"
            data-testid="date-range-legend"
          >
            Date range: <strong>{selectedDateRange}</strong>{' '}
            {dateFilterOption && dateFilterOption !== 'any'
              ? `(${formatDate(fromDate)} to ${formatDate(toDate)})`
              : ''}
          </legend>

          <div>
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
        </fieldset>

        <VaButtonPair
          continue
          onSecondaryClick={handleBack}
          onPrimaryClick={handleSubmit}
        />
      </form>
      <NeedHelpSection />
    </div>
  );
};

export default DownloadRecordType;
