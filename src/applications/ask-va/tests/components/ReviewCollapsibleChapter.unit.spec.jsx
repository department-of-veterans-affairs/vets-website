import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import ReviewCollapsibleChapter from '../../components/ReviewCollapsibleChapter';
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
        <ReviewCollapsibleChapter
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
});
