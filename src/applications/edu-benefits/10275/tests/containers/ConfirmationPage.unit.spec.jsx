import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';

import formConfig from '../../config/form';
import ConfirmationPage, {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
} from '../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

before(() => {
  if (!global.scrollTo) global.scrollTo = () => {};
});

const getPage = (data = {}, submission) =>
  render(
    <Provider
      store={mockStore({
        form: {
          ...createInitialState(formConfig),
          data,
          submission,
        },
      })}
    >
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );

describe('ConfirmationPage', () => {
  afterEach(cleanup);

  describe('<ConfirmationSubmissionAlert />', () => {
    it('shows process list section', () => {
      const { getByText } = render(<ConfirmationSubmissionAlert />);

      expect(getByText(/If we have any further questions/)).to.exist;
    });
  });

  describe('<ConfirmationPrintThisPage />', () => {
    it('should handle rendering summary box when no details are provided', () => {
      const data = {
        authorizedOfficial: {
          fullName: {},
        },
      };
      const submission = {};
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submission={submission} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('---');
      expect(getByTestId('data-submitted').innerHTML).to.contain('---');
    });

    it('should render summary box with provided details', () => {
      const data = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            middle: 'Test',
            last: 'Doe',
          },
        },
      };
      const submitDate = new Date('09/18/2025');
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submitDate={submitDate} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('John Test Doe');
      expect(getByTestId('data-submitted').innerHTML).to.contain(
        'Sep 18, 2025',
      );
    });
  });

  describe('<ConfirmationWhatsNextProcessList />', () => {
    it('shows process list section', () => {
      const { getByText } = render(<ConfirmationWhatsNextProcessList />);

      expect(getByText(/What to expect next/)).to.exist;
      expect(getByText(/Your form will be evaluated/)).to.exist;
    });
  });

  describe('<ConfirmationGoBackLink />', () => {
    it('should render an action link to go back to the VA.gov homepage', () => {
      const { container } = render(<ConfirmationGoBackLink />);

      expect(container.querySelector('va-link-action')).to.have.attribute(
        'text',
        'Go back to VA.gov',
      );
    });
  });

  it('shows success alert for "newCommitment" agreement type', () => {
    const { container, getByText } = getPage({
      agreementType: 'newCommitment',
    });

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );
    expect(getByText(/new commitment/)).to.exist;
  });

  it('shows success alert for "withdrawal" agreement type', () => {
    const { container, getByText } = getPage({
      agreementType: 'withdrawal',
    });

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );
    expect(getByText(/withdrawal of commitment/)).to.exist;
  });

  it('shows summary box with button to print page', () => {
    const { container } = getPage(
      {},
      {
        response: {
          attributes: {
            confirmationNumber: '1234567890',
          },
        },
        timestamp: new Date().toISOString(),
      },
    );

    expect(container.querySelector('va-summary-box')).to.exist;
    expect(container.querySelectorAll('va-summary-box h4').length).to.equal(3);
    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Print this page',
    );
  });
});
