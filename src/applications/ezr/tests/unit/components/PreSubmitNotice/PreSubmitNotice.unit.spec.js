import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import PreSubmitNotice from '../../../../components/PreSubmitNotice';

describe('ezr <PreSubmitNotice>', () => {
  const getData = ({ submission = {}, formData = {}, showError = false }) => ({
    mockStore: {
      getState: () => ({
        form: {
          submission,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
    props: {
      formData,
      preSubmitInfo: {
        required: true,
        field: 'privacyAgreementAccepted',
      },
      showError,
      onSectionComplete: sinon.spy(),
    },
  });

  context('when the component renders', () => {
    it('should render the agreement checkbox', () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const {
        preSubmitInfo: { label, required, field },
      } = props;
      const selector = container.querySelector(`[name="${field}"]`);
      expect(selector).to.exist;
      expect(selector).to.have.attr('label', label);
      expect(selector).to.have.attr('required', `${required}`);
    });
  });

  context('when the form is submitted', () => {
    it('should not render error message if data value is `true`', () => {
      const { mockStore, props } = getData({
        formData: { privacyAgreementAccepted: true },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-checkbox');
      expect(selector).to.not.have.attr('error');
    });

    it('should not render error message if submission status is pending', () => {
      const { mockStore, props } = getData({
        submission: { status: 'submitPending' },
        formData: { privacyAgreementAccepted: true },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-checkbox');
      expect(selector).to.not.have.attr('error');
    });
  });

  context('when an error occurs', () => {
    it('should render error message if data value is `false` and `showError` is `true`', async () => {
      const { mockStore, props } = getData({ showError: true });
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-checkbox');
      await waitFor(() => {
        expect(selector).to.have.attr('error');
      });
    });
  });

  context('when the checkbox is "clicked"', () => {
    it('should fire `onSectionComplete` function', async () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-checkbox');
      selector.__events.vaChange({ target: { checked: true } });
      await waitFor(() => {
        expect(props.onSectionComplete.called).to.be.true;
      });
    });
  });
});
