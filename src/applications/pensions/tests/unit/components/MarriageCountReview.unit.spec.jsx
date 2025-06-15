import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import MarriageCountReview, {
  content,
} from '../../../components/MarriageCountReview';

import maximalData from '../../e2e/fixtures/data/maximal-test.json';

describe('<MarriageCountReview>', () => {
  const setup = ({ data = {}, editPage = () => {} } = {}) => (
    <div>
      <MarriageCountReview
        data={{ ...maximalData.data, ...data }}
        editPage={editPage}
      />
    </div>
  );
  it('should not render if never married', () => {
    const { container } = render(
      setup({ data: { maritalStatus: 'NEVER_MARRIED' } }),
    );
    expect($('div', container)).to.be.empty;
  });
  it('should not render if widowed', () => {
    const { container } = render(setup({ data: { maritalStatus: 'WIDOWED' } }));
    expect($('div', container)).to.be.empty;
  });
  it('should not render if divorced', () => {
    const { container } = render(
      setup({ data: { maritalStatus: 'DIVORCED' } }),
    );
    expect($('div', container)).to.be.empty;
  });
  it('should render if MARRIED', () => {
    const { container } = render(setup({ data: { maritalStatus: 'MARRIED' } }));
    expect($('div', container)).not.to.be.empty;
  });
  it('should render content with maximal data', () => {
    const { container } = render(setup());
    expect($('h4', container).textContent).to.eq(content.title);
    expect($('dt', container).textContent).to.eq(content.label);
    expect($('dd', container).textContent).to.contain('3');
  });
  it('should switch to edit mode', () => {
    const editPageSpy = sinon.spy();
    const { container } = render(setup({ editPage: editPageSpy }));

    fireEvent.click($('va-button', container));
    expect(editPageSpy.called).to.be.true;
  });
});
