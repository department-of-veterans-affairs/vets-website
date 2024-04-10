import React, { useState } from 'react';
import {
  VaRadio,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';

const EducationSearchItem = ({
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

  const handleChange = event => {
    const selectedValue = event.detail.value;
    setSelected(selectedValue);
    onChange(selectedValue);
  };

  const facilityInfo = info => {
    const facilityName = `${info.attributes.name}`;
    const facilityAddress = ` ${info.attributes.physicalState} ${
      info.attributes.physicalZip
    }`;
    return `${facilityName}
    ${facilityAddress}`;
  };

  const numberOfPages = facilityData?.meta?.count / 10;

  return (
    facilityData.data.length > 0 && (
      <>
        <p>
          {`Showing ${facilityData.data.length} results for`}
          <strong>{`"${searchInput.place_name || searchInput}"`}</strong>{' '}
        </p>
        <p>
          The results are listed from nearest to farthest from your location.
        </p>
        <VaRadio
          class="vads-u-margin-y--2"
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
        {facilityData?.meta.count > 10 && (
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={facilityData.link?.self}
            pages={numberOfPages > 5 ? 5 : Math.round(numberOfPages)}
            maxPageListLength={5}
            showLastPage
            uswds
          />
        )}
      </>
    )
  );
};

function mapStateToProps(state) {
  return {
    searchInput: state.askVA.searchLocationInput,
  };
}

export default connect(mapStateToProps)(EducationSearchItem);
