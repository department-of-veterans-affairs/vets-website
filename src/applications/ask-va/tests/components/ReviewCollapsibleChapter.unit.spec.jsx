import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import ReviewCollapsibleChapterWrapped, {
  ReviewCollapsibleChapter,
} from '../../components/ReviewCollapsibleChapter';
import { createMockStore, mockRouterProps } from '../common';
import {
  askVA,
  chapterFormConfig,
  expandedPages,
  form,
  pageKeys,
  pageList,
  viewedPages,
} from '../fixtures/data/reviewPageQuestionCollapsible';

describe('ReviewCollapsibleChapter', () => {
  it('should render', async () => {
    const store = createMockStore({
      form,
    });
    const router = {
      ...mockRouterProps,
    };
    const onEdit = sinon.spy();

    const { getByText, container } = render(
      <Provider store={store}>
        <ReviewCollapsibleChapterWrapped
          router={router}
          chapterFormConfig={chapterFormConfig}
          expandedPages={expandedPages}
          askVA={askVA}
          pageList={pageList}
          pageKeys={pageKeys}
          viewedPages={viewedPages}
          onEdit={onEdit}
        />
      </Provider>,
    );

    await waitFor(() => {
      getByText('Your question');
      getByText('Subject');

      const button = container.querySelector('va-button[text="Edit"]');
      expect(button).to.exist;

      userEvent.click(button);
    });

    await waitFor(() => {
      expect(onEdit.called).to.be.true;
    });
  });

  it('should get chapter title correctly', () => {
    const router = { ...mockRouterProps };
    const component = new ReviewCollapsibleChapter({
      router,
      form,
      pageList,
      onEdit: () => {},
      chapterFormConfig: {},
    });

    // Test with static title
    const staticConfig = { title: 'Static Title' };
    expect(component.getChapterTitle(staticConfig)).to.equal('Static Title');

    // Test with function title
    const functionConfig = {
      title: ({ formData }) =>
        `Function Title for ${formData?.someField || ''}`,
    };
    expect(component.getChapterTitle(functionConfig)).to.equal(
      'Function Title for ',
    );

    // Test with reviewTitle
    const reviewConfig = {
      title: 'Normal Title',
      reviewTitle: 'Review Title',
    };
    expect(component.getChapterTitle(reviewConfig)).to.equal('Review Title');
  });

  it('should get page title correctly', () => {
    const router = { ...mockRouterProps };
    const component = new ReviewCollapsibleChapter({
      router,
      form,
      pageList,
      onEdit: () => {},
      chapterFormConfig: {},
    });

    // Test with static title
    const staticTitle = 'Static Page Title';
    expect(component.getPageTitle(staticTitle)).to.equal('Static Page Title');

    // Test with function title
    const functionTitle = ({ formData }) =>
      `Dynamic Title for ${formData?.field || 'default'}`;
    expect(component.getPageTitle(functionTitle)).to.equal(
      'Dynamic Title for default',
    );
  });

  it('should determine when to hide expanded page title', () => {
    const router = { ...mockRouterProps };
    const component = new ReviewCollapsibleChapter({
      router,
      form,
      pageList,
      onEdit: () => {},
      chapterFormConfig: {},
    });

    // Should hide when there's one expanded page and titles match
    expect(
      component.shouldHideExpandedPageTitle(
        ['singlePage'],
        'Same Title',
        'same title',
      ),
    ).to.be.true;

    // Should not hide when there's more than one expanded page
    expect(
      component.shouldHideExpandedPageTitle(
        ['page1', 'page2'],
        'Same Title',
        'same title',
      ),
    ).to.be.false;

    // Should not hide when titles don't match
    expect(
      component.shouldHideExpandedPageTitle(
        ['singlePage'],
        'Chapter Title',
        'Different Page Title',
      ),
    ).to.be.false;

    // Should handle undefined/empty chapter title
    expect(
      component.shouldHideExpandedPageTitle(['singlePage'], '', 'Page Title'),
    ).to.be.false;
  });

  it('should handle form data changes correctly', () => {
    const setDataSpy = sinon.spy();
    const router = { ...mockRouterProps };
    const component = new ReviewCollapsibleChapter({
      router,
      form: { data: { existingField: 'value' } },
      pageList,
      onEdit: () => {},
      chapterFormConfig: {},
      setData: setDataSpy,
    });

    // Test direct form data update
    const newFormData = { field: 'new value' };
    component.onChange(newFormData);
    expect(setDataSpy.calledWith(newFormData)).to.be.true;

    // Test update with path and index
    component.onChange(newFormData, 'questions', 0);
    expect(setDataSpy.calledTwice).to.be.true;
    const lastCall = setDataSpy.lastCall.args[0];
    expect(lastCall).to.deep.equal({
      existingField: 'value',
      questions: [{ field: 'new value' }],
    });
  });
});
