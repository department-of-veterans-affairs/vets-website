import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import {
  VaButton,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fetchSearchByNameResults,
  filterBeforeResultFlag,
  geolocateUser,
} from '../../actions';
import { UseMyLocation } from '../components/school-and-employers/UseMyLocation';
import { UseMyLocationModal } from '../components/school-and-employers/UseMyLocationModal';
import { updateUrlParams } from '../../selectors/search';
import { FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP } from '../../selectors/filters';
import { convertSchoolsAndEmployersTabIndexToText } from '../../utils/helpers';

const SearchByProgram = () => {
  const locationRef = useRef(null);
  const distanceDropdownOptions = [
    { value: '5', label: 'within 5 miles' },
    { value: '15', label: 'within 15 miles' },
    { value: '25', label: 'within 25 miles' },
    { value: '50', label: 'within 50 miles' },
    { value: '75', label: 'within 75 miles' },
  ];
  const dispatch = useDispatch();
  const search = useSelector(state => state.search);
  const [distance, setDistance] = useState(search.query.distance);
  const [location, setLocation] = useState(search.query.location);
  const [programName, setProgramName] = useState(null);
  const [searchDirty /* , setSearchDirty */] = useState(false);
  const { version } = useSelector(state => state.preview);
  const filters = useSelector(state => state.filters);
  const history = useHistory();

  const focusLocationInput = () => {
    locationRef?.current?.shadowRoot?.querySelector('input').focus();
  };

  const handleLocateUser = e => {
    e.preventDefault();
    recordEvent({
      event: 'map-use-my-location',
    });
    dispatch(geolocateUser());
  };

  const doSearch = value => {
    const currentTab = convertSchoolsAndEmployersTabIndexToText(search.tab);
    const searchName = value || search.query.name;
    dispatch(fetchSearchByNameResults(searchName, 1, filters, version));
    const clonedFilters = filters;
    clonedFilters.excludedSchoolTypes = FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP.filter(
      exclusion => !clonedFilters.excludedSchoolTypes.includes(exclusion),
    );

    updateUrlParams(
      history,
      currentTab,
      {
        ...search.query,
        name: searchName,
      },
      clonedFilters,
      version,
    );
  };

  const handleSearch = () => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'nameSearch',
      'gibct-form-value': programName,
    });
    dispatch(filterBeforeResultFlag());
    doSearch(programName);
  };

  useEffect(
    () => {
      const { searchString } = search.query.streetAddress;
      if (searchString) {
        setLocation(searchString);
        focusLocationInput();
      }
    },
    [search],
  );

  return (
    <div className="vads-u-display--flex mobile:vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-justify-content--space-between mobile:vads-u-align-items--flex-start medium-screen:vads-u-align-items--flex-end">
      <UseMyLocationModal
        geocodeError={search.geocodeError}
        focusLocationInput={focusLocationInput}
      />
      <VaTextInput
        className="tablet:vads-u-flex--3 mobile:vads-u-width--full vads-u-margin-right--2p5 mobile:vads-u-margin-top--neg2p5"
        name="program-name"
        type="text"
        label="Name of program"
        required
        value={programName}
        error={
          searchDirty && !programName ? 'Please fill in a program name.' : null
        }
        onInput={e => setProgramName(e.target.value)}
      />
      <VaTextInput
        ref={locationRef}
        className="tablet:vads-u-flex--3 mobile:vads-u-width--full vads-u-margin-right--2p5"
        name="program-location"
        type="text"
        label="City, state, or postal code"
        required
        value={location}
        error={
          searchDirty && !location
            ? 'Please fill in a city, state, or postal code.'
            : null
        }
        onInput={e => setLocation(e.target.value)}
      />
      <div className="medium-screen:vads-u-flex--2 tablet:vads-u-flex--auto vads-u-margin-right--2p5 mobile:vads-u-margin-top--2p5">
        <UseMyLocation
          geolocationInProgress={search.geolocationInProgress}
          handleLocateUser={handleLocateUser}
        />
        <VaSelect
          name="program-distance"
          onVaSelect={e => setDistance(e.target.value)}
          value={distance}
          required
          error={searchDirty && !distance ? 'Please select a distance' : null}
        >
          {distanceDropdownOptions.map(option => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </VaSelect>
      </div>
      <VaButton
        className="vads-u-flex--auto mobile:vads-u-margin-top--2p5"
        onClick={handleSearch}
        text="Search"
      />
    </div>
  );
};

export default SearchByProgram;
