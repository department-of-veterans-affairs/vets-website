import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
<<<<<<< HEAD

=======
>>>>>>> main
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import content from '../../../../locales/en/content.json';

describe('CG <ConfirmationScreenView>', () => {
<<<<<<< HEAD
  const getData = ({ timestamp = undefined }) => ({
    props: {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      timestamp,
    },
    mockStore: {
=======
  const subject = ({ timestamp = undefined } = {}) => {
    const props = {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      route: { formConfig: {} },
      timestamp,
    };
    const mockStore = {
>>>>>>> main
      getState: () => ({
        form: {
          submission: {
            response: undefined,
            timestamp: undefined,
          },
          data: { veteranFullName: {} },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
<<<<<<< HEAD
    },
  });
  const subject = ({ mockStore, props }) =>
    render(
=======
    };
    const { container } = render(
>>>>>>> main
      <Provider store={mockStore}>
        <ConfirmationScreenView {...props} />
      </Provider>,
    );
<<<<<<< HEAD

  it('should render with default props', () => {
    const { mockStore, props } = getData({});
    const { container, getByText, getByTitle } = subject({ mockStore, props });

    const selectors = {
      veteranName: container.querySelector(
        '[data-testid="cg-veteran-fullname"]',
      ),
      download: container.querySelector('.caregiver-application--download'),
      printDescription: getByText(
        /You can print this confirmation page for your records. You can also download your completed application as a/,
      ),
      abbreviation: getByTitle('Portable Document Format'),
    };
    expect(selectors.veteranName).to.contain.text('John Marjorie Smith Sr.');
    expect(selectors.download).to.not.be.empty;
    expect(selectors.printDescription).to.exist;
    expect(selectors.abbreviation).to.exist;
    expect(selectors.abbreviation).to.have.text('PDF');
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const { mockStore, props } = getData({});
    const { container } = subject({ mockStore, props });
    const selector = container.querySelector(
      '[data-testid="cg-submission-date"]',
    );
    expect(selector).to.not.exist;
  });

  it('should render timestamp in `application information` section when provided', () => {
    const { mockStore, props } = getData({ timestamp: 1666887649663 });
    const { container } = subject({ mockStore, props });
    const selector = container.querySelector(
      '[data-testid="cg-submission-date"]',
    );
    expect(selector).to.exist;
    expect(selector).to.contain.text('Oct. 27, 2022');
  });

  it('should render application print button', () => {
    const { mockStore, props } = getData({});
    const { container } = subject({ mockStore, props });
    const selector = container.querySelector('[data-testid="cg-print-button"]');
    expect(selector).to.exist;
    expect(selector).to.have.attr('text', content['button-print']);
=======
    const selectors = () => ({
      veteranName: container.querySelector(
        '[data-testid="cg-veteran-fullname"]',
      ),
      submissionDate: container.querySelector(
        '[data-testid="cg-submission-date"]',
      ),
      printBtn: container.querySelector('[data-testid="cg-print-button"]'),
    });
    return { selectors };
  };

  it('should render the appropriate Veteran name', () => {
    const { selectors } = subject();
    const { veteranName } = selectors();
    expect(veteranName).to.contain.text('John Marjorie Smith Sr.');
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const { selectors } = subject();
    const { submissionDate } = selectors();
    expect(submissionDate).to.not.exist;
  });

  it('should render timestamp in `application information` section when provided', () => {
    const { selectors } = subject({ timestamp: 1666887649663 });
    const { submissionDate } = selectors();
    expect(submissionDate).to.exist;
    expect(submissionDate).to.contain.text('Oct. 27, 2022');
  });

  it('should render application print button', () => {
    const { selectors } = subject();
    const { printBtn } = selectors();
    expect(printBtn).to.exist;
    expect(printBtn).to.have.attr('text', content['button-print']);
>>>>>>> main
  });

  it('should fire `window.print` function when the print button is clicked', () => {
    const printSpy = sinon.spy(window, 'print');
<<<<<<< HEAD
    const { mockStore, props } = getData({});
    const { container } = subject({ mockStore, props });
    const selector = container.querySelector('[data-testid="cg-print-button"]');
    fireEvent.click(selector);
=======
    const { selectors } = subject();
    const { printBtn } = selectors();

    fireEvent.click(printBtn);
>>>>>>> main
    expect(printSpy.called).to.be.true;
  });
});
