import React from 'react';
import { Form, useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SEARCH_PARAMS } from '../utilities/poaRequests';

const SortForm = ({ options, defaults }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sortby = searchParams.get(SEARCH_PARAMS.SORTBY) || defaults.SORT_BY;
  const status = searchParams.get(SEARCH_PARAMS.STATUS) || defaults.STATUS;
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER) || defaults.SORT_ORDER;
  const number = searchParams.get(SEARCH_PARAMS.NUMBER) || defaults.NUMBER;
  const size = searchParams.get(SEARCH_PARAMS.SIZE) || defaults.SIZE;

  const handleChange = async e => {
    e.preventDefault();
    const sortBy = e.detail?.value?.split(',')[0];
    const sortOrder = e.detail?.value?.split(',')[1];
    const statusLabel = status ? `status=${status}&` : '';
    navigate(
      `?${statusLabel}sortOrder=${sortOrder}&sortBy=${sortBy}&pageNumber=${number}&pageSize=${size}`,
    );
  };

  return (
    <Form id="search-form" role="search" className="poa-request__sort-by">
      <VaSelect
        onVaSelect={handleChange}
        label="Sort by"
        message-aria-describedby="Sort ordering"
        name="options"
        className="poa-request__select"
        value={
          sortby
            ? `${sortby},${sort}`
            : `${defaults.SORT_BY},${defaults.SORT_ORDER}`
        }
      >
        {options.map(option => (
          <option
            value={`${option.sortBy},${option.sortOrder}`}
            key={`${option.sortBy}+${option.sortOrder}`}
          >
            {option.label}
          </option>
        ))}
      </VaSelect>
    </Form>
  );
};

export default SortForm;
