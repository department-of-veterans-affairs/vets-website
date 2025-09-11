import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import EditPhonePage from '../../../components/EditPhonePage';

function createMockStore(getStateValue = {}) {
  return {
    getState: () => getStateValue,
    dispatch: sinon.spy(),
    subscribe: () => {},
  };
}

const mockSchema = {
  type: 'object',
  properties: {
    phone: {
      type: 'string',
    },
  },
};

const mockUiSchema = {
  phone: { 'ui:title': 'Phone number' },
};

const mockData = {
  'view:phoneSource': 'home',
  phone: '8005556666',
};

describe('EditPhonePage', () => {
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });

  it('renders phone input with correct labels and values', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const textInputs = container.querySelectorAll('input[type="text"]');
    expect(textInputs.length).to.equal(1);
    expect(container.textContent).to.include('Phone number');
    expect(container.textContent).to.include('Edit home phone number');
    expect(textInputs[0].value).to.equal('8005556666');
  });

  it('renders Update and Cancel buttons', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const vaButtons = container.querySelectorAll('va-button');
    const updateButton = Array.from(vaButtons).find(
      btn => btn.getAttribute('text')?.toLowerCase() === 'update',
    );
    const cancelButton = Array.from(vaButtons).find(
      btn => btn.getAttribute('text')?.toLowerCase() === 'cancel',
    );

    expect(vaButtons.length).to.eql(2);
    expect(updateButton).to.exist;
    expect(cancelButton).to.exist;
  });

  it('handler: onCancel navigates to review-and-submit if onReviewPage', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const store = createMockStore();
    const goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const cancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text')?.toLowerCase() === 'cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
      expect(sessionStorage.getItem('editContactInformation')).to.eq(
        'phone,cancel',
      );
    });
  });

  it('handler: onCancel navigates to contact-info if not onReviewPage', async () => {
    const store = createMockStore();
    const goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const cancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text')?.toLowerCase() === 'cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/veteran-contact-information')).to.be.true;
    });
  });

  it('handler: onUpdate navigates to review-and-submit if onReviewPage, and setFormData is called on change', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const store = createMockStore();
    const goToPathSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const phoneInput = container.querySelector('input[type="text"]');
    fireEvent.input(phoneInput, { target: { value: '8005556667' } });

    const form = container.querySelector('form');
    form.dispatchEvent(
      new window.Event('submit', { bubbles: true, cancelable: true }),
    );

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
      expect(setFormDataSpy.called).to.be.true;

      const lastCallArg = setFormDataSpy.lastCall.args[0];
      expect(lastCallArg.phone).to.equal('8005556667');
      expect(sessionStorage.getItem('editContactInformation')).to.eq(
        'phone,update',
      );
    });
  });

  it('topScrollElement is called', async () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <div name="topScrollElement" />
        <EditPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(container.querySelector('[name="topScrollElement"]')).to.exist;
    });
  });
});
