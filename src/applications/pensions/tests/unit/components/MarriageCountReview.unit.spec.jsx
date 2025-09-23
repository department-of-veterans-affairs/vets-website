import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as helpers from '../../../helpers';

import MarriageCountReview, {
  content,
} from '../../../components/MarriageCountReview';

import maximalData from '../../e2e/fixtures/data/maximal-test.json';

describe('<MarriageCountReview>', () => {
  let showPdfFormAlignmentStub;

  beforeEach(() => {
    showPdfFormAlignmentStub = sinon.stub(helpers, 'showPdfFormAlignment');
  });

  afterEach(() => {
    if (showPdfFormAlignmentStub && showPdfFormAlignmentStub.restore) {
      showPdfFormAlignmentStub.restore();
    }
  });
  const setup = ({ data = {}, editPage = () => {} } = {}) => (
    <div>
      <MarriageCountReview
        data={{ ...maximalData.data, ...data }}
        editPage={editPage}
      />
    </div>
  );

  describe('showPdfFormAlignment = false', () => {
    beforeEach(() => {
      showPdfFormAlignmentStub.returns(false);
    });
    it('should not render if NEVER_MARRIED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'NEVER_MARRIED' } }),
      );
      expect($('div', container)).to.be.empty;
    });
    it('should render if MARRIED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'MARRIED' } }),
      );
      expect($('div', container)).not.to.be.empty;
    });
    it('should render if SEPARATED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'SEPARATED' } }),
      );
      expect($('div', container)).not.to.be.empty;
    });
    it('should not render if WIDOWED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'WIDOWED' } }),
      );
      expect($('div', container)).to.be.empty;
    });
    it('should not render if DIVORCED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'DIVORCED' } }),
      );
      expect($('div', container)).to.be.empty;
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

  describe('showPdfFormAlignment = true', () => {
    beforeEach(() => {
      showPdfFormAlignmentStub.returns(true);
    });
    it('should not render if NEVER_MARRIED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'NEVER_MARRIED' } }),
      );
      expect($('div', container)).to.be.empty;
    });
    it('should render if MARRIED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'MARRIED' } }),
      );
      expect($('div', container)).not.to.be.empty;
    });
    it('should render if SEPARATED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'SEPARATED' } }),
      );
      expect($('div', container)).not.to.be.empty;
    });
    it('should render if WIDOWED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'WIDOWED' } }),
      );
      expect($('div', container)).not.to.be.empty;
    });
    it('should render if DIVORCED', () => {
      const { container } = render(
        setup({ data: { maritalStatus: 'DIVORCED' } }),
      );
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
});
