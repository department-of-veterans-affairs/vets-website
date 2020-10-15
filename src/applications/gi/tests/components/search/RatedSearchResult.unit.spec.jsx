import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { MINIMUM_RATING_COUNT } from '../../../constants';

import { RatedSearchResult } from '../../../components/search/RatedSearchResult';

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
  ratingCount: MINIMUM_RATING_COUNT,
  ratingAverage: 2.5,
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
        <RatedSearchResult estimated={estimated} {...result} />,
      </MemoryRouter>,
    );
    expect(tree.find('.search-result').length).to.eq(1);
    tree.unmount();
  });

  it('should not render ratings if rating count < minimum', () => {
    const resultWithoutMinRatings = {
      ...result,
      ratingCount: MINIMUM_RATING_COUNT - 1,
    };
    const tree = mount(
      <MemoryRouter>
        <RatedSearchResult
          estimated={estimated}
          womenOnly={result.womenonly}
          menOnly={result.menonly}
          {...resultWithoutMinRatings}
          gibctFilterEnhancement
        />
      </MemoryRouter>,
    );
    expect(tree.html()).to.contain('Not yet rated');
    expect(tree.find('i').length).to.eq(0);
    tree.unmount();
  });

  it('should render ratings if rating count >= minimum', () => {
    const tree = mount(
      <MemoryRouter>
        <RatedSearchResult
          estimated={estimated}
          womenOnly={result.womenonly}
          menOnly={result.menonly}
          {...result}
          gibctFilterEnhancement
        />
      </MemoryRouter>,
    );
    expect(tree.html()).to.not.contain('Not yet rated');
    expect(tree.find('i').length).to.eq(5);
    tree.unmount();
  });
});
