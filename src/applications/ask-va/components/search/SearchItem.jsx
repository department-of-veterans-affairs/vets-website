import {
  VaPagination,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
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
    },
    [alertRef],
  );

  const handleChange = event => {
    const selectedValue = event.detail.value;
    setSelected(selectedValue);
    onChange(selectedValue);
    dispatch(setVAHealthFacility(event.target.textContent));
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
    facilityData?.data?.length > 0 && (
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
                value={facility.id}
                name="primary"
                checked={selected === facilityInfo(facility)}
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
    )
  );
};

function mapStateToProps(state) {
  return {
    searchInput: state.askVA.searchLocationInput,
  };
}

export default connect(mapStateToProps)(SearchItem);
