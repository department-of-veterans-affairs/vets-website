import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimFileHeader from '../../../components/claim-files-tab/ClaimFileHeader';

describe('<ClaimFileHeader>', () => {
  context('when isOpen is true', () => {
    it('should render a ClaimFileHeader section with is open text', () => {
      const { container, getByText } = render(<ClaimFileHeader isOpen />);
      const text =
        'If you need to add evidence, you can do that here. You can also see the files associated with this claim.';
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByText(text)).to.exist;
    });
  });

  context('when isOpen is false', () => {
    it('should render a ClaimFileHeader section with is closed text', () => {
      const { container, getByText } = render(
        <ClaimFileHeader isOpen={false} />,
      );
      const text = 'You can see the files associated with this claim.';
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByText(text)).to.exist;
    });
  });
});
