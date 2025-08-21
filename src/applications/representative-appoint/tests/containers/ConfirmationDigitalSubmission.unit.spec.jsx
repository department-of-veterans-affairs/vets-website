import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import moment from 'moment';
import ConfirmationDigitalSubmission from '../../containers/ConfirmationDigitalSubmission';
import mockFormData from '../fixtures/data/form-data.json';

const mockStore = state => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: () => ({}),
});

describe('<ConfirmationDigitalSubmission>', () => {
  let props;
  let mockFormStore;
  let container;

  beforeEach(() => {
    props = {
      formData: {
        submission: {
          timestamp: moment()
            .subtract(5, 'days')
            .toISOString(),
        },
        data: mockFormData,
      },
    };
    mockFormStore = mockStore({
      form: {
        submission: {
          timestamp: moment()
            .subtract(5, 'days')
            .toISOString(),
        },
        data: mockFormData,
      },
    });

    const renderResult = render(
      <Provider store={mockFormStore}>
        <ConfirmationDigitalSubmission {...props} />
      </Provider>,
    );

    container = renderResult.container;
  });

  it('should render the component', () => {
    expect(container).to.exist;
  });

  it('should display submission date correctly', () => {
    const dateSubmitted = moment(props.formData.submission.timestamp).format(
      'MMMM D, YYYY',
    );
    const content = $('va-alert', container);
    expect(content.textContent).to.contain(
      `You’ve submitted your form to appoint the accredited representative on ${dateSubmitted}`,
    );
  });

  context('when print button is clicked', () => {
    it('should call window.print', () => {
      const printSpy = sinon.spy(window, 'print');

      const printButton = container.querySelector('va-button');
      fireEvent.click(printButton);

      expect(printSpy.calledOnce).to.be.true;
      printSpy.restore();
    });
  });
});
