import React from 'react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimsBreadcrumbs from '../../components/ClaimsBreadcrumbs';
import { CST_BREADCRUMB_BASE } from '../../constants';
import { renderWithRouter } from '../utils';
// import { fireEvent } from '@testing-library/dom';

describe('<ClaimsBreadcrumbs>', () => {
  it('should render base breadcrumbs', () => {
    const { container } = renderWithRouter(<ClaimsBreadcrumbs />);

    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs.breadcrumbList[0].href).to.equal(
      CST_BREADCRUMB_BASE[0].href,
    );
    expect(breadcrumbs.breadcrumbList[1].href).to.equal(
      CST_BREADCRUMB_BASE[1].href,
    );
  });

  // it.only('when user clicks breadcrumbs should change route', () => {
  //   const crumb = {
  //     href: `../status`,
  //     label: 'Status',
  //     isRouterLink: true,
  //   };
  //   const { container, getByText } = renderWithRouter(
  //     <ClaimsBreadcrumbs crumbs={[crumb]} />,
  //   );

  //   const breadcrumbs = $('va-breadcrumbs', container);
  //   console.log('breadcrumbs', breadcrumbs.breadcrumbList);
  //   // breadcrumbs.breadcrumbList[1].__events.vaChange({
  //   //   detail: { checked: true },
  //   // });
  //   fireEvent.click(getByText('Status'));
  // });
});
