import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import CustomTopContent from '../../components/CustomTopContent';

const setup = (currentLocation = { pathname: '/introduction' }) => {
  return render(<CustomTopContent currentLocation={currentLocation} />);
};

describe('CustomTopContent', () => {
  it('renders Breadcrumbs on introduction page', () => {
    const { container } = setup();
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs).to.exist;
    expect(breadcrumbs).to.have.attr(
      'breadcrumb-list',
      '[{"href":"/","label":"VA.gov Home"},{"href":"/my-health","label":"My HealtheVet"},{"href":"/my-health/order-medical-supplies","label":"Order medical supplies"}]',
    );
  });

  it('renders Breadcrumbs on confirmation page', () => {
    const { container } = setup({ pathname: '/confirmation' });
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs).to.exist;
    expect(breadcrumbs).to.have.attr(
      'breadcrumb-list',
      '[{"href":"/","label":"VA.gov Home"},{"href":"/my-health","label":"My HealtheVet"},{"href":"/my-health/order-medical-supplies","label":"Order medical supplies"}]',
    );
  });

  it('doees not render Breadcrumbs on other pages', () => {
    const { container } = setup({ pathname: '/choose-supplies' });
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs).to.not.exist;
  });
});
