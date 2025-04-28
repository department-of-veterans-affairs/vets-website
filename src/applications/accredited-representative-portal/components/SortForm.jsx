import React from 'react';
import { Form, useNavigate, useSearchParams } from 'react-router-dom';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SEARCH_PARAMS } from '../utilities/poaRequests';
import api from '../utilities/api';

const SortForm = ({ asc, desc, ascOption, descOption }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sortby = searchParams.get(SEARCH_PARAMS.SORTBY);
  const status = searchParams.get(SEARCH_PARAMS.STATUS);
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
  const number = searchParams.get(SEARCH_PARAMS.NUMBER);
  const size = searchParams.get(SEARCH_PARAMS.SIZE);

  const handleChange = async e => {
    e.preventDefault();
    const sortBy = e.detail?.value;
    navigate(
      `?status=${status}&sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${number}&pageSize=${size}`,
    );
    return api.getPOARequests({ status, sort, sortBy, size, number });
  };

  return (
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
    </Form>
  );
};

export default SortForm;
