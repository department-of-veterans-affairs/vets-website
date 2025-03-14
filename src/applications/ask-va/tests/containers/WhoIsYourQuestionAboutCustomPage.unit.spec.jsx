import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { whoIsYourQuestionAboutLabels } from '../../constants';
import WhoIsYourQuestionAboutCustomPage from '../../containers/WhoIsYourQuestionAboutCustomPage';

const generateStore = (formData = {}) => ({
  dispatch: sinon.spy(),
  subscribe: sinon.spy(),
  getState: () => ({
    form: {
      data: {
        whoIsYourQuestionAbout: '',
        selectCategory: '',
        selectTopic: '',
        selectSubtopic: '',
        ...formData,
      },
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
    },
  }),
});

describe('WhoIsYourQuestionAboutCustomPage', () => {
  let store;
  let defaultProps;

  beforeEach(() => {
    store = generateStore();

    defaultProps = {
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      onChange: sinon.spy(),
    };
  });

  const renderComponent = (props = defaultProps) => {
    const { container, getByText } = render(
      <Provider store={store}>
        <WhoIsYourQuestionAboutCustomPage {...props} />
      </Provider>,
    );

    return {
      container,
      radio: container.querySelector('va-radio'),
      getByText,
    };
  };

  it('should render the component and radio options', () => {
    const { container } = renderComponent();
    const options = container.querySelectorAll('va-radio-option');

    expect(options[0].getAttribute('label')).to.eq('Myself');
    expect(options[1].getAttribute('label')).to.eq('Someone else');
    expect(options[2].getAttribute('label')).to.eq("It's a general question");
  });

  describe('handleChange', () => {
    it('should update form data when selecting "Myself"', () => {
      const { radio } = renderComponent();

      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'Myself' },
          bubbles: true,
          composed: true,
        }),
      );

      expect(defaultProps.onChange.called).to.be.true;
      const changeArg = defaultProps.onChange.firstCall.args[0];
      expect(changeArg.whoIsYourQuestionAbout).to.equal('Myself');
      expect(changeArg.yourQuestionRequiresSignIn).to.be.true;
    });

    it('should update form data when selecting "Someone else"', () => {
      const { radio } = renderComponent();

      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'Someone else' },
          bubbles: true,
          composed: true,
        }),
      );

      expect(defaultProps.onChange.called).to.be.true;
      const changeArg = defaultProps.onChange.firstCall.args[0];
      expect(changeArg.whoIsYourQuestionAbout).to.equal('Someone else');
      expect(changeArg.yourQuestionRequiresSignIn).to.be.true;
    });

    it('should update form data when selecting "It\'s a general question"', () => {
      const { radio } = renderComponent();

      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: "It's a general question" },
          bubbles: true,
          composed: true,
        }),
      );

      expect(defaultProps.onChange.called).to.be.true;
      const changeArg = defaultProps.onChange.firstCall.args[0];
      expect(changeArg.whoIsYourQuestionAbout).to.equal(
        "It's a general question",
      );
      expect(changeArg.yourQuestionRequiresSignIn).to.be.false;
    });
  });

  describe('navigation', () => {
    it('should call goBack when back button is clicked', () => {
      const { getByText } = renderComponent();
      const backButton = getByText('Back');

      fireEvent.click(backButton);

      expect(defaultProps.goBack.called).to.be.true;
    });
  });

  describe('showError function', () => {
    it('should show error when no selection is made', async () => {
      const { container } = renderComponent();
      const continueButton = container.querySelector('.usa-button-primary');

      // Click continue without making a selection
      fireEvent.click(continueButton);

      // Wait for the error to be set
      await waitFor(() => {
        const radio = container.querySelector('va-radio');
        expect(radio.getAttribute('error')).to.equal(
          'Please select who your question is about',
        );
      });
    });

    it('should call goForward when a selection is made', async () => {
      const { radio } = renderComponent();

      // First make a radio selection and update store
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: whoIsYourQuestionAboutLabels.MYSELF },
          bubbles: true,
          composed: true,
        }),
      );

      // Update store state to match selection
      store = generateStore({
        whoIsYourQuestionAbout: whoIsYourQuestionAboutLabels.MYSELF,
      });

      // Re-render with updated store
      const { container: newContainer } = renderComponent();
      const continueButton = newContainer.querySelector('.usa-button-primary');
      fireEvent.click(continueButton);

      // Should call goForward with the form data
      expect(defaultProps.goForward.called).to.be.true;
      const forwardArg = defaultProps.goForward.firstCall.args[0];
      expect(forwardArg.whoIsYourQuestionAbout).to.equal(
        whoIsYourQuestionAboutLabels.MYSELF,
      );
    });
  });
});
