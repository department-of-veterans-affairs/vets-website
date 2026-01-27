import React, { useEffect } from 'react';
import { Form, useNavigate, useSearchParams } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import {
  VaSelect,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { addStyleToShadowDomOnPages } from '../utilities/helpers';
import { SEARCH_PARAMS } from '../utilities/constants';

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
  const status = searchParams.get(SEARCH_PARAMS.STATUS) || defaults.STATUS;
  const sort = searchParams.get(SEARCH_PARAMS.SORT) || defaults.SORT;
  const number = searchParams.get(SEARCH_PARAMS.NUMBER) || defaults.NUMBER;
  const size = searchParams.get(SEARCH_PARAMS.SIZE) || defaults.SIZE;
  const selectedIndividual =
    searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL) ||
    defaults.SELECTED_INDIVIDUAL;
  const handleChange = async e => {
    e.preventDefault();
    const sortOrder = e.detail?.value;
    const statusLabel = status ? `status=${status}&` : '';
    navigate(
      `?${statusLabel}sort=${sortOrder}&pageNumber=${number}&pageSize=${size}&as_selected_individual=${selectedIndividual}`,
    );
    setTimeout(() => {
      focusElement('.poa-request__meta');
    }, 500);
  };

  const toggleRep = e => {
    navigate(
      `?status=${status}&sort=${sort}&pageNumber=1&pageSize=${size}&as_selected_individual=${
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
        value={sort ? `${sort}` : `${defaults.SORT_ORDER}`}
      >
        {options.map((option, i) => (
          <option value={`${option.sort}`} key={i}>
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
