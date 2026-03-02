import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import EditEmail from '../../pages/editEmail';

describe('EditEmail', () => {
  const mockStore = configureStore([]);

  const getDefaultStore = (formData = {}) =>
    mockStore({
      form: {
        data: {
          email: 'test@example.com',
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
        <EditEmail {...props} />
      </Provider>,
    );

    expect(container).to.exist;
  });

  it('should render the email input field', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    const emailInput = container.querySelector('va-text-input[name="email"]');
    expect(emailInput).to.exist;
    expect(emailInput.getAttribute('type')).to.equal('email');
  });

  it('should render the header', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { getByText } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    expect(getByText('Edit your contact information')).to.exist;
  });

  it('should render the info alert', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
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
        <EditEmail {...props} />
      </Provider>,
    );

    const buttons = container.querySelectorAll('va-button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].getAttribute('text')).to.equal('Update');
    expect(buttons[1].getAttribute('text')).to.equal('Cancel');
  });

  it('should initialize email from form data', () => {
    const store = getDefaultStore({ email: 'prefilled@test.com' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    const emailInput = container.querySelector('va-text-input[name="email"]');
    expect(emailInput.getAttribute('value')).to.equal('prefilled@test.com');
  });

  it('should navigate back when Cancel is clicked', () => {
    const store = getDefaultStore();
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    const cancelButton = container.querySelectorAll('va-button')[1];
    fireEvent.click(cancelButton);

    expect(props.goToPath.calledWith('/applicant-contact-info-logged-in')).to.be
      .true;
  });

  it('should show error for empty email', async () => {
    const store = getDefaultStore({ email: '' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const emailInput = container.querySelector('va-text-input[name="email"]');
      expect(emailInput.getAttribute('error')).to.equal(
        'Please provide a response.',
      );
    });
  });

  it('should show error for invalid email format', async () => {
    const store = getDefaultStore({ email: 'invalid-email' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const emailInput = container.querySelector('va-text-input[name="email"]');
      expect(emailInput.getAttribute('error')).to.equal(
        'Enter a valid email address using the format email@domain.com.',
      );
    });
  });

  it('should show error for email with invalid characters', async () => {
    const store = getDefaultStore({ email: 'test@example,com' });
    const props = getDefaultProps();

    const { container } = render(
      <Provider store={store}>
        <EditEmail {...props} />
      </Provider>,
    );

    const updateButton = container.querySelectorAll('va-button')[0];
    fireEvent.click(updateButton);

    await waitFor(() => {
      const emailInput = container.querySelector('va-text-input[name="email"]');
      expect(emailInput.getAttribute('error')).to.include(
        'You entered a character we',
      );
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
        <EditEmail {...props} />
      </Provider>,
    );

    expect(getByTestId('before-buttons')).to.exist;
    expect(getByTestId('after-buttons')).to.exist;
  });
});
