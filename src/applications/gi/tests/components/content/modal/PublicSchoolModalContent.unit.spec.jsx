import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PublicSchoolModalContent from '../../../../components/content/modals/PublicSchoolModalContent';

describe('<PublicSchoolModalContent>', () => {
  it('should render a `PublicSchoolModalContent` component', () => {
    const { container } = render(<PublicSchoolModalContent />);

    expect(container).to.exist;
    expect(container.innerHTML).to.include('supported by public funds');
  });
});
