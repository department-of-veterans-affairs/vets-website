import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { PreSubmitInfo } from '../../../containers/PreSubmitInfo';

describe('<PreSubmitInfo>', () => {
  let setPreSubmitSpy;
  const getProps = () => ({
    props: {
      formData: {
        privacyAgreementAccepted: false,
      },
      setPreSubmit: setPreSubmitSpy,
      showError: sinon.mock(),
    },
  });

  beforeEach(() => {
    setPreSubmitSpy = sinon.spy();
  });

  context('when the component renders', () => {
    it('contains the privacy agreement', () => {
      const { props } = getProps();
      const { container } = render(<PreSubmitInfo {...props} />);
      const selectors = {
        privacyAgreement: container.querySelector(
          '[name="privacyAgreementAccepted"]',
        ),
      };

      expect(selectors.privacyAgreement).to.exist;
    });

    it('sets privacyAgreementAccepted to false on mount', () => {
      const { props } = getProps();
      render(<PreSubmitInfo {...props} />);

      expect(setPreSubmitSpy.calledWith('privacyAgreementAccepted', false)).to
        .be.true;
    });

    it('calls setPreSubmit with true when user accepts the agreement', async () => {
      const { props } = getProps();
      const { container } = render(<PreSubmitInfo {...props} />);

      const vaPrivacyAgreement = container.querySelector(
        'va-privacy-agreement',
      );

      const customEvent = new CustomEvent('vaChange', {
        detail: { checked: true },
        bubbles: true,
      });

      vaPrivacyAgreement.dispatchEvent(customEvent);

      await waitFor(() => {
        expect(setPreSubmitSpy.calledWith('privacyAgreementAccepted', true)).to
          .be.true;
      });
    });
  });
});
