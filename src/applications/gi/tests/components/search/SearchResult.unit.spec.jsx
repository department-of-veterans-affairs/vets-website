import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { SearchResult } from '../../../components/search/SearchResult';
import environment from 'platform/utilities/environment';

const result = {
  name: 'BENNETT COLLEGE',
  city: 'GREENSBORO',
  state: 'NC',
  country: 'USA',
  cautionFlags: [
    {
      id: null,
      title: 'School has an accreditation issue',
      description:
        "This school's accreditation has been taken away and is under appeal, or the school has been placed on probation, because it didn't meet acceptable levels of quality.",
      linkText: "Learn more about this school's accreditation",
      linkUrl: 'http://ope.ed.gov/accreditation/',
    },
  ],

  hbcu: 1,
  menonly: 0,
  relaffil: 71,
  womenonly: 1,
  alias: 'BC',
};

const estimated = {
  tuition: { qualifier: 'per year', value: 22805 },
  housing: { qualifier: 'per month', value: 1191 },
  books: { qualifier: 'per year', value: 1000 },
};

describe('<SearchResult>', () => {
  it('should render', () => {
    const tree = mount(
      <MemoryRouter>
        <SearchResult estimated={estimated} {...result} />,
      </MemoryRouter>,
    );
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });

  it('should render with gibctFilterEnhancement feature flag', () => {
    const tree = mount(
      <MemoryRouter>
        <SearchResult
          estimated={estimated}
          womenOnly={result.womenonly}
          menOnly={result.menonly}
          {...result}
          gibctFilterEnhancement
        />
      </MemoryRouter>,
    );
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });

  it('should not assign tooltip classes if in production', () => {
    const tree = mount(
      <MemoryRouter>
        <SearchResult estimated={estimated} {...result} />,
      </MemoryRouter>,
    );
    if (environment.isProduction()) {
      expect(tree.find('.tooltip')).to.have.lengthOf(0);
    }
    tree.unmount();
  });

  it('should not assign tooltip classes if alias not present', () => {
    const tree = mount(
      <MemoryRouter>
        <SearchResult estimated={estimated} {...result} alias={null} />,
      </MemoryRouter>,
    );
    if (!environment.isProduction()) {
      expect(tree.find('.tooltip')).to.have.lengthOf(0);
      expect(tree.find('.tooltip-text')).to.have.lengthOf(0);
    }
    tree.unmount();
  });

  it('should assign tooltip classes if alias is present', () => {
    const tree = mount(
      <MemoryRouter>
        <SearchResult estimated={estimated} {...result} />,
      </MemoryRouter>,
    );
    if (!environment.isProduction()) {
      expect(tree.find('.tooltip')).to.have.lengthOf(1);
      expect(tree.find('.tooltip-text')).to.have.lengthOf(1);
      expect(tree.find('.tooltip-text').html()).to.contain(result.alias);
    }
    tree.unmount();
  });
});
