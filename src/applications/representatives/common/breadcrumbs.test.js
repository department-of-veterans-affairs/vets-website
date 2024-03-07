import { expect } from 'chai';
import { POAbreadcrumbs } from './breadcrumbs';

describe('breadcrumbs', () => {
  it('returns an array of breadcrumbs for the dashboard', () => {
    const breadcrumbs = POAbreadcrumbs('dashboard');
    expect(breadcrumbs).to.deep.equal([
      { link: '/', label: 'Home' },
      { link: '/dashboard', label: 'Dashboard' },
    ]);
  });

  it('returns an array of breadcrumbs for the permissions page', () => {
    const breadcrumbs = POAbreadcrumbs('permissions');
    expect(breadcrumbs).to.deep.equal([
      { link: '/', label: 'Home' },
      { link: '/permissions', label: 'Permissions' },
    ]);
  });

  it('returns an array of breadcrumbs for the poa-requests page', () => {
    const breadcrumbs = POAbreadcrumbs('poa-requests');
    expect(breadcrumbs).to.deep.equal([
      { link: '/', label: 'Home' },
      { link: '/poa-requests', label: 'POA requests' },
    ]);
  });

  it('returns an array of breadcrumbs for the default page', () => {
    const breadcrumbs = POAbreadcrumbs('default');
    expect(breadcrumbs).to.deep.equal([{ link: '/', label: 'Home' }]);
  });
});
