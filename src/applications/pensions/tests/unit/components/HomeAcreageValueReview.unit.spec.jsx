import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import HomeAcreageValueReview, {
  content,
} from '../../../components/HomeAcreageValueReview';

import maximalData from '../../e2e/fixtures/data/maximal-test.json';

describe('<HomeAcreageValueReview>', () => {
  const setup = ({ data = {}, editPage = () => {} } = {}) => (
    <div>
      <HomeAcreageValueReview
        data={{ ...maximalData.data, ...data }}
        editPage={editPage}
      />
    </div>
  );

  it('should not render if homeOwnership is false', () => {
    const { container } = render(setup({ data: { homeOwnership: false } }));
    expect($('div', container)).to.be.empty;
  });

  it('should not render if homeAcreageMoreThanTwo is false', () => {
    const { container } = render(
      setup({ data: { homeAcreageMoreThanTwo: false } }),
    );
    expect($('div', container)).to.be.empty;
  });

  it('should render content as currency', () => {
    const { container } = render(setup());
    expect($('h4', container).textContent).to.eq(content.title);
    expect($('dt', container).textContent).to.eq(content.label);
    expect($('dd', container).textContent).to.contain('$75,000');
  });

  it('should switch to edit mode', () => {
    const editPageSpy = sinon.spy();
    const { container } = render(setup({ editPage: editPageSpy }));

    fireEvent.click($('va-button', container));
    expect(editPageSpy.called).to.be.true;
  });

  it('should show an error message when the homme acreage value is invalid', () => {
    const { container } = render(setup({ data: { homeAcreageValue: 'abc' } }));
    expect($('strong', container).textContent).to.eq(content.error);
  });
});
