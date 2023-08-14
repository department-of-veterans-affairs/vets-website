import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { EditBreadcrumb } from '@@profile/components/edit/EditBreadcrumb';

describe('<EditBreadcrumb />', () => {
  it('renders the children and responds to click events', () => {
    const onClickHandler = sinon.spy();
    const { getByText } = render(
      <EditBreadcrumb href="#" onClickHandler={onClickHandler}>
        Test Breadcrumb
      </EditBreadcrumb>,
    );

    const linkElement = getByText(/Test Breadcrumb/i);
    expect(linkElement).to.be.ok;

    fireEvent.click(linkElement);
    sinon.assert.calledOnce(onClickHandler);
  });

  it('applies the correct class name', () => {
    const { container } = render(
      <EditBreadcrumb href="#" className="custom-class">
        Test Breadcrumb
      </EditBreadcrumb>,
    );

    expect(container.firstChild).to.have.class('custom-class');
  });
});
