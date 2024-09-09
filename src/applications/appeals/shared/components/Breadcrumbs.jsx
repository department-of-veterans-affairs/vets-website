import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const root = '/decision-reviews';
const sc = `${root}/supplemental-claim`;
const hlr = `${root}/higher-level-review`;
const nod = `${root}/board-appeal`;

const breadcrumbData = {
  sc: [
    { label: 'Supplemental Claim', href: sc },
    {
      label: 'File a Supplemental Claim',
      href: `${sc}/file-supplemental-claim-form-20-0995`,
    },
  ],
  hlr: [
    { label: 'Higher\u2011Level Reviews', href: hlr },
    {
      label: 'Request a Higher\u2011Level Review',
      href: `${hlr}/request-higher-level-review-form-20-0996`,
    },
  ],
  nod: [
    { label: 'Board Appeals', href: nod },
    {
      label: 'Request a Board Appeal',
      href: `${nod}/request-board-appeal-form-10182`,
    },
  ],
};

export const wrapWithBreadcrumb = (id, component) => (
  <>
    <div className="row">
      <VaBreadcrumbs
        class="va-nav-breadcrumbs"
        wrapping
        label="Breadcrumb"
        breadcrumbList={[
          { href: '/', label: 'Home' },
          { href: root, label: 'Decision reviews and appeals' },
          breadcrumbData[id][0],
          breadcrumbData[id][1],
        ]}
      />
    </div>
    {component}
  </>
);
