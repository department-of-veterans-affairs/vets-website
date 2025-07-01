import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import FacilitySearch from '../../../../components/FormFields/FacilitySearch';
import { inputVaSearchInput } from '../../../test-helpers';
import content from '../../../../locales/en/content.json';

// declare error message content
const ERROR_MSG_SEARCH = content['validation-facilities--search-required'];
const ERROR_MSG_SUBMIT =
  content['validation-facilities--submit-search-required'];

describe('CG <FacilitySearch>', () => {
  const props = {
    data: {},
    goBack: f => f,
    goForward: f => f,
    goToPath: f => f,
  };
  const mockStore = {
    getState: () => {},
    subscribe: () => {},
    dispatch: () => {},
  };
  const subject = () => {
    const { container, getByText, queryByText, queryByRole } = render(
      <Provider store={mockStore}>
        <FacilitySearch {...props} />
      </Provider>,
    );
    const selectors = () => ({
      backBtn: getByText('Back'),
      continueBtn: getByText('Continue'),
      loadMoreBtn: container.vaButtonGetByText(
        content['form-facilities-load-more-button'],
      ),
      ariaLiveStatus: queryByRole('status'),
      searchInputError: queryByRole('alert'),
      vaRadio: container.querySelector('va-radio'),
      vaSearchInput: container.querySelector('va-search-input'),
    });
    return { container, selectors, getByText, queryByText };
  };
  const query = 'Tampa';

  it('should render correct element(s) when the page renders', () => {
    const { selectors, queryByText } = subject();
    const { ariaLiveStatus, loadMoreBtn, vaRadio, vaSearchInput } = selectors();
    expect(vaSearchInput).to.exist;
    expect(vaRadio).to.not.exist;
    expect(loadMoreBtn).to.not.exist;
    expect(ariaLiveStatus).to.not.exist;
    expect(queryByText(content['form-facilities-search-label'])).to.exist;
    expect(queryByText(content['validation-required-label'])).to.exist;
  });

  it('should render error when trying to click the continue button before selecting facility', async () => {
    const { container, selectors } = subject();
    const { continueBtn } = selectors();
    const parentElClass = 'caregiver-facilities-search-input-error';

    // try to continue without any search interactions
    fireEvent.click(continueBtn);
    await waitFor(() => {
      const { searchInputError } = selectors();
      expect(searchInputError.textContent).to.eq(`Error${ERROR_MSG_SEARCH}`);
      expect(searchInputError.parentElement).to.have.class(parentElClass);
    });

    // try to contiue after inputting a value into the search input
    inputVaSearchInput({ container, query, submit: false });
    fireEvent.click(continueBtn);
    await waitFor(() => {
      const { searchInputError } = selectors();
      expect(searchInputError.textContent).to.eq(`Error${ERROR_MSG_SUBMIT}`);
      expect(searchInputError.parentElement).to.have.class(parentElClass);
    });
  });
});
