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

    // status for request search page, second is for submissions pagination
    if (statusLabel) {
      navigate(
        `?${statusLabel}sort=${sortOrder}&page=${number}&perPage=${size}&show=${selectedIndividual}`,
      );
      setTimeout(() => {
        focusElement('.poa-request__meta');
      }, 500);
    } else {
      navigate(`?sort=${sortOrder}&page=${number}&perPage=${size}`);
      setTimeout(() => {
        focusElement('.poa-request__meta');
      }, 500);
    }

    setTimeout(() => {
      focusElement('.poa-request__meta');
    }, 500);
  };

  const toggleRep = e => {
    e.preventDefault();
    const isChecked = e.detail.checked;
    const updateRep = isChecked === true ? 'you' : 'all';
    navigate(
      `?status=${status}&sort=${sort}&page=1&perPage=${size}&show=${updateRep}`,
    );
    setTimeout(() => {
      focusElement('.poa-request__meta');
    }, 500);
  };
  const isChecked = () => {
    const getShowStatus = searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL);
    return getShowStatus !== 'all';
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
