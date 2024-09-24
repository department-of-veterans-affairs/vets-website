import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import configureStore from 'redux-mock-store';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import { BENEFITS_LIST } from '../../../constants/benefits';

describe('<ConfirmationPage>', () => {
  sinon.stub(Date, 'getTime');
  const getData = resultsData => ({
    props: {
      formConfig,
      route: {
        path: 'confirmation',
      },
      router: {
        push: sinon.mock(),
        replace: sinon.mock(),
        goBack: sinon.mock(),
      },
      displayResults: sinon.mock(),
      setSubmission: sinon.mock(),
      location: {
        basename: '/benefit-eligibility-questionnaire',
        pathname: '/confirmation',
        query: {},
        search: '',
      },
    },
    mockStore: {
      getState: () => ({
        form: {
          formId: 'T-QSTNR',
          data: {
            giBillStatus: 'No',
            disabilityRating: 'No',
            'view:disabilityEligibility': {},
            characterOfDischarge: 'honorable',
            separation: 'upTo6mo',
            militaryServiceCompleted: 'No',
            militaryServiceCurrentlyServing: 'No',
            militaryServiceTotalTimeServed: 'More than 3 years',
            checkboxGroupGoals: {
              setACareerPath: true,
            },
            privacyAgreementAccepted: true,
          },
        },
        results: {
          data: resultsData,
          error: null,
          isError: false,
          isLoading: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ mockStore, props }) =>
    render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

  it('should render results page', () => {
    const { mockStore, props } = getData([BENEFITS_LIST[0]]);
    const { container } = subject({ mockStore, props });

    const ulQualified = container.querySelectorAll('ul.benefit-list');
    expect(container.querySelector('#results-container')).to.exist;
    expect(ulQualified[1].querySelectorAll('li')).to.have.lengthOf(1);
  });

  it('should render results page when query string is provided', () => {
    const { mockStore, props } = getData([]);
    props.location.query.benefits = 'SVC,FHV';
    const { container } = subject({ mockStore, props });

    expect(container.querySelector('#results-container')).to.exist;
  });

  it('should handle back link', async () => {
    const { mockStore, props } = getData();
    const { container } = subject({ mockStore, props });

    const backLink = container.querySelector('[data-testid="back-link"]');
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(props.router.goBack.called).to.be.true;
    });
  });
});

// Mock store configuration
const mockStore = configureStore([]);

// Mock benefit data
const mockBenefits = [
  {
    id: '1',
    name: 'Education',
    category: 'Education',
    isTimeSensitive: false,
  },
  {
    id: '2',
    name: 'Careers & Employment',
    category: 'Careers',
    isTimeSensitive: false,
  },
  {
    id: '3',
    name: 'More Support',
    category: 'Support',
    isTimeSensitive: false,
  },
];

describe('ConfirmationPage - sortBenefits and filterBenefits', () => {
  let wrapper;
  let store;

  const setup = storeState => {
    store = mockStore(storeState);
    return render(
      <Provider store={store}>
        <ConfirmationPage
          results={{ data: mockBenefits, isLoading: false }}
          location={{ basename: '/', pathname: '/confirmation', query: {} }}
        />
      </Provider>,
    );
  };

  it('should sort benefits alphabetically', () => {
    wrapper = setup({ results: { data: mockBenefits } });

    const sortSelect = wrapper.getByText(/Sort results by/i).nextSibling;
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames[0]).to.contain('Careers');
    expect(benefitNames[1]).to.contain('Education');
  });

  it('should filter benefits by category', () => {
    wrapper = setup({ results: { data: mockBenefits } });

    const filterSelect = wrapper.getByText(/Filter benefits by/i).nextSibling;
    fireEvent.change(filterSelect, { target: { value: 'Employment' } });

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);
    expect(benefitNames).to.have.lengthOf(8);
    expect(benefitNames[0]).to.contain('Education');
  });

  it('should show all benefits when "All" filter is selected', () => {
    wrapper = setup({ results: { data: mockBenefits } });

    const filterSelect = wrapper.getByText(/Filter benefits by/i).nextSibling;
    fireEvent.change(filterSelect, { target: { value: 'All' } });

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);
    expect(benefitNames).to.have.lengthOf(11);
    expect(benefitNames[0]).to.contain('Careers');
    expect(benefitNames[1]).to.contain('Education');
  });
});
