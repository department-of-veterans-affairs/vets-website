import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentListLoopForm from '../../../components/FormFields/DependentListLoopForm';

describe('hca <DependentListLoopForm>', () => {
  const defaultProps = {
    data: {},
    page: { id: 'basic', title: '%s\u2019s basic information' },
    onChange: sinon.spy(),
    onSubmit: sinon.spy(),
  };

  it('should render the basic form with a generic title', () => {
    const view = render(<DependentListLoopForm {...defaultProps} />);
    const form = view.container.querySelector('.rjsf');
    const title = view.container.querySelector('#root__title');
    expect(form).to.exist;
    expect(title).to.contain.text('Dependent\u2019s basic information');
  });

  it('should render the additional info form with a title specific to the dependent name', () => {
    const props = {
      ...defaultProps,
      data: { fullName: { first: 'Mary', last: 'Smith' } },
      page: { id: 'additional', title: '%s\u2019s additional information' },
    };
    const view = render(<DependentListLoopForm {...props} />);
    const form = view.container.querySelector('.rjsf');
    const title = view.container.querySelector('#root__title');
    expect(form).to.exist;
    expect(title).to.contain.text('Mary Smith\u2019s additional information');
  });
});
