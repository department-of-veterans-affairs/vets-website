import {
  VaPagination,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

const SearchItem = ({
  facilityData,
  pageURL,
  getData,
  onChange,
  searchInput,
}) => {
  const [selected, setSelected] = useState(null);
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
  };

  const facilityInfo = info => {
    const facilityName = `${info.attributes.name}`;
    const facilityZip = info.attributes.address.physical.zip.split('-')[0];
    const facilityAddress = `${info.attributes.address.physical.city}, ${
      info.attributes.address.physical.state
    } ${facilityZip}`;
    return `${facilityName},
    ${facilityAddress}`;
  };

  return (
    facilityData.data.length > 0 && (
      <>
        <p ref={alertRef} className="vads-u-margin-bottom--0">
          {`Showing ${facilityData.data.length} results for `}
          <strong>{`"${searchInput.place_name || searchInput}"`}</strong>{' '}
        </p>
        <p className="vads-u-margin-top--1">
          The results are listed from nearest to farthest from your location.
        </p>
        <VaRadio
          class="vads-u-margin-y--2 vads-u-width--100"
          label="Select VA health facility"
          onVaValueChange={handleChange}
          required
          uswds
        >
          {facilityData?.data.map(facility => (
            <va-radio-option
              key={facility.id}
              id={facility.id}
              label={facilityInfo(facility)}
              value={facilityInfo(facility)}
              name="primary"
              checked={selected === facilityInfo(facility)}
              uswds
            />
          ))}
        </VaRadio>
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={facilityData.meta.pagination.currentPage}
          pages={facilityData.meta.pagination.totalPages}
          maxPageListLength={5}
          showLastPage
          uswds
        />
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
