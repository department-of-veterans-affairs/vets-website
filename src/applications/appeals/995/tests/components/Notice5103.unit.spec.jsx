import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { content } from '../../content/notice5103';
import Notice5103 from '../../components/Notice5103';

describe('Notice5103', () => {
  describe('when on the review page', () => {
    it('should render the proper content', () => {
      const { container } = render(<Notice5103 onReviewPage />);

      expect($('h4', container).textContent).to.eq(content.header);
      expect($('va-checkbox', container)).to.exist;
      expect($('va-additional-info', container)).to.exist;
      expect($('[text="Update page"]', container)).to.exist;
    });

    it('should update page', () => {
      const updateSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const data = { form5103Acknowledged: true };
      const { container } = render(
        <Notice5103
          updatePage={updateSpy}
          data={data}
          setFormData={setFormDataSpy}
          onReviewPage
        />,
      );

      fireEvent.click($(`va-button`, container));
      expect(updateSpy.called).to.be.true;
    });
  });

  describe('when not on the review page', () => {
    it('should render the proper content', () => {
      const { container } = render(<Notice5103 onReviewPage={false} />);

      expect($('h3', container).textContent).to.eq(content.header);
      expect($('va-checkbox', container)).to.exist;
      expect($('va-additional-info', container)).to.exist;
      expect($('va-button[continue]', container)).to.exist;
    });

    it('should not submit page when unchecked', () => {
      const goSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const { container } = render(
        <Notice5103
          goForward={goSpy}
          setFormData={setFormDataSpy}
          onReviewPage={false}
        />,
      );

      $('va-checkbox', container).__events.vaChange({
        detail: { checked: false },
      });

      fireEvent.click($('va-button[continue]', container));
      expect(goSpy.called).to.be.false;
    });

    it('should submit page when checked', () => {
      const goSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const data = { form5103Acknowledged: true };
      const { container, rerender } = render(
        <Notice5103
          goForward={goSpy}
          data={{}}
          setFormData={setFormDataSpy}
          onReviewPage={false}
        />,
      );

      $('va-checkbox', container).__events.vaChange({
        detail: { checked: true },
      });

      rerender(
        <Notice5103
          goForward={goSpy}
          data={data}
          setFormData={setFormDataSpy}
        />,
      );

      fireEvent.click($('va-button[continue]', container));
      expect(goSpy.called).to.be.true;
    });
  });
});
