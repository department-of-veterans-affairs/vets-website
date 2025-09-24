import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ForeignSchoolModalContent from '../../../../components/content/modals/ForeignSchoolModalContent';

describe('<ForeignSchoolModalContent>', () => {
  it('should render a `ForeignSchoolModalContent` component', () => {
    const { container } = render(<ForeignSchoolModalContent />);

    expect(container).to.exist;
    expect(container.innerHTML).to.include(
      'A postsecondary institution not owned by',
    );
  });
});
