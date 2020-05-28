import React from 'react';
import SkinDeep from 'skin-deep';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewCollapsibleChapter from '../../../src/js/review/ReviewCollapsibleChapter';

describe('<ReviewCollapsibleChapter>', () => {
  it('should add a data-attribute with the chapterKey', () => {
    const pages = [
      {
        title: '',
        pageKey: 'test2',
      },
    ];
    const chapterKey = 'chapterX';
    const chapter = {};
    const form = {
      pages: {
        test: {
          title: '',
          schema: {
            properties: {},
          },
          uiSchema: {},
        },
      },
      data: {},
    };

    const wrapper = mount(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    const accordion = wrapper.find('.usa-accordion-bordered');
    expect(accordion.length).to.equal(1);
    expect(accordion.props()['data-chapter']).to.equal('chapterX');
    wrapper.unmount();
  });
  it('should handle editing', () => {
    const onEdit = sinon.spy();
    const pages = [
      {
        title: '',
        pageKey: 'test',
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          title: '',
          schema: {
            properties: {},
          },
          uiSchema: {},
          editMode: false,
        },
      },
      data: {},
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={onEdit}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    tree.getMountedInstance().handleEdit('test', true);

    expect(onEdit.calledWith('test', true)).to.be.true;
  });

  it('should handle editing array page', () => {
    const onEdit = sinon.spy();
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {},
          },
          uiSchema: {},
          editMode: [false],
        },
      },
      data: {
        testing: [{}],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={onEdit}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    tree.getMountedInstance().handleEdit('test', true, 0);

    expect(onEdit.calledWith('test', true, 0)).to.be.true;
  });

  it('should handle editing of view:keys', () => {
    const onEdit = sinon.spy();
    const pages = [
      {
        title: '',
        pageKey: 'view:test',
      },
    ];
    const chapterKey = 'view:test';
    const chapter = {};
    const form = {
      pages: {
        'view:test': {
          title: '',
          schema: {
            properties: {},
          },
          uiSchema: {},
          editMode: false,
        },
      },
      data: {},
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={onEdit}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    tree.getMountedInstance().handleEdit('view:test', true);

    expect(onEdit.calledWith('view:test', true)).to.be.true;
  });

  it('should display a page for each item for an array page', () => {
    const onEdit = sinon.spy();
    const pages = [
      {
        title: '',
        pageKey: 'test',
        showPagePerItem: true,
        arrayPath: 'testing',
        path: 'path/:index',
      },
      {
        title: '',
        pageKey: 'test',
        showPagePerItem: true,
        arrayPath: 'testing',
        path: 'path/:index',
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {
              testing: {
                items: [{}, {}],
              },
            },
          },
          uiSchema: {
            testing: {
              items: {},
            },
          },
          editMode: [false, false],
        },
      },
      data: {
        testing: [{}, {}],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={onEdit}
        open
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(tree.everySubTree('.form-review-panel-page').length).to.equal(2);
  });

  it('should not display conditional pages with unfulfilled conditions', () => {
    const pages = [
      {
        pageKey: 'test1',
        title: '',
        schema: {
          properties: {
            condition1: 'boolean',
            condition2: 'boolean',
          },
        },
        uiSchema: {},
      },
      {
        pageKey: 'test2',
        title: '',
        depends: {
          condition1: true,
          condition2: true,
        },
        schema: {},
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test1: {
          editMode: false,
          schema: {
            properties: {
              condition1: 'boolean',
              condition2: 'boolean',
            },
          },
          uiSchema: {},
        },
        test2: {
          editMode: false,
          schema: {},
          uiSchema: {},
        },
      },
      data: {
        condition1: true,
        condition2: false,
      },
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={() => {}}
        open
        pageKeys={['test1', 'test2', 'test3']}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(tree.everySubTree('.form-review-panel-page')).to.have.length(2);
  });

  it('should display condition pages with fulfilled conditions', () => {
    const pages = [
      {
        pageKey: 'test1',
        title: '',
        schema: {
          properties: {
            condition1: 'boolean',
            condition2: 'boolean',
          },
        },
        uiSchema: {},
      },
      {
        pageKey: 'test2',
        title: '',
        depends: {
          condition1: true,
        },
        schema: {},
        uiSchema: {},
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test1: {
          editMode: false,
          schema: {
            properties: {
              condition1: 'boolean',
              condition2: 'boolean',
            },
          },
          uiSchema: {},
        },
        test2: {
          editMode: false,
          schema: {},
          uiSchema: {},
        },
      },
      data: {
        condition1: true,
        condition2: true,
      },
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={() => {}}
        open
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(tree.everySubTree('.form-review-panel-page')).to.have.length(2);
  });
  it('should mark chapter and page as unviewed', () => {
    const onEdit = sinon.spy();
    const pages = [
      {
        pageKey: 'test',
        title: '',
        schema: {
          properties: {},
        },
        uiSchema: {},
      },
    ];
    const chapterKey = 'test';
    const chapter = {
      title: '',
    };
    const form = {
      pages: {
        test: {
          title: '',
          editMode: false,
          schema: {
            properties: {},
          },
          uiSchema: {},
        },
      },
      data: {},
    };
    const setPagesViewed = sinon.spy();

    const wrapper = mount(
      <ReviewCollapsibleChapter
        setPagesViewed={setPagesViewed}
        viewedPages={new Set()}
        onEdit={onEdit}
        open
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        showUnviewedPageWarning
        form={form}
      />,
    );

    expect(wrapper.find('.schemaform-review-chapter-warning').length).to.equal(
      1,
    );
    expect(wrapper.find('.schemaform-review-page-warning').length).to.equal(1);
    wrapper.unmount();
  });
  it('should handle submitting array page', () => {
    const onEdit = sinon.spy();
    const setData = sinon.spy();
    const pages = [
      {
        title: '',
        pageKey: 'test',
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {},
          },
          uiSchema: {},
          editMode: [false],
        },
      },
      data: {
        testing: [{}],
      },
    };

    const tree = SkinDeep.shallowRender(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={onEdit}
        setData={setData}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    tree.getMountedInstance().handleSubmit({ test: 2 }, 'test', 'testing', 0);

    expect(onEdit.calledWith('test', false, 0)).to.be.true;
    expect(setData.firstCall.args[0]).to.eql({
      testing: [
        {
          test: 2,
        },
      ],
    });
  });

  it('should show single page title when != chapter title', () => {
    const testPageTitle = 'test page title';
    const testChapterTitle = 'test chapter title';

    const onEdit = sinon.spy();
    const pages = [
      {
        pageKey: 'test',
        title: testPageTitle,
        updateFormData: (oldData, newData) => ({ ...newData, bar: 'baz' }),
      },
    ];
    const chapterKey = 'test';
    const chapter = {
      title: testChapterTitle,
    };
    const form = {
      pages: {
        test: {
          title: testPageTitle,
          schema: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
          },
          uiSchema: {},
          editMode: false,
        },
      },
      data: {},
    };
    const setPagesViewed = sinon.spy();

    const wrapper = mount(
      <ReviewCollapsibleChapter
        setPagesViewed={setPagesViewed}
        viewedPages={new Set()}
        onEdit={onEdit}
        open
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    const titleDiv = wrapper.find('.form-review-panel-page-header');

    expect(titleDiv.length).to.equal(1);
    expect(titleDiv.text()).to.equal(testPageTitle);
    expect(titleDiv.text()).to.not.equal(testChapterTitle);

    wrapper.unmount();
  });

  it('should not show single page title when equals chapter title', () => {
    const testChapterTitle = 'test chapter title';

    const onEdit = sinon.spy();
    const pages = [
      {
        pageKey: 'test',
        title: testChapterTitle,
        updateFormData: (oldData, newData) => ({ ...newData, bar: 'baz' }),
      },
    ];
    const chapterKey = 'test';
    const chapter = {
      title: testChapterTitle,
    };
    const form = {
      pages: {
        test: {
          title: testChapterTitle,
          schema: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
          },
          uiSchema: {},
          editMode: false,
        },
      },
      data: {},
    };
    const setPagesViewed = sinon.spy();

    const wrapper = mount(
      <ReviewCollapsibleChapter
        setPagesViewed={setPagesViewed}
        viewedPages={new Set()}
        onEdit={onEdit}
        open
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    const titleDiv = wrapper.find('.form-review-panel-page-header');
    // Title is not rendered if it contains an empty string
    expect(titleDiv.length).to.equal(0);

    wrapper.unmount();
  });

  describe('updateFormData', () => {
    it('should be called on normal pages', () => {
      const setData = sinon.spy();
      const pages = [
        {
          title: '',
          pageKey: 'test',
          updateFormData: (oldData, newData) => ({ ...newData, bar: 'baz' }),
        },
      ];
      const chapterKey = 'test';
      const chapter = {
        title: '',
      };
      const form = {
        pages: {
          test: {
            title: '',
            schema: {
              type: 'object',
              properties: {
                foo: { type: 'string' },
              },
            },
            uiSchema: {},
            editMode: true,
          },
        },
        data: {},
      };

      const tree = shallow(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          onEdit={() => {}}
          setData={setData}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          open
        />,
      );

      tree.find('SchemaForm').prop('onChange')({ foo: 'asdf' });

      expect(setData.calledWith({ foo: 'asdf', bar: 'baz' })).to.be.true;

      tree.unmount();
    });

    it('should be called on array pages', () => {
      const setData = sinon.spy();
      const pages = [
        {
          title: '',
          pageKey: 'test',
          updateFormData: (oldData, newData) => ({ ...newData, bar: 'baz' }),
        },
      ];
      const chapterKey = 'test';
      const chapter = {
        title: '',
      };
      const form = {
        pages: {
          test: {
            showPagePerItem: true,
            arrayPath: 'testing',
            title: '',
            schema: {
              properties: {},
            },
            uiSchema: {},
            editMode: [true],
          },
        },
        data: {
          testing: [{}],
        },
      };

      const tree = shallow(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          onEdit={() => {}}
          setData={setData}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          open
        />,
      );

      tree.find('SchemaForm').prop('onChange')({ foo: 'asdf' });

      expect(setData.firstCall.args[0]).to.eql({
        foo: 'asdf',
        bar: 'baz',
      });

      tree.unmount();
    });
  });
});
