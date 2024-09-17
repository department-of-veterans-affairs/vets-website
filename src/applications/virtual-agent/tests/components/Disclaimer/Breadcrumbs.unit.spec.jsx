import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import Breadcrumbs from '../../../components/Disclaimer/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render a va-breadcrumbs component', () => {
    const { container } = render(<Breadcrumbs />);
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs).to.not.be.null;
  });
});
