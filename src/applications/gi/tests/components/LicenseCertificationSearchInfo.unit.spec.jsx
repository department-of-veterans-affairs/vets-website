import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LicenseCertificationSearchInfo from '../../components/LicenseCertificationSearchInfo';

describe('<LicenseCertificationSearchInfo/>', () => {
  const defaultProps = {
    filteredResults: [],
    currentPage: 1,
    itemsPerPage: 10,
    activeCategories: [],
    nameParam: '',
    stateParam: 'all',
    previousRouteHome: false,
  };

  it('should render no results message when no categories selected', () => {
    const wrapper = shallow(
      <LicenseCertificationSearchInfo {...defaultProps} />,
    );
    expect(wrapper.text()).to.contain(
      'To see your results, select a category type filter',
    );
    wrapper.unmount();
  });

  it('should render certification-specific message when only certification selected', () => {
    const props = {
      ...defaultProps,
      activeCategories: ['certification'],
      nameParam: 'Test Cert',
    };
    const wrapper = shallow(<LicenseCertificationSearchInfo {...props} />);
    expect(wrapper.text()).to.contain(
      'There is no certification available for "Test Cert"',
    );
    wrapper.unmount();
  });

  it('should render results count and search info when results exist', () => {
    const props = {
      ...defaultProps,
      filteredResults: [{ id: 1 }, { id: 2 }],
      activeCategories: ['license', 'certification'],
      nameParam: 'Test',
      stateParam: 'CA',
    };
    const wrapper = shallow(<LicenseCertificationSearchInfo {...props} />);
    const text = wrapper.text();
    expect(text).to.contain('Showing');
    expect(text).to.contain('2 results');
    expect(text).to.contain('License');
    expect(text).to.contain('Certification');
    expect(text).to.contain('Test');
    expect(text).to.contain('California');
    wrapper.unmount();
  });

  it('should show "All" when all category types are selected', () => {
    const props = {
      ...defaultProps,
      filteredResults: [{ id: 1 }],
      activeCategories: ['license', 'certification', 'prep course'],
    };
    const wrapper = shallow(<LicenseCertificationSearchInfo {...props} />);
    expect(
      wrapper
        .find('.info-option')
        .first()
        .text(),
    ).to.contain('All');
    wrapper.unmount();
  });

  it('should not show state when previousRouteHome is true', () => {
    const props = {
      ...defaultProps,
      filteredResults: [{ id: 1 }],
      activeCategories: ['license'],
      stateParam: 'NY',
      previousRouteHome: true,
    };
    const wrapper = shallow(<LicenseCertificationSearchInfo {...props} />);
    expect(wrapper.text()).to.not.contain('New York');
    wrapper.unmount();
  });

  it('should show "all" states message when no results found and state is "all"', () => {
    const props = {
      ...defaultProps,
      activeCategories: ['license'],
      nameParam: 'Test',
      stateParam: 'all',
    };
    const wrapper = shallow(<LicenseCertificationSearchInfo {...props} />);
    expect(wrapper.text()).to.contain(
      'There is no license available for "Test"',
    );
    wrapper.unmount();
  });
});
