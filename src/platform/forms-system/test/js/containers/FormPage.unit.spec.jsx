import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { mount } from 'enzyme';
import sinon from 'sinon';

import set from '../../../../utilities/data/set';

import { FormPage } from '../../../src/js/containers/FormPage';

// Build our mock objects
function makeRoute(obj) {
  return {
    pageConfig: {
      pageKey: 'testPage',
      schema: {},
      uiSchema: {},
      errorMessages: {},
      title: '',
    },
    pageList: [
      {
        path: '/first-page',
        pageKey: 'firstPage',
      },
      {
        path: '/testing',
        pageKey: 'testPage',
      },
      {
        path: '/next-page',
        pageKey: 'nextPage',
      },
      {
        path: '/last-page',
        pageKey: 'lastPage',
      },
    ],
    ...obj,
  };
}
function makeForm(obj) {
  return {
    pages: {
      firstPage: { schema: {}, uiSchema: {} },
      testPage: { schema: {}, uiSchema: {} },
      nextPage: { schema: {}, uiSchema: {} },
      lastPage: { schema: {}, uiSchema: {} },
    },
    data: {},
    ...obj,
  };
}
function makeArrayForm(obj) {
  return {
    pages: {
      testPage: {
        schema: {
          properties: {
            arrayProp: {
              items: [{}],
            },
          },
        },
        uiSchema: {
          arrayProp: {
            items: {},
          },
        },
      },
    },
    data: {
      arrayProp: [{}],
    },
    ...obj,
  };
}

