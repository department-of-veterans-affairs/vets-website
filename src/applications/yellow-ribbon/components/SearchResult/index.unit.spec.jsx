// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchResult } from '.';
import { titleCase } from '../../helpers';

describe('Yellow Ribbon <SearchResult>', () => {
  it('should render', () => {
    const props = {
      onSearchResultClick: () => {},
      school: {
        city: 'Los Angeles',
        contributionAmount: '500',
        degreeLevel: 'All',
        divisionProfessionalSchool: 'All',
        facilityCode: '21115805',
        institutionId: 3454830,
        insturl: 'www.someurl.com',
        numberOfStudents: 212,
        nameOfInstitution: 'ABRAHAM LINCOLN UNIVERSITY',
        state: 'CA',
        streetAddress: '3530 Wilshire Boulevard, Suite 1430',
        zip: '90010',
        id: '14523',
        type: 'yellow_ribbon_programs',
      },
    };

    const tree = shallow(<SearchResult {...props} />);
    const text = tree.text();

    expect(text).to.include(props.school.city);
    expect(text).to.include(props.school.contributionAmount);
    expect(text).to.include(props.school.insturl);
    expect(text).to.include(props.school.numberOfStudents);
    expect(text).to.include(titleCase(props.school.nameOfInstitution));
    expect(text).to.include(props.school.state);

    tree.unmount();
  });
});
