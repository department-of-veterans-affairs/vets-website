import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import content from '../../../../locales/en/content.json';

describe('CG <ConfirmationScreenView>', () => {
  const subject = ({ timestamp = undefined } = {}) => {
    const props = {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      route: { formConfig: {} },
      timestamp,
    };
    const mockStore = {
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
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationScreenView {...props} />
      </Provider>,
    );
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
  });

  it('should fire `window.print` function when the print button is clicked', () => {
    const printSpy = sinon.spy(window, 'print');
    const { selectors } = subject();
    const { printBtn } = selectors();

    fireEvent.click(printBtn);
    expect(printSpy.called).to.be.true;
  });
});
