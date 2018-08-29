import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import { ResolvedLink, mapStateToProps } from '../../containers/ResolvedLink';

describe('<ResolvedLink/>', () => {
  let state = null;

  beforeEach(() => {
    state = {
      buildSettings: {
        brandConsolidation: {
          enabled: true
        }
      }
    };
  });

  const ROUTES = [
    {
      'vets.gov': '/health-care/apply/',
      'va.gov': '/health-care/how-to-apply/'
    }
  ];

  it('replaces HREF values with the VA.gov path if that Vets.gov value exists in redirects.json', () => {
    const link = <a className="test" href="/health-care/apply/">Apply now</a>;
    const props = mapStateToProps(state, { children: link }, ROUTES);
    const wrapper = enzyme.shallow(
      <ResolvedLink {...props}>
        {link}
      </ResolvedLink>
    );

    expect(wrapper.html()).to.be.equal('<a class="test" href="/health-care/how-to-apply/">Apply now</a>');
  });

  it('does not replace the HREF if brandConsolidation is not enabled', () => {
    state.buildSettings.brandConsolidation.enabled = false;
    const link = <a className="test" href="/health-care/apply/">Apply now</a>;
    const props = mapStateToProps(state, { children: link }, ROUTES);
    const wrapper = enzyme.shallow(
      <ResolvedLink {...props}>
        {link}
      </ResolvedLink>
    );

    expect(wrapper.html()).to.be.equal('<a class="test" href="/health-care/apply/">Apply now</a>');
  });

  it('does not replace the HREF it the route is not found during the lookup', () => {
    const link = <a className="test" href="/health-care/apply/">Apply now</a>;
    const props = mapStateToProps(state, { children: link }, []);
    const wrapper = enzyme.shallow(
      <ResolvedLink {...props}>
        {link}
      </ResolvedLink>
    );

    expect(wrapper.html()).to.be.equal('<a class="test" href="/health-care/apply/">Apply now</a>');
  });
});
