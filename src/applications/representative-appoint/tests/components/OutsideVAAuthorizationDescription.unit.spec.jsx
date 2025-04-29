import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { OutsideVAAuthorizationDescription } from '../../components/OutsideVAAuthorizationDescription';
import { agent, attorney, org, vso } from '../fixtures/sparseFormDataExamples';

describe('<OutsideVAAuthorizationDescription>', () => {
  it('should render component', () => {
    const formData = vso;

    const { container } = render(
      <OutsideVAAuthorizationDescription formData={formData} />,
    );

    expect(container).to.exist;
  });

  context('when the selected representative is an attorney', () => {
    it('should include "Attorney"', () => {
      const formData = attorney;

      const { container } = render(
        <OutsideVAAuthorizationDescription formData={formData} />,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Attorney');
    });
  });

  context('when the selected representative is a claims agent', () => {
    it('should include "Claims Agent"', () => {
      const formData = agent;

      const { container } = render(
        <OutsideVAAuthorizationDescription formData={formData} />,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Claims Agent');
    });
  });

  context('when the selected representative is a vso representative', () => {
    it('should include "VSO Representative"', () => {
      const formData = vso;

      const { container } = render(
        <OutsideVAAuthorizationDescription formData={formData} />,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('VSO Representative');
    });
  });

  context('when the selected representative is an organization', () => {
    it('should include "Organization"', () => {
      const formData = org;

      const { container } = render(
        <OutsideVAAuthorizationDescription formData={formData} />,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Organization');
    });
  });

  context('when there is no selected rep', () => {
    it('should include "VSO Representative"', () => {
      const formData = {};

      const { container } = render(
        <OutsideVAAuthorizationDescription formData={formData} />,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('VSO Representative');
    });
  });
});
