import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import { BENEFITS_LIST } from '../../../constants/benefits';

describe('<ConfirmationPage>', () => {
  sinon.stub(Date, 'getTime');
  const getData = () => ({
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
          data: [BENEFITS_LIST[0]],
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
    const { mockStore, props } = getData();
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
