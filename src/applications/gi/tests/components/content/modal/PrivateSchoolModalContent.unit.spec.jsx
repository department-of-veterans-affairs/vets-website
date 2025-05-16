import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivateSchoolModalContent from '../../../../components/content/modals/PrivateSchoolModalContent';

describe('<PrivateSchoolModalContent>', () => {
  it('should render a `PrivateSchoolModalContent` component', () => {
    const { container } = render(<PrivateSchoolModalContent />);

    expect(container).to.exist;
    expect(container.innerHTML).to.include(
      'any private shareholder or individual',
    );
  });
});