describe('Schemaform <FormPage>', () => {
  // Defaults for most tests; overridden where needed below
  const location = {
    pathname: '/testing',
  };

  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <FormPage form={makeForm()} route={makeRoute()} location={location} />,
    );

    expect(tree.everySubTree('SchemaForm')).not.to.be.empty;
    expect(tree.everySubTree('FormNavButtons')).not.to.be.empty;
  });
  describe('should handle', () => {
    let tree;
    let setData;
    let router;
    let onSubmit;
    beforeEach(() => {
      setData = sinon.spy();
      onSubmit = sinon.spy();
      router = {
        push: sinon.spy(),
      };

      tree = SkinDeep.shallowRender(
        <FormPage
          router={router}
          setData={setData}
          form={makeForm()}
          onSubmit={onSubmit}
          location={location}
          route={makeRoute()}
        />,
      );
    });
    it('change', () => {
      const newData = {};
      const autoSave = sinon.spy();
      const instance = tree.getMountedInstance();
      instance.debouncedAutoSave = autoSave;
      instance.onChange(newData);

      expect(setData.calledWith('testPage', newData));
    });
    it('submit', () => {
      tree.getMountedInstance().onSubmit({});

      expect(router.push.calledWith('/next-page')).to.be.true;
    });
    it('back', () => {
      tree.getMountedInstance().goBack();

      expect(router.push.calledWith('/first-page')).to.be.true;
    });
    it('go to path', () => {
      tree.getMountedInstance().goToPath('/last-page');

      expect(router.push.calledWith('/last-page')).to.be.true;
    });
  });
  it("should go back to the beginning if current page isn't found", () => {
    const router = {
      push: sinon.spy(),
    };

    const tree = SkinDeep.shallowRender(
      <FormPage
        router={router}
        form={makeForm()}
        route={makeRoute()}
        location={{ pathname: '/missing-page' }}
      />,
    );

    tree.getMountedInstance().goBack();

    expect(router.push.calledWith('/first-page')).to.be.true;
  });
  it('should go to the custom path passed to the goToPath function', () => {
    const router = {
      push: sinon.spy(),
    };
    const route = makeRoute({
      pageConfig: {
        pageKey: 'lastPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
        CustomPage: ({ goToPath }) => (
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              goToPath('/testing');
            }}
          >
            go
          </button>
        ),
      },
    });

    const { getByText } = render(
      <FormPage
        router={router}
        form={makeForm()}
        route={route}
        location={{ pathname: '/last-page' }}
      />,
    );

    fireEvent.click(getByText(/go/));
    expect(router.push.calledWith('/testing')).to.be.true;
  });
  it('should go back to the previous page if the custom path is invalid', () => {
    const router = {
      push: sinon.spy(),
    };
    const route = makeRoute({
      pageConfig: {
        pageKey: 'nextPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
        CustomPage: ({ goToPath }) => (
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              goToPath('/invalid-page');
            }}
          >
            go
          </button>
        ),
      },
    });

    const { getByText } = render(
      <FormPage
        router={router}
        form={makeForm()}
        route={route}
        location={{ pathname: '/next-page' }}
      />,
    );

    fireEvent.click(getByText(/go/));
    expect(router.push.calledWith('/testing')).to.be.true;
  });
  it('should not show a Back button on the first page', () => {
    const tree = SkinDeep.shallowRender(
      <FormPage
        form={makeForm()}
        route={makeRoute()}
        location={{ pathname: '/first-page' }}
      />,
    );

    expect(tree.subTree('FormNavButtons').props.goBack).to.equal(false);
  });
  it('should render array page', () => {
    const route = makeRoute({
      pageConfig: {
        pageKey: 'testPage',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
      },
    });
    const form = makeArrayForm();

    const tree = SkinDeep.shallowRender(
      <FormPage
        form={form}
        route={route}
        params={{ index: 0 }}
        location={{ pathname: '/testing/0' }}
      />,
    );

    expect(tree.subTree('SchemaForm').props.schema).to.equal(
      form.pages.testPage.schema.properties.arrayProp.items[0],
    );
    expect(tree.subTree('SchemaForm').props.uiSchema).to.equal(
      form.pages.testPage.uiSchema.arrayProp.items,
    );
    expect(tree.subTree('SchemaForm').props.data).to.equal(
      form.data.arrayProp[0],
    );
  });
  it('should handle change in array page', () => {
    const setData = sinon.spy();
    const route = makeRoute({
      pageConfig: {
        pageKey: 'testPage',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
      },
    });

    const tree = SkinDeep.shallowRender(
      <FormPage
        setData={setData}
        form={makeArrayForm()}
        route={route}
        params={{ index: 0 }}
        location={location}
      />,
    );

    tree.getMountedInstance().onChange({ test: 2 });

    expect(setData.firstCall.args[0]).to.eql({
      arrayProp: [{ test: 2 }],
    });
  });
  it('should update data using updateDataHooks', () => {
    const setData = sinon.spy();
    const route = makeRoute({
      pageConfig: {
        pageKey: 'firstPage',
        updateFormData: (oldData, newData) => set('foo', 'something', newData),
      },
    });
    const form = makeForm({
      pages: {
        firstPage: {
          schema: {
            type: 'object',
            properties: {
              test: { type: 'string' },
              foo: { type: 'string' },
            },
          },
          uiSchema: {},
        },
      },
    });

    const tree = mount(
      <FormPage
        setData={setData}
        form={form}
        route={route}
        params={{ index: 0 }}
        location={location}
      />,
    );

    const field = tree.find('input#root_test');

    field.simulate('change', { target: { value: 'foo' } });

    expect(setData.firstCall.args[0]).to.eql({
      test: 'foo',
      foo: 'something',
    });

    tree.unmount();
  });
  it('should update array data using updateDataHooks', () => {
    const setData = sinon.spy();
    const route = makeRoute({
      pageConfig: {
        pageKey: 'firstPage',
        updateFormData: (oldData, newData, index) =>
          set(['foo', index, 'bar'], 'something', newData),
      },
    });
    const form = makeForm({
      pages: {
        firstPage: {
          schema: {
            type: 'object',
            properties: {
              test: { type: 'string' },
              foo: { type: 'string' },
            },
          },
          uiSchema: {},
        },
      },
      data: {
        test: '',
        foo: [{}, { bar: '' }],
      },
    });

    const tree = mount(
      <FormPage
        setData={setData}
        form={form}
        route={route}
        params={{ index: 1 }}
        location={location}
      />,
    );

    const field = tree.find('input#root_test');

    field.simulate('change', { target: { value: 'foo' } });

    expect(setData.firstCall.args[0]).to.eql({
      test: 'foo',
      foo: [{}, { bar: 'something' }],
    });

    tree.unmount();
  });
  it('should update data when submitting on array page', () => {
    const setData = sinon.spy();
    const route = makeRoute({
      pageConfig: {
        pageKey: 'testPage',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
      },
    });
    const router = {
      push: sinon.spy(),
    };

    const tree = SkinDeep.shallowRender(
      <FormPage
        setData={setData}
        router={router}
        form={makeArrayForm()}
        route={route}
        location={{ pathname: '/testing/0' }}
        params={{ index: 0 }}
      />,
    );

    tree.getMountedInstance().onSubmit({ formData: { test: 2 } });

    expect(setData.firstCall.args[0]).to.eql({
      arrayProp: [{ test: 2 }],
    });
  });

  describe('bypassing schemaform', () => {
    function makeBypassRoute(CustomPage) {
      return obj => ({
        pageConfig: {
          pageKey: 'testPage',
          CustomPage,
          errorMessages: {},
          title: '',
        },
        pageList: [
          {
            path: '/first-page',
            pageKey: 'firstPage',
          },
          {
            path: '/testing',
            pageKey: 'testPage',
          },
          {
            path: '/next-page',
            pageKey: 'nextPage',
          },
        ],
        ...obj,
      });
    }
    function makeBypassForm(CustomPage) {
      return obj => ({
        pages: {
          firstPage: { schema: {}, uiSchema: {} },
          testPage: { CustomPage },
          lastPage: { schema: {}, uiSchema: {} },
        },
        data: {},
        ...obj,
      });
    }
    function makeBypassArrayForm(CustomPage) {
      return obj => ({
        pages: {
          testPage: {
            CustomPage,
            showPagePerItem: true,
            arrayPath: 'arrayProp',
          },
        },
        data: {
          arrayProp: [{}],
          someOtherProp: 'asdf',
        },
        ...obj,
      });
    }

    it('should render a custom component instead of SchemaForm', () => {
      const CustomPage = () => <div>Hello, world!</div>;
      const tree = SkinDeep.shallowRender(
        <FormPage
          form={makeBypassForm(CustomPage)()}
          route={makeBypassRoute(CustomPage)()}
          location={location}
        />,
      );

      expect(tree.everySubTree('SchemaForm')).to.be.empty;
      expect(tree.everySubTree('CustomPage')).not.to.be.empty;
    });

    it('should return the entire form data to the CustomPage when showPagePerIndex is true', () => {
      const CustomPage = () => <div />;
      const tree = SkinDeep.shallowRender(
        <FormPage
          form={makeBypassArrayForm(CustomPage)()}
          route={makeBypassRoute(CustomPage)({
            pageConfig: {
              pageKey: 'testPage',
              CustomPage,
              errorMessages: {},
              title: '',
              showPagePerItem: true,
              arrayPath: 'arrayProp',
            },
          })}
          location={location}
          params={{ index: 0 }}
        />,
      );

      expect(
        tree.everySubTree('CustomPage')[0].getRenderOutput().props.data,
      ).to.deep.equal({ arrayProp: [{}], someOtherProp: 'asdf' });
    });
  });
});
