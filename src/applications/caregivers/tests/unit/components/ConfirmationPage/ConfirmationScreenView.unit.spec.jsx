import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import content from '../../../../locales/en/content.json';

describe('CG <ConfirmationScreenView>', () => {
  const getData = ({ timestamp = undefined }) => ({
    props: {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      timestamp,
    },
    mockStore: {
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
    },
  });
  const subject = ({ mockStore, props }) =>
    render(
      <Provider store={mockStore}>
        <ConfirmationScreenView {...props} />
      </Provider>,
    );

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
  });

  it('should fire `window.print` function when the print button is clicked', () => {
    const printSpy = sinon.spy(window, 'print');
    const { mockStore, props } = getData({});
    const { container } = subject({ mockStore, props });
    const selector = container.querySelector('[data-testid="cg-print-button"]');
    fireEvent.click(selector);
    expect(printSpy.called).to.be.true;
  });
});
