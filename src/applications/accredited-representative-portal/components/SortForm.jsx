import React, { useEffect } from 'react';
import { Form, useNavigate, useSearchParams } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import {
  VaSelect,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  SEARCH_PARAMS,
  addStyleToShadowDomOnPages,
} from '../utilities/poaRequests';

const SortForm = ({ options, defaults }) => {
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-checkbox'],
      '.va-checkbox__container {margin: 0;}',
    );
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sortby = searchParams.get(SEARCH_PARAMS.SORTBY) || defaults.SORT_BY;
  const status = searchParams.get(SEARCH_PARAMS.STATUS) || defaults.STATUS;
  const sort = searchParams.get(SEARCH_PARAMS.SORTORDER) || defaults.SORT_ORDER;
  const number = searchParams.get(SEARCH_PARAMS.NUMBER) || defaults.NUMBER;
  const size = searchParams.get(SEARCH_PARAMS.SIZE) || defaults.SIZE;
  const selectedIndividual =
    searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL) ||
    defaults.SELECTED_INDIVIDUAL;

  const handleChange = async e => {
    e.preventDefault();
    const sortBy = e.detail?.value?.split(',')[0];
    const sortOrder = e.detail?.value?.split(',')[1];
    const statusLabel = status ? `status=${status}&` : '';
    navigate(
      `?${statusLabel}sortOrder=${sortOrder}&sortBy=${sortBy}&pageNumber=${number}&pageSize=${size}&as_selected_individual=${selectedIndividual}`,
    );
    setTimeout(() => {
      focusElement('.poa-request__meta');
    }, 500);
  };

  const toggleRep = e => {
    navigate(
      `?status=${status}&sortOrder=${sort}&sortBy=${sortby}&pageNumber=1&pageSize=${size}&as_selected_individual=${
        e.detail.checked
      }`,
    );
    setTimeout(() => {
      focusElement('.poa-request__meta');
    }, 500);
  };
  const isChecked = () => {
    return searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL);
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
      <VaCheckbox
        class="poa-request__checkbox"
        id="privacy-agreement"
        label="Show only requests for you"
        checked={isChecked()}
        onVaChange={toggleRep}
      />
    </Form>
  );
};

export default SortForm;
