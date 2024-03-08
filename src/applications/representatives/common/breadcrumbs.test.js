import { expect } from 'chai';
import { poaBreadcrumbs } from './breadcrumbs';

describe('breadcrumbs', () => {
  it('returns an array of breadcrumbs for the dashboard', () => {
    const breadcrumbs = poaBreadcrumbs('dashboard');
    expect(breadcrumbs).to.deep.equal([
      { link: '/', label: 'Home' },
      { link: '/dashboard', label: 'Dashboard' },
    ]);
  });

  it('returns an array of breadcrumbs for the permissions page', () => {
    const breadcrumbs = poaBreadcrumbs('permissions');
    expect(breadcrumbs).to.deep.equal([
      { link: '/', label: 'Home' },
      { link: '/permissions', label: 'Permissions' },
    ]);
  });

  it('returns an array of breadcrumbs for the poa-requests page', () => {
    const breadcrumbs = poaBreadcrumbs('poa-requests');
    expect(breadcrumbs).to.deep.equal([
      { link: '/', label: 'Home' },
      { link: '/poa-requests', label: 'POA requests' },
    ]);
  });

  it('returns an array of breadcrumbs for the default page', () => {
    const breadcrumbs = poaBreadcrumbs('default');
    expect(breadcrumbs).to.deep.equal([{ link: '/', label: 'Home' }]);
  });
});
