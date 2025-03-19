import React, { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { useSelector } from 'react-redux';
import api from '../utilities/api';

const SEARCH_PARAMS = {
  STATUS: 'status',
  SORT: 'sort',
};

const SortForm = ({ asc, desc, ascOption, descOption }) => {
  const navigate = useNavigate();
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  const status = params.get(SEARCH_PARAMS.STATUS);
  const sortby = params.get(SEARCH_PARAMS.SORT);
  const [sort, setSort] = useState(null);

  const handleChange = e => {
    e.preventDefault();
    const sortBy = e.detail?.value;
    setSort(sortBy);
  };

  const handleSorting = async () => {
    if (sort) {
      navigate(`?status=${status}&sort=${sort}`);
      return api.getPOARequests({ status, sort });
    }
    return null;
  };
  const accreditedRepresentativePortalSortBy = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.accreditedRepresentativePortalSortBy
      ],
  );

  return (
    <>
      {!accreditedRepresentativePortalSortBy && (
        <Form id="search-form" role="search" className="poa-request__sort-by">
          <VaSelect
            onVaSelect={handleChange}
            label="Sort by"
            message-aria-describedby="Sort by date"
            name="options"
            className="poa-request__select"
            value={sortby || asc}
          >
            <option value={asc}>{ascOption}</option>
            <option value={desc}>{descOption}</option>
          </VaSelect>
          <button
            type="button"
            className="usa-button-secondary poa-request__apply"
            onClick={handleSorting}
          >
            Sort
          </button>
        </Form>
      )}
    </>
  );
};

export default SortForm;
