import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { SearchResult } from '../../components/search/SearchResult';

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
};

const estimated = {
  tuition: { qualifier: 'per year', value: 22805 },
  housing: { qualifier: 'per month', value: 1191 },
  books: { qualifier: 'per year', value: 1000 },
};

describe('<SearchResult>', () => {
  it('should render', () => {
    const tree = shallow(
      <SearchResult
        estimated={estimated}
        city={result.city}
        name={result.name}
        country={result.country}
        state={result.state}
        cautionFlags={result.cautionFlags}
        schoolClosing={result.schoolClosing}
      />,
    );
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });

  it('should render with gibctFilterEnhancement feature flag', () => {
    const tree = shallow(
      <SearchResult
        estimated={estimated}
        city={result.city}
        name={result.name}
        country={result.country}
        state={result.state}
        cautionFlags={result.cautionFlags}
        schoolClosing={result.schoolClosing}
        womenonly={result.womenonly}
        menonly={result.menonly}
        relaffil={result.relaffil}
        hbcu={result.relaffil}
        gibctFilterEnhancement
      />,
    );
    const vdom = tree.html();
    expect(vdom).to.not.be.undefined;
    tree.unmount();
  });
});
