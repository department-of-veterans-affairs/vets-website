// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchResult } from './index';

describe('Yellow Ribbon <SearchResult>', () => {
  it('should render', () => {
    const props = {
      school: {
        city: 'Boulder',
        highestDegree: 2,
        id: 'someCrazyUniqueID',
        name: 'Colorado University',
        state: 'CO',
        studentCount: 232,
        tuitionOutOfState: 23456,
      },
    };

    const tree = shallow(<SearchResult {...props} />);
    const text = tree.text();

    expect(text).to.include(props.school.city);
    expect(text).to.include(props.school.state);
    expect(text).to.include(props.school.name);
    expect(text).to.include(props.school.studentCount);

    tree.unmount();
  });
});
