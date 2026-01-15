import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import EditPhone from '../../pages/editPhone';

describe('EditPhone', () => {
  const mockStore = configureStore([]);

  const getDefaultStore = (formData = {}) =>
    mockStore({
      form: {
        data: {
          phoneNumber: '1234567890',
          ...formData,
        },
      },
    });

  const getDefaultProps = () => ({
    goToPath: sinon.spy(),
    contentBeforeButtons: null,
    contentAfterButtons: null,
  });

  it('should render', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    expect(container).to.exist;
  });

  it('should render the phone input field', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const phoneInput = container.querySelector('va-text-input[name="phone"]');
    expect(phoneInput).to.exist;
    expect(phoneInput.getAttribute('type')).to.equal('tel');
  });

  it('should render the header', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { getByText } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    expect(getByText('Edit your contact information')).to.exist;
  });

  it('should render the info alert', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
  });

  it('should render Update and Cancel buttons', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const buttons = container.querySelectorAll('va-button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].getAttribute('text')).to.equal('Update');
    expect(buttons[1].getAttribute('text')).to.equal('Cancel');
  });

  it('should initialize phone from form data', () => {
    const store = getDefaultStore({ phoneNumber: '9876543210' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const phoneInput = container.querySelector('va-text-input[name="phone"]');
    expect(phoneInput.getAttribute('value')).to.equal('9876543210');
  });

  it('should navigate back when Cancel is clicked', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const cancelButton = container.querySelectorAll('va-button')[1];
    fireEvent.click(cancelButton);

    expect(props.goToPath.calledWith('/applicant-contact-info-logged-in')).to.be
      .true;
  });

  it('should show error for empty phone', async () => {
    const store = getDefaultStore({ phoneNumber: '' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const phoneInput = container.querySelector('va-text-input[name="phone"]');
      expect(phoneInput.getAttribute('error')).to.equal(
        'Please provide a response.',
      );
    });
  });

  it('should show error for phone with invalid characters', async () => {
    const store = getDefaultStore({ phoneNumber: '123-456-abcd' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const phoneInput = container.querySelector('va-text-input[name="phone"]');
      expect(phoneInput.getAttribute('error')).to.include(
        'You entered a character we',
      );
    });
  });

  it('should show error for phone with less than 10 digits', async () => {
    const store = getDefaultStore({ phoneNumber: '123456789' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const phoneInput = container.querySelector('va-text-input[name="phone"]');
      expect(phoneInput.getAttribute('error')).to.equal(
        'This field should be at least 10 character(s)',
      );
    });
  });

  it('should accept phone with valid format including dashes and parentheses', async () => {
    const store = getDefaultStore({ phoneNumber: '(123)456-7890' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const phoneInput = container.querySelector('va-text-input[name="phone"]');
      // No error should be set for valid phone
      expect(phoneInput.getAttribute('error')).to.be.null;
    });
  });

  it('should render contentBeforeButtons and contentAfterButtons', () => {
    const store = getDefaultStore();
    const props = {
      ...getDefaultProps(),
      contentBeforeButtons: <div data-testid="before-buttons">Before</div>,
      contentAfterButtons: <div data-testid="after-buttons">After</div>,
    };

    const { getByTestId } = render(
      <Provider store={store}>
        <EditPhone {...props} />
      </Provider>,
    );

    expect(getByTestId('before-buttons')).to.exist;
    expect(getByTestId('after-buttons')).to.exist;
  });
});
