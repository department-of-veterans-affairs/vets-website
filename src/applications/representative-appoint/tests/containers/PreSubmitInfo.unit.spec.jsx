import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { act, render, waitFor } from '@testing-library/react';
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
            middle: 'E',
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

    expect(content.textContent).to.contain('John E Doe Sr.');
  });

  it('should include the representative name', () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);
    const content = $('va-accordion-item', container);

    expect(content.textContent).to.contain('American Legion');
  });

  context('initial state', () => {
    it('should have all checkboxes unchecked by default', () => {
      const { props, mockStore } = getProps();
      const { container } = renderContainer(props, mockStore);
      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');
      const ppBox = container.querySelector('va-privacy-agreement');

      expect(tcBox.checked).to.be.false;
      expect(frBox.checked).to.be.false;
      expect(ppBox).to.exist;
    });
  });

  context('when checkboxes are interacted with', () => {
    it('resets onSectionComplete when a checkbox is unchecked', async () => {
      const { props, mockStore } = getProps({ status: null });
      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');
      const ppBox = container.querySelector('va-privacy-agreement');

      // Check all checkboxes
      act(() => {
        tcBox.__events.vaChange({ detail: { checked: true } });
        frBox.__events.vaChange({ detail: { checked: true } });
        ppBox.__events.vaChange({ detail: { checked: true } });
      });

      // Uncheck one box
      act(() => {
        tcBox.__events.vaChange({ detail: { checked: false } });
      });

      await waitFor(() => {
        expect(props.onSectionComplete.calledWith(false)).to.be.true;
      });
    });
  });

  context('error states', () => {
    it('shows errors for unchecked checkboxes', async () => {
      const { props, mockStore } = getProps({ showError: true, status: null });
      const { container } = renderContainer(props, mockStore);
      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');
      const ppBox = container.querySelector('va-privacy-agreement');

      await waitFor(() => {
        expect(tcBox).to.have.attr('error', 'This field is mandatory');
        expect(frBox).to.have.attr('error', 'This field is mandatory');
        expect(ppBox).to.have.attr('show-error');
      });
    });

    it('clears error states when checkboxes are checked', async () => {
      const { props, mockStore } = getProps({ showError: true, status: null });
      const { container } = renderContainer(props, mockStore);
      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');
      const ppBox = container.querySelector('va-privacy-agreement');

      // Check all boxes
      act(() => {
        tcBox.__events.vaChange({ detail: { checked: true } });
        frBox.__events.vaChange({ detail: { checked: true } });
        ppBox.__events.vaChange({ detail: { checked: true } });
      });

      await waitFor(() => {
        expect(tcBox).to.not.have.attr('error');
        expect(frBox).to.not.have.attr('error');
        expect(ppBox).to.have.attr('show-error', 'false');
      });
    });
  });

  context('when terms and conditions and form replacement are accepted', () => {
    it('calls onSectionComplete with false if Privacy Policy is not accepted', async () => {
      const { props, mockStore } = getProps({ status: null });
      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');

      act(() => {
        tcBox.__events.vaChange({ detail: { checked: true } });
        frBox.__events.vaChange({ detail: { checked: true } });
      });

      await waitFor(() => {
        expect(props.onSectionComplete.calledWith(false)).to.be.true;
      });
    });
  });

  context('when all checkboxes are accepted', () => {
    it('calls onSectionComplete with true', async () => {
      const { props, mockStore } = getProps({ status: null });
      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');
      const ppBox = container.querySelector('va-privacy-agreement');

      act(() => {
        tcBox.__events.vaChange({ detail: { checked: true } });
        frBox.__events.vaChange({ detail: { checked: true } });
        ppBox.__events.vaChange({ detail: { checked: true } });
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

      act(() => {
        tcBox.__events.vaChange({ detail: { checked: true } });
      });

      await waitFor(() => {
        expect(props.onSectionComplete.calledWith(false)).to.be.true;
      });
    });

    it('shows an error message for form replacement and Privacy Policy', async () => {
      const { props, mockStore } = getProps({ showError: true, status: null });
      const { container } = renderContainer(props, mockStore);

      const tcBox = container.querySelector(
        '[data-testid="terms-and-conditions"]',
      );
      const frBox = container.querySelector('[data-testid="form-replacement"]');
      const ppBox = container.querySelector('va-privacy-agreement');

      act(() => {
        tcBox.__events.vaChange({ detail: { checked: true } });
      });

      await waitFor(() => {
        expect(frBox).to.have.attr('error', 'This field is mandatory');
        expect(ppBox).to.have.attr('show-error');
      });
    });
  });

  context('when Privacy Policy is not accepted', () => {
    it('shows an error message for Privacy Policy', async () => {
      const { props, mockStore } = getProps({ showError: true, status: null });
      const { container } = renderContainer(props, mockStore);
      const ppBox = container.querySelector('va-privacy-agreement');

      await waitFor(() => {
        expect(ppBox).to.have.attr('show-error');
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
