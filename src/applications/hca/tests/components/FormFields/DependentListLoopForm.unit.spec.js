import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentListLoopForm from '../../../components/FormFields/DependentListLoopForm';

describe('hca <DependentListLoopForm>', () => {
  const defaultProps = {
    data: {},
    page: { id: 'basic', title: '%s\u2019s basic information' },
    onChange: () => {},
    onSubmit: () => {},
  };

  describe('when on the personal information form page', () => {
    it('should render with a generic title', () => {
      const { container } = render(<DependentListLoopForm {...defaultProps} />);
      const form = container.querySelector('.rjsf');
      const title = container.querySelector('#root__title');
      expect(form).to.exist;
      expect(title).to.contain.text('Dependent\u2019s basic information');
    });
  });

  describe('when on a form page after the personal information page', () => {
    it('should render with a title specific to the dependent name', () => {
      const props = {
        ...defaultProps,
        data: { fullName: { first: 'Mary', last: 'Smith' } },
        page: { id: 'additional', title: '%s\u2019s additional information' },
      };
      const { container } = render(<DependentListLoopForm {...props} />);
      const form = container.querySelector('.rjsf');
      const title = container.querySelector('#root__title');
      expect(form).to.exist;
      expect(title).to.contain.text('Mary Smith\u2019s additional information');
    });
  });
});
