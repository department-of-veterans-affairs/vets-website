import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaPagination,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui';

import { setVAHealthFacility } from '../../actions';

const SearchItem = ({
  facilityData,
  pageURL,
  getData,
  onChange,
  searchInput,
  validationError,
}) => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();
  const onPageChange = page => {
    getData(`${pageURL}&page=${page}&per_page=10`);
  };
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
      if (!facilityData?.data.length) {
        focusElement('#not-found-error');
      }
    },
    [alertRef, pageURL],
  );

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const facilityString = selectedValue.split('-');
    const facilityCode = facilityString.shift().trim();
    const facilityName = facilityString.join(' ').trim();
    setSelected(selectedValue);
    onChange(facilityCode);
    dispatch(setVAHealthFacility(facilityName));
  };

  const facilityInfo = info => {
    const facilityName = `${info.attributes.name}`;
    const facilityZip = info.attributes.address.physical.zip.split('-')[0];
    const facilityAddress = `${info.attributes.address.physical.city}, ${
      info.attributes.address.physical.state
    } ${facilityZip}`;
    return `${facilityName}, ${facilityAddress}`;
  };

  const resultsPerPage = 10;
  const currentPage = facilityData?.meta?.pagination?.currentPage || 1;
  const totalEntries = facilityData?.meta?.pagination?.totalEntries || 0;

  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalEntries);

  const displayResults = `Showing ${startEntry}-${endEntry} of ${totalEntries} results for `;

  return (
    pageURL &&
    (facilityData?.data?.length > 0 ? (
      <>
        <h3
          ref={alertRef}
          className="vads-u-font-size--base vads-u-margin-bottom--0 vads-u-font-family--sans"
        >
          <span className="vads-u-font-weight--normal">{displayResults}</span>
          <strong>{`"${searchInput.place_name || searchInput}"`}</strong>{' '}
        </h3>
        <hr />
        <div className="vads-u-margin-top--4">
          <VaRadio
            class="vads-u-width--100 vads-u-font-weight--normal"
            label="Select VA health facility"
            labelHeaderLevel="4"
            onVaValueChange={handleChange}
            required
            error={validationError}
          >
            {facilityData?.data.map(facility => (
              <va-radio-option
                key={facility.id}
                id={facility.id}
                label={facilityInfo(facility)}
                value={`${facility.id} - ${facilityInfo(facility)}`}
                name="primary"
                checked={
                  selected === `${facility.id} - ${facilityInfo(facility)}`
                }
                uswds
              />
            ))}
          </VaRadio>
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={currentPage}
            pages={facilityData.meta.pagination.totalPages}
            maxPageListLength={5}
            showLastPage
            uswds
          />
        </div>
      </>
    ) : (
      <div className="vads-u-margin-top--3">
        <div id="not-found-error">
          <p className="vads-u-margin-bottom--0p5">
            We didn’t find any results for "<strong>{searchInput}</strong>
            ."
          </p>
          <p>
            <strong>Try 1 of these 2 things to get more results</strong>:
          </p>
          <ul>
            <li>Make sure you entered the correct city or zip code</li>
            <li>
              Enter the city or zip code of your assigned VA medical center
            </li>
          </ul>
        </div>
        <hr />
      </div>
    ))
  );
};

function mapStateToProps(state) {
  return {
    searchInput: state.askVA.searchLocationInput,
  };
}

SearchItem.propTypes = {
  facilityData: PropTypes.object,
  getData: PropTypes.func,
  pageURL: PropTypes.string,
  searchInput: PropTypes.string,
  validationError: PropTypes.string,
  onChange: PropTypes.func,
};

export default connect(mapStateToProps)(SearchItem);
