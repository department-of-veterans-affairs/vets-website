import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentList from '../../../components/FormFields/DependentList';

describe('hca <DependentList>', () => {
  it('should render with default props', () => {
    const props = {
      list: [
        {
          fullName: { first: 'John', last: 'Smith' },
          dependentRelation: 'Son',
        },
        {
          fullName: { first: 'Mary', last: 'Smith' },
          dependentRelation: 'Daughter',
        },
      ],
    };
    const view = render(<DependentList {...props} />);
    expect(view.container.querySelector('.hca-dependent-list')).to.exist;
    expect(
      view.container.querySelectorAll('.hca-dependent-list--tile'),
    ).to.have.lengthOf(2);
  });
});
