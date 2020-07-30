import _ from 'lodash';
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'enzyme';

import InstitutionSearchForm from '../../components/search/InstitutionSearchForm';

const filtersClass = 'filters-sidebar small-12 medium-3 columns';

const search = {
  filterOpened: false,
};

const eligibility = {
  onlineClasses: 'no',
};

describe('<InstitutionSearchForm>', () => {
  it('should render', () => {
    const tree = shallow(
      <InstitutionSearchForm
        filtersClass={filtersClass}
        search={search}
        eligibility={eligibility}
        gibctFilterEnhancement
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
});
