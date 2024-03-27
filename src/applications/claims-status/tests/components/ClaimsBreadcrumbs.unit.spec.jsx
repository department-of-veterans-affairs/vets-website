import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimsBreadcrumbs from '../../components/ClaimsBreadcrumbs';
import { CST_BREADCRUMB_BASE } from '../../constants';

describe('<ClaimsBreadcrumbs>', () => {
  it('should render base breadcrumbs', () => {
    const { container } = render(<ClaimsBreadcrumbs />);

    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs.breadcrumbList[0].href).to.equal(
      CST_BREADCRUMB_BASE[0].href,
    );
    expect(breadcrumbs.breadcrumbList[1].href).to.equal(
      CST_BREADCRUMB_BASE[1].href,
    );
  });
});
