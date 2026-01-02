import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import * as utilities from '../../../../src/js/utilities/review';

import { ErrorLinks } from '../../../../src/js/review/submit-states/ErrorLinks';

describe('<ErrorLinks />', () => {
  it('renders', () => {
    const props = {
      appType: 'test',
      testId: '1234',
      errors: [
        {
          name: 'test',
          message: 'Test error',
          chapterKey: 'Test',
        },
      ],
    };
    const view = render(<ErrorLinks {...props} />);
    expect(view.getAllByRole('heading', { name: /missing some info/ })).to
      .exist;
    expect(view.getByText(/information before you can submit/)).to.exist;
  });

  it('has the expected list of errors', () => {
    const props = {
      appType: 'test',
      testId: '1234',
      errors: [
        {
          name: 'test',
          message: 'Missing test',
          chapterKey: 'Test',
          index: 0,
        },
        { name: 'zip', message: 'Zip', chapterKey: 'Zip', pageKey: 'zip' },
        // No chapter = no link to open accordion
        { name: 'empty', message: 'Property not found', chapterKey: '' },
      ],
    };

    const view = render(<ErrorLinks {...props} />);

    expect(view.getByRole('link', { name: /Missing test/ })).to.exist;
    expect(view.getByRole('link', { name: /Zip/ })).to.exist;
    expect(view.getByText(/Property not found/)).to.exist;
  });

  it('opens the chapter and enables editing when a link is clicked', () => {
    const editSpy = sinon.spy(utilities, 'openAndEditChapter');
    const scrollSpy = sinon.spy(utilities, 'scrollToReviewElement');

    const props = {
      appType: 'test',
      testId: '1234',
      errors: [
        {
          name: 'foo',
          index: 0,
          message: 'Foo',
          chapterKey: 'Foo',
          pageKey: 'foo',
        },
      ],
    };

    const view = render(<ErrorLinks {...props} />);
    userEvent.click(view.getByRole('link', { name: /Foo/ }));

    expect(editSpy.called).to.be.true;
    expect(scrollSpy.called).to.be.true;

    editSpy.restore();
    scrollSpy.restore();
  });

  it('changes the alert message once the errors are cleared', () => {
    const props = {
      appType: 'test',
      testId: '1234',
      errors: [
        {
          name: 'foo',
          index: 0,
          message: 'Foo',
          chapterKey: 'Foo',
          pageKey: 'foo',
        },
      ],
    };

    const view = render(<ErrorLinks {...props} />);
    // userEvent.click(view.getByRole('link', { name: /Foo/ }));
    expect(view.getByRole('link', { name: /Foo/ })).to.exist;

    view.rerender(<ErrorLinks {...props} errors={[]} />);
    expect(view.getByText(/Thank you for completing/)).to.exist;
    expect(view.getByText(/Try submitting your test again/)).to.exist;
  });

  it('redirects to page when error has navigationType redirect', () => {
    const editSpy = sinon.spy(utilities, 'openAndEditChapter');
    const scrollSpy = sinon.spy(utilities, 'scrollToReviewElement');
    const router = { push: sinon.spy() };
    const formConfig = {
      urlPrefix: '/',
      chapters: {
        disabilities: {
          pages: {
            claimType: {
              path: 'claim-type',
            },
          },
        },
      },
    };

    const props = {
      appType: 'test',
      testId: '1234',
      router,
      formConfig,
      errors: [
        {
          name: 'newDisabilities',
          message: 'Reason for claim',
          chapterKey: 'disabilities',
          pageKey: 'claimType',
          navigationType: 'redirect',
        },
      ],
    };

    const view = render(<ErrorLinks {...props} />);
    const link = view.getByRole('link', { name: /Reason for claim/ });
    userEvent.click(link);

    expect(router.push.calledWith('/claim-type')).to.be.true;
    expect(editSpy.called).to.be.false;
    expect(scrollSpy.called).to.be.false;

    editSpy.restore();
    scrollSpy.restore();
  });

  it('uses default behavior when navigationType is edit', () => {
    const editSpy = sinon.spy(utilities, 'openAndEditChapter');
    const scrollSpy = sinon.spy(utilities, 'scrollToReviewElement');
    const router = { push: sinon.spy() };

    const props = {
      appType: 'test',
      testId: '1234',
      router,
      formConfig: {},
      errors: [
        {
          name: 'condition',
          message: 'New conditions',
          chapterKey: 'disabilities',
          pageKey: 'otherPage',
          navigationType: 'edit',
        },
      ],
    };

    const view = render(<ErrorLinks {...props} />);
    const link = view.getByRole('link', { name: /New conditions/ });
    userEvent.click(link);

    expect(router.push.called).to.be.false;
    expect(editSpy.called).to.be.true;
    expect(scrollSpy.called).to.be.true;

    editSpy.restore();
    scrollSpy.restore();
  });

  it('uses default behavior when navigationType is missing', () => {
    const editSpy = sinon.spy(utilities, 'openAndEditChapter');
    const scrollSpy = sinon.spy(utilities, 'scrollToReviewElement');
    const router = { push: sinon.spy() };

    const props = {
      appType: 'test',
      testId: '1234',
      router,
      formConfig: {},
      errors: [
        {
          name: 'condition',
          message: 'New conditions',
          chapterKey: 'disabilities',
          pageKey: 'otherPage',
        },
      ],
    };

    const view = render(<ErrorLinks {...props} />);
    const link = view.getByRole('link', { name: /New conditions/ });
    userEvent.click(link);

    expect(router.push.called).to.be.false;
    expect(editSpy.called).to.be.true;
    expect(scrollSpy.called).to.be.true;

    editSpy.restore();
    scrollSpy.restore();
  });
});
