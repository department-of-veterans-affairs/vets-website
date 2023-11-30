import React from 'react';
import SkinDeep from 'skin-deep';
import { mount, shallow } from 'enzyme';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import { ReviewCollapsibleChapter } from '../../../src/js/review/ReviewCollapsibleChapter';

describe('<ReviewCollapsibleChapter>', () => {
  it('should add a data-attribute with the chapterKey', () => {
    const onEdit = sinon.spy();
    const pages = [
      {
        title: '',
        pageKey: 'test',
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
          editMode: false,
        },
      },
      data: {},
    };

    const wrapper = mount(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={onEdit}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    const accordion = wrapper.find('va-accordion-item');
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
        index: 0,
      },
      {
        title: '',
        pageKey: 'test',
        showPagePerItem: true,
        arrayPath: 'testing',
        path: 'path/:index',
        index: 1,
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const itemSchema = {
      type: 'object',
      properties: { foo: { type: 'string' } },
    };
    const form = {
      pages: {
        test: {
          showPagePerItem: true,
          arrayPath: 'testing',
          title: '',
          schema: {
            properties: {
              testing: {
                items: [itemSchema, itemSchema],
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
        schema: {},
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
          schema: {
            properties: {
              field1: {
                type: 'boolean',
              },
            },
          },
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
        schema: {},
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
              condition1: {
                type: 'boolean',
              },
              condition2: {
                type: 'boolean',
              },
            },
          },
          uiSchema: {},
        },
        test2: {
          editMode: false,
          schema: {
            properties: {
              condition3: {
                type: 'boolean',
              },
            },
          },
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
            properties: {
              field1: { type: 'boolean' },
            },
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
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        hasUnviewedPages
        form={form}
      />,
    );

    expect(wrapper.find('va-accordion-item').props().subHeader).to.equal(
      'Some information has changed. Please review.',
    );
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
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(wrapper.find('va-accordion-item').props().header).to.equal(
      testChapterTitle,
    );

    const titleDiv = wrapper.find('h4.form-review-panel-page-header');
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
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(wrapper.find('va-accordion-item').props().header).to.equal(
      testChapterTitle,
    );

    const titleDiv = wrapper.find('.form-review-panel-page-header');
    // Title is not rendered if it contains an empty string
    expect(titleDiv.length).to.equal(0);

    wrapper.unmount();
  });

  it('should show dynamic chapter title', () => {
    const testChapterTitle = 'test chapter title';
    const testChapterTitleFromFunction = `${testChapterTitle} [from function]`;

    const onEdit = sinon.spy();
    const pages = [
      {
        pageKey: 'test',
        title: testChapterTitleFromFunction,
        updateFormData: (oldData, newData) => ({ ...newData, bar: 'baz' }),
      },
    ];
    const chapterKey = 'test';
    const chapter = {
      title: ({ formData, formConfig, onReviewPage }) => {
        if (formData && formConfig && onReviewPage) {
          return testChapterTitleFromFunction;
        }

        return testChapterTitle;
      },
    };
    const form = {
      pages: {
        test: {
          title: testChapterTitleFromFunction,
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
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(wrapper.find('va-accordion-item').props().header).to.equal(
      testChapterTitleFromFunction,
    );

    wrapper.unmount();
  });

  it('does not display page if all fields are hidden on review', () => {
    const pages = [
      {
        pageKey: 'test1',
        title: '',
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
              field1: {
                type: 'boolean',
                'ui:hidden': true,
              },
              field2: {
                type: 'boolean',
                'ui:collapsed': true,
              },
              field3: {
                type: 'boolean',
              },
              field4: {
                type: 'boolean',
              },
              field5: {
                type: 'boolean',
              },
            },
          },
          uiSchema: {
            field3: {
              'ui:options': {
                hideOnReview: true,
              },
            },
            field4: {
              'ui:options': {
                hideOnReview: () => true,
              },
            },
            field5: {
              'ui:options': {
                hideOnReviewIfFalse: true,
              },
            },
          },
        },
      },
      data: { field5: false },
    };

    const tree = shallow(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        onEdit={() => {}}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
      />,
    );

    expect(tree.find('.form-review-panel-page').length).to.eq(0);

    tree.unmount();
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
        />,
      );

      tree.find('SchemaForm').prop('onChange')({ foo: 'asdf' });

      expect(setData.calledWith({ foo: 'asdf', bar: 'baz' })).to.be.true;

      tree.unmount();
    });
    it('should be called on normal pages and pass an index', () => {
      const setData = sinon.spy();
      const pages = [
        {
          title: '',
          pageKey: 'test',
          index: 0,
          updateFormData: (oldData, newData, index) => {
            const bar = [];
            bar[index] = 'baz';
            return { ...newData, bar };
          },
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
        />,
      );

      tree.find('SchemaForm').prop('onChange')({ foo: 'asdf' });

      expect(setData.calledWith({ foo: 'asdf', bar: ['baz'] })).to.be.true;

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
              properties: {
                testing: {
                  items: [{}, {}],
                },
              },
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
        />,
      );

      tree.find('SchemaForm').prop('onChange')({ foo: 'asdf' });

      expect(setData.firstCall.args[0]).to.eql({
        foo: 'asdf',
        bar: 'baz',
      });

      tree.unmount();
    });

    it('should be called on array pages and pass an index', () => {
      const setData = sinon.spy();
      const pages = [
        {
          title: '',
          pageKey: 'test',
          index: 0,
          updateFormData: (oldData, newData, index) => {
            const bar = [];
            bar[index] = 'baz';
            return { ...newData, bar };
          },
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
              properties: {
                testing: {
                  items: [{}, {}],
                },
              },
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
        />,
      );

      tree.find('SchemaForm').prop('onChange')({ foo: 'asdf' });

      expect(setData.firstCall.args[0]).to.eql({
        foo: 'asdf',
        bar: ['baz'],
      });

      tree.unmount();
    });
  });

  describe('update page', () => {
    it('should validate page upon updating', () => {
      const setFormErrors = sinon.spy();
      const pages = [
        {
          title: '',
          pageKey: 'test',
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
          pageList={pages}
          onEdit={() => {}}
          setFormErrors={setFormErrors}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      // clicking the "Update page" button; does not call handleSubmit function
      // directly
      tree
        .find('ProgressButton')
        .props()
        .onButtonClick();
      expect(setFormErrors.called).to.be.true;

      tree.unmount();
    });
  });

  describe('rendering custom content', () => {
    const getProps = () => {
      const CustomPage = () => <div data-testid="custom-page" />;
      const CustomPageReview = () => <div data-testid="custom-page-review" />;
      const pageConfig = {
        title: '',
        pageKey: 'test',
        CustomPage,
        CustomPageReview,
        schema: { type: 'object', properties: {} },
        uiSchema: {},
      };
      const pages = [
        {
          ...pageConfig,
          pageKey: 'test',
        },
      ];
      const chapterKey = 'test';
      const chapter = {};
      const form = {
        pages: {
          test: {
            ...pageConfig,
            editMode: false,
          },
        },
        data: {},
      };

      return { pages, chapterKey, chapter, form };
    };

    it('should render CustomPageReview', () => {
      const { pages, chapterKey, chapter, form } = getProps();
      const { queryByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      expect(queryByTestId('custom-page-review')).to.exist;
      expect(queryByTestId('custom-page')).not.to.exist;
    });

    it('should render CustomPage in edit mode', () => {
      const { pages, chapterKey, chapter, form } = getProps();
      form.pages.test.editMode = true;
      const { queryByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      expect(queryByTestId('custom-page')).to.exist;
      expect(queryByTestId('custom-page-review')).not.to.exist;
    });

    it('should include schema & uiSchema to CustomPage in edit mode', () => {
      const spy = sinon.spy();
      const { pages, chapterKey, chapter, form } = getProps();

      const foo = { foo: {} };
      const properties = { foo: { type: 'string' } };
      pages[0].schema.properties = properties;
      pages[0].uiSchema = foo;
      form.pages.test.schema.properties = properties;
      form.pages.test.uiSchema = foo;

      const CustomPage = props => {
        spy(props);
        return <div data-testid="custom-page" />;
      };
      form.pages.test.editMode = true;
      form.pages.test.CustomPage = CustomPage;
      pages[0].CustomPage = CustomPage;
      render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          open
        />,
      );

      const CustomPageProps = spy.firstCall.args[0];
      expect(CustomPageProps.uiSchema).to.deep.equal(foo);
      expect(CustomPageProps.schema.properties).to.deep.equal(properties);
    });

    it('should include noop navigation functions when rendering CustomPage in edit mode', () => {
      const { pages, chapterKey, chapter, form } = getProps();
      let result;
      const CustomPage = props => {
        result = props;
        return <div data-testid="custom-page" />;
      };
      form.pages.test.editMode = true;
      form.pages.test.CustomPage = CustomPage;
      pages[0].CustomPage = CustomPage;
      render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      expect(result.goBack.toString()).to.contain('noop()');
      expect(result.goForward.toString()).to.contain('noop()');
    });

    it('should render a CustomPageReview for each item in an array when showPagePerItem is true', () => {
      const { pages, chapterKey, chapter, form } = getProps();
      pages[0].index = 0;
      pages.push({
        title: '',
        pageKey: 'test',
        CustomPage: pages[0].CustomPage,
        CustomPageReview: pages[0].CustomPageReview,
        index: 1,
      });
      form.pages.test.showPagePerItem = true;
      form.pages.test.arrayPath = 'foo';
      form.data.foo = [{}, {}];
      const { getAllByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      expect(getAllByTestId('custom-page-review').length).to.equal(2);
    });

    it('should not render a page in the chapter when CustomPageReview is null and the schema properties are empty', () => {
      const { pages, chapterKey, chapter, form } = getProps();
      pages[0].CustomPageReview = null;
      form.pages.test.CustomPageReview = null;
      const { queryByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );
      expect(queryByTestId('accordion-item-content').children.length).to.equal(
        0,
      );
    });

    it('should render SchemaForm in the chapter when CustomPageReview is null but the schema properties are not empty', () => {
      const { pages, chapterKey, chapter, form } = getProps();
      pages[0].CustomPageReview = null;
      form.pages.test.CustomPageReview = null;
      const properties = { foo: { type: 'string' } };
      pages[0].schema.properties = properties;
      form.pages.test.schema.properties = properties;
      const { container, queryByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );
      expect(container.querySelector('form.rjsf')).to.exist;
      expect(queryByTestId('custom-page-review')).not.to.exist;
    });

    it('should pass the edit button function to the custom review component', () => {
      const onEdit = sinon.spy();
      const CustomPageReview = ({ editPage }) => (
        <div data-testid="custom-page-review">
          <button onClick={editPage} data-testid="edit-button">
            Edit
          </button>
        </div>
      );
      const { pages, chapterKey, chapter, form } = getProps();
      pages[0].CustomPageReview = CustomPageReview;
      form.pages.test.CustomPageReview = CustomPageReview;
      const { getByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          onEdit={onEdit}
        />,
      );
      // Poke the edit button
      userEvent.click(getByTestId('edit-button'));
      expect(onEdit.callCount).to.equal(1);
    });

    it('should pass the update button function to the custom page component', () => {
      const onEdit = sinon.spy();
      const CustomPage = ({ updatePage }) => (
        <div data-testid="custom-page-review">
          <button onClick={updatePage} data-testid="update-button">
            Update page
          </button>
        </div>
      );
      const { pages, chapterKey, chapter, form } = getProps();
      form.pages.test.editMode = true;
      pages[0].CustomPage = CustomPage;
      form.pages.test.CustomPage = CustomPage;
      const { getByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          onEdit={onEdit}
        />,
      );

      userEvent.click(getByTestId('update-button'));
      expect(onEdit.callCount).to.equal(1);
    });

    it('should pass the form data to the CustomPageReview', () => {
      const CustomPageReview = ({ data }) => (
        <div data-testid="custom-page-review">
          <span data-testid="foo-value">{data.foo}</span>
        </div>
      );
      const { pages, chapterKey, chapter, form } = getProps();
      pages[0].CustomPageReview = CustomPageReview;
      form.pages.test.CustomPageReview = CustomPageReview;
      form.data.foo = 'bar';
      const { getByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      expect(getByTestId('foo-value').innerHTML).to.equal('bar');
    });

    it('should pass the form data to the CustomPage', () => {
      const CustomPage = ({ data }) => (
        <div data-testid="custom-page-review">
          <span data-testid="foo-value">{data.foo}</span>
        </div>
      );
      const { pages, chapterKey, chapter, form } = getProps();
      pages[0].CustomPage = CustomPage;
      form.pages.test.CustomPage = CustomPage;
      form.pages.test.editMode = true;
      form.data.foo = 'bar';
      const { getByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
        />,
      );

      expect(getByTestId('foo-value').innerHTML).to.equal('bar');
    });

    it('should pass the setFormData function to the custom page component', () => {
      const onSetData = sinon.spy();
      const CustomPage = ({ setFormData }) => (
        <div data-testid="custom-page-review">
          <button
            type="button"
            onClick={setFormData}
            data-testid="set-form-data-button"
          >
            setFormData
          </button>
        </div>
      );
      const { pages, chapterKey, chapter, form } = getProps();
      form.pages.test.editMode = true;
      pages[0].CustomPage = CustomPage;
      form.pages.test.CustomPage = CustomPage;
      const { getByTestId } = render(
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          setData={onSetData}
        />,
      );

      userEvent.click(getByTestId('set-form-data-button'));
      expect(onSetData.callCount).to.equal(1);
    });
  });
});
