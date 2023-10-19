import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import InsurancePolicyInformation from '../../../../components/FormPages/InsurancePolicyInformation';
import content from '../../../../locales/en/content.json';

describe('ezr InsurancePolicyInformation', () => {
  const defaultProps = {
    data: { providers: [] },
    goToPath: sinon.spy(),
    setFormData: sinon.spy(),
  };

  context('when the component renders', () => {
    it('should render form object with the correct title', () => {
      const { container } = render(
        <InsurancePolicyInformation {...defaultProps} />,
      );
      const selectors = {
        form: container.querySelector('.rjsf'),
        title: container.querySelector('.schemaform-block-title'),
      };
      expect(selectors.form).to.exist;
      expect(selectors.title).to.contain.text(
        content['insurance-policy-information-title'],
      );
    });

    it('should render cancel button to trigger confirmation modal', () => {
      const { container } = render(
        <InsurancePolicyInformation {...defaultProps} />,
      );
      const selector = container.querySelector('#ezr-modal-cancel');
      expect(selector).to.exist;
    });

    it('should render form navigation buttons', () => {
      const { container } = render(
        <InsurancePolicyInformation {...defaultProps} />,
      );
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        continueBtn: container.querySelector('.usa-button-primary'),
      };
      expect(selectors.backBtn).to.exist;
      expect(selectors.continueBtn).to.exist;
    });
  });
});
