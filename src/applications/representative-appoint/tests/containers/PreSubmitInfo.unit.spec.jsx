import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import PreSubmitInfo from '../../containers/PreSubmitInfo';
import repResults from '../fixtures/data/representative-results.json';

describe('<PreSubmitInfo>', () => {
  const getProps = ({
    showError = false,
    status = 'applicationSubmitted',
  } = {}) => {
    return {
      props: {
        formData: {
          veteranFullName: {
            first: 'John',
            middle: 'Edmund',
            last: 'Doe',
            suffix: 'Sr.',
          },
          selectedAccreditedOrganizationName: 'American Legion',
          'view:applicantIsVeteran': 'Yes',
          'view:selectedRepresentative': repResults[0].data,
        },
        showError,
        onSectionComplete: sinon.spy(),
        formSubmission: { status },
      },
      mockStore: {
        getState: () => ({
          form: {
            submission: { status },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      },
    };
  };

  const renderContainer = (props, mockStore) => {
    return render(
      <Provider store={mockStore}>
        <PreSubmitInfo {...props} />
      </Provider>,
    );
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);

    expect(container).to.exist;
  });

  it('should include the applicant name', () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);
    const content = $('va-accordion-item', container);

    expect(content.textContent).to.contain('John Edmund Doe Sr.');
  });

  it('should include the representative name', () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);
    const content = $('va-accordion-item', container);

    expect(content.textContent).to.contain('American Legion');
  });

  context('when terms and conditions and form replacement are accepted', () => {
    it('calls onSectionComplete with true', async () => {
      const { props, mockStore } = getProps({ status: null });

      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );

      tcBox.__events.vaChange({
        detail: { checked: true },
      });

      const frBox = container.querySelector('[data-testid="form-replacement"]');

      frBox.__events.vaChange({
        detail: { checked: true },
      });

      await waitFor(() => {
        expect(props.onSectionComplete.calledWith(true)).to.be.true;
      });
    });
  });

  context('when only terms and conditions is accepted', () => {
    it('calls onSectionComplete with false', async () => {
      const { props, mockStore } = getProps({ status: null });

      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );

      tcBox.__events.vaChange({
        detail: { checked: true },
      });

      await waitFor(() => {
        expect(props.onSectionComplete.calledWith(false)).to.be.true;
      });
    });

    it('shows an error message for form replacement', async () => {
      const { props, mockStore } = getProps({ showError: true, status: null });

      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );

      tcBox.__events.vaChange({
        detail: { checked: true },
      });

      const frBox = container.querySelector('[data-testid="form-replacement"]');

      await waitFor(() => {
        expect(frBox).to.have.attr('error', 'This field is mandatory');
      });
    });
  });

  context('when only form replacement is accepted', () => {
    it('calls onSectionComplete with false', async () => {
      const { props, mockStore } = getProps({ status: null });

      const { container } = renderContainer(props, mockStore);

      const frBox = container.querySelector('[data-testid="form-replacement"]');

      frBox.__events.vaChange({
        detail: { checked: true },
      });

      await waitFor(() => {
        expect(props.onSectionComplete.calledWith(false)).to.be.true;
      });
    });

    it('shows an error message for terms and conditions ', async () => {
      const { props, mockStore } = getProps({ showError: true, status: null });

      const { container } = renderContainer(props, mockStore);

      const frBox = container.querySelector('[data-testid="form-replacement"]');

      frBox.__events.vaChange({
        detail: { checked: true },
      });

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );

      await waitFor(() => {
        expect(tcBox).to.have.attr('error', 'This field is mandatory');
      });
    });
  });

  context('submission pending', () => {
    it('displays the loading message', () => {
      const { props, mockStore } = getProps({ status: 'submitPending' });

      const { container } = renderContainer(props, mockStore);

      expect(
        $('va-loading-indicator', container).getAttribute('message'),
      ).to.contain('We’re processing your form');
    });
  });
});
