import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import TopicSelect from '../../containers/TopicSelectPage';
import { userData } from '../fixtures/data/mock-form-data';

const generateStore = (formData = {}) => ({
  dispatch: sinon.spy(),
  subscribe: sinon.spy(),
  getState: () => ({
    form: {
      data: {
        selectCategory: 'Benefits Issues Outside the US',
        selectTopic: '',
        ...formData,
      },
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: userData,
    },
    askVA: {
      categoryID: '2',
    },
  }),
});

describe('<TopicSelect /> component', () => {
  let store;
  let defaultProps;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    store = generateStore();
    defaultProps = {
      formContext: { reviewMode: false, submitted: undefined },
      id: 'root_selectTopic',
      onChange: sinon.spy(),
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      required: true,
      value: undefined,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderComponent = (props = defaultProps, customStore = store) => {
    const { container } = render(
      <Provider store={customStore}>
        <TopicSelect {...props} />
      </Provider>,
    );

    return {
      container,
    };
  };

  it('should get the topics list', async () => {
    const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    apiRequestStub.resolves({
      data: [
        {
          id: '6',
          type: 'topics',
          attributes: {
            name: 'Spider-man',
          },
        },
        {
          id: '7',
          type: 'topics',
          attributes: {
            name: 'Captain America',
          },
        },
        {
          id: '8',
          type: 'topics',
          attributes: {
            name: 'Iron man',
          },
        },
      ],
    });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(container.querySelector('va-loading-indicator')).to.not.exist;
    });

    const radio = container.querySelector('va-radio');
    expect(radio).to.exist;

    const options = container.querySelectorAll('va-radio-option');
    expect(options.length).to.equal(3);
    expect(options[0].getAttribute('label')).to.equal('Spider-man');
    expect(options[1].getAttribute('label')).to.equal('Captain America');
    expect(options[2].getAttribute('label')).to.equal('Iron man');
  });

  it('should show error alert when API request fails', async () => {
    const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    apiRequestStub.rejects(new Error('API Error'));

    const { container } = renderComponent();

    // First, we should see the loading indicator
    expect(container.querySelector('va-loading-indicator')).to.exist;

    // After the API call fails, loading should be false and error alert should be shown
    await waitFor(() => {
      expect(container.querySelector('va-loading-indicator')).to.not.exist;
      const errorHeading = container.querySelector('h2[slot="headline"]');
      expect(errorHeading).to.exist;
      // Just check that the error heading contains the expected text
      expect(errorHeading.textContent).to.include('sorry');
      expect(errorHeading.textContent).to.include('Something went wrong');
    });
  });

  describe('handleChange', () => {
    it('should update form data when selecting a topic', async () => {
      const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
      apiRequestStub.resolves({
        data: [
          {
            id: '6',
            type: 'topics',
            attributes: {
              name: 'Spider-man',
            },
          },
        ],
      });

      const { container } = renderComponent();

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      const radio = container.querySelector('va-radio');
      expect(radio).to.exist;

      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'Spider-man' },
          bubbles: true,
          composed: true,
        }),
      );

      expect(defaultProps.onChange.called).to.be.true;
      const changeArg = defaultProps.onChange.firstCall.args[0];
      expect(changeArg.selectTopic).to.equal('Spider-man');
      expect(changeArg.topicId).to.equal('6');
    });
  });

  describe('showError function', () => {
    it('should show error when no selection is made', async () => {
      const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
      apiRequestStub.resolves({
        data: [
          {
            id: '6',
            type: 'topics',
            attributes: {
              name: 'Spider-man',
            },
          },
        ],
      });

      const { container } = renderComponent();

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      const continueButton = container.querySelector('.usa-button-primary');
      expect(continueButton).to.exist;
      fireEvent.click(continueButton);

      await waitFor(() => {
        const radio = container.querySelector('va-radio');
        expect(radio.getAttribute('error')).to.equal('Select a topic');
      });
    });

    it('should call goForward when a selection is made', async () => {
      const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
      apiRequestStub.resolves({
        data: [
          {
            id: '6',
            type: 'topics',
            attributes: {
              name: 'Spider-man',
            },
          },
        ],
      });

      const { container } = renderComponent();

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      const radio = container.querySelector('va-radio');
      expect(radio).to.exist;

      // Make the selection
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'Spider-man' },
          bubbles: true,
          composed: true,
        }),
      );

      // Create new store with updated selection
      const updatedStore = generateStore({
        selectTopic: 'Spider-man',
        topicId: '6',
      });

      // Re-render with updated store
      const { container: newContainer } = renderComponent(
        defaultProps,
        updatedStore,
      );

      await waitFor(() => {
        expect(newContainer.querySelector('va-loading-indicator')).to.not.exist;
      });

      const continueButton = newContainer.querySelector('.usa-button-primary');
      expect(continueButton).to.exist;
      fireEvent.click(continueButton);

      expect(defaultProps.goForward.called).to.be.true;
      const forwardArg = defaultProps.goForward.firstCall.args[0];
      expect(forwardArg.selectTopic).to.equal('Spider-man');
    });
  });

  describe('navigation', () => {
    it('should call goBack when back button is clicked', async () => {
      const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
      apiRequestStub.resolves({
        data: [
          {
            id: '6',
            type: 'topics',
            attributes: {
              name: 'Spider-man',
            },
          },
        ],
      });

      const { container } = renderComponent();

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      const backButton = container.querySelector('.usa-button-secondary');
      expect(backButton).to.exist;
      fireEvent.click(backButton);

      expect(defaultProps.goBack.called).to.be.true;
    });
  });
});
