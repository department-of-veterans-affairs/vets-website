import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import PreSubmitInfo from '../../../containers/PreSubmitInfo';
import formConfig from '../../../config/form';

describe('<PreSubmitInfo>', () => {
  const getData = () => ({
    props: {
      formData: {
        privacyAgreementAccepted: false,
      },
      formConfig,
      route: {
        path: 'introduction',
      },
      router: {
        push: sinon.spy(),
      },
      setPreSubmit: sinon.mock(),
      showError: sinon.mock(),
    },
    mockStore: {
      getState: () => ({
        form: {
          formId: 'T-QSTNR',
          data: {},
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ mockStore, props }) =>
    render(
      <Provider store={mockStore}>
        <PreSubmitInfo {...props} />
      </Provider>,
    );

  context('when the container renders', () => {
    it('should contain the privacy agreement', () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selectors = {
        privacyAgreement: container.querySelector(
          '[name="privacyAgreementAccepted"]',
        ),
      };

      expect(selectors.privacyAgreement).to.exist;
    });

    it('should handle checkbox clicked', async () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });

      const selector = container.querySelector('va-privacy-agreement');

      fireEvent.change(selector, { target: { checked: true } });

      await waitFor(() => {
        expect(selector.checked).to.be.true;
      });
    });
  });
});
