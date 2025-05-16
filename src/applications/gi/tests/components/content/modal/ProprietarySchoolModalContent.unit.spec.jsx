import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ProprietarySchoolModalContent from '../../../../components/content/modals/ProprietarySchoolModalContent';

describe('<ProprietarySchoolModalContent>', () => {
  it('should render a `ProprietarySchoolModalContent` component', () => {
    const { container } = render(<ProprietarySchoolModalContent />);

    expect(container).to.exist;
    expect(container.innerHTML).to.include(
      'A proprietary institution is generally operated by its owners',
    );
  });
});
