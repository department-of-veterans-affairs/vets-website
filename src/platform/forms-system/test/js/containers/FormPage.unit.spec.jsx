import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { mount } from 'enzyme';
import sinon from 'sinon';

import set from '../../../../utilities/data/set';

import { FormPage } from '../../../src/js/containers/FormPage';

// Build our mock objects
function makeRoute(obj, pageConfig = {}) {
  return {
    pageConfig: {
      pageKey: 'testPage',
      schema: {},
      uiSchema: {},
      errorMessages: {},
      title: '',
      ...pageConfig,
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

function makeFormArrayEmployersNoData() {
  return {
    pages: {
      testPage: {
        schema: {
          properties: {
            arrayProp: {
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                },
                required: ['name'],
              },
            },
          },
        },
        uiSchema: {
          arrayProp: {
            items: {
              name: {
                'ui:title': 'Name of employer',
              },
            },
          },
        },
      },
    },
    data: {},
  };
}

function makeRouteArrayEmployers(obj) {
  return makeRoute({
    pageConfig: {
      schema: {
        type: 'object',
        properties: {
          arrayProp: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      uiSchema: {
        arrayProp: {
          items: {
            name: {
              'ui:title': 'Name of employer',
            },
          },
        },
      },
      errorMessages: {},
      title: 'Array page',
      pageKey: 'testPage',
      showPagePerItem: true,
      arrayPath: 'arrayProp',
      ...obj,
    },
  });
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

  it('should hide nav buttons when formOptions set', () => {
    const route = makeRoute({
      formConfig: { formOptions: { noBottomNav: true } },
    });
    const tree = SkinDeep.shallowRender(
      <FormPage form={makeForm()} route={route} location={location} />,
    );

    expect(tree.everySubTree('SchemaForm')).not.to.be.empty;
    expect(tree.everySubTree('FormNavButtons')).to.be.empty;
  });

  describe('should handle', () => {
    let tree;
    let setData;
    let route;
    let router;
    let onSubmit;
    beforeEach(() => {
      setData = sinon.spy();
      onSubmit = sinon.spy();
      router = {
        push: sinon.spy(),
      };
      route = makeRoute({}, { onContinue: sinon.spy() });

      tree = SkinDeep.shallowRender(
        <FormPage
          router={router}
          setData={setData}
          form={makeForm({ data: { test: true } })}
          onSubmit={onSubmit}
          location={location}
          route={route}
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
    it('onContinue', () => {
      tree.getMountedInstance().onContinue();

      expect(route.pageConfig.onContinue.called).to.be.true;
      expect(route.pageConfig.onContinue.args[0][0]).to.deep.equal({
        test: true,
      });
      expect(route.pageConfig.onContinue.args[0][1]).to.deep.equal(setData);
    });
  });

  describe('should allow a dynamic customized forward and back navigation paths', () => {
    let tree;
    let setData;
    let router;
    let onSubmit;
    const baseForm = makeForm();
    const testPageConfig = {
      schema: {
        type: 'object',
        properties: {
          test: { type: 'string' },
        },
      },
      uiSchema: {},
      onNavForward: ({ formData, goPath, goNextPath }) => {
        if (formData.test) {
          goPath('last-page');
        } else {
          goNextPath();
        }
      },
      onNavBack: ({ formData, goPath, goPreviousPath }) => {
        if (formData.test) {
          goPath('last-page');
        } else {
          goPreviousPath();
        }
      },
    };

    function renderForm(data) {
      tree = SkinDeep.shallowRender(
        <FormPage
          router={router}
          setData={setData}
          form={{
            pages: {
              firstPage: baseForm.pages.firstPage,
              testPage: testPageConfig,
              nextPage: baseForm.pages.nextPage,
              lastPage: baseForm.pages.lastPage,
            },
            data,
          }}
          onSubmit={onSubmit}
          location={{ pathname: '/testing' }}
          route={makeRoute({
            pageConfig: {
              pageKey: 'testPage',
              ...testPageConfig,
            },
          })}
        />,
      );
    }

    beforeEach(() => {
      setData = sinon.spy();
      onSubmit = sinon.spy();
      router = {
        push: sinon.spy(),
      };
    });

    it('onNavForward goNextPath works correctly', () => {
      renderForm({ test: '' });
      tree.getMountedInstance().onSubmit({ formData: { test: '' } });
      expect(router.push.calledWith('/next-page')).to.be.true;
    });

    it('onNavForward goPath works correctly', () => {
      renderForm({ test: 'test' });
      tree.getMountedInstance().onSubmit({ formData: { test: 'test' } });
      expect(router.push.calledWith('last-page')).to.be.true;
    });

    it('onNavBack goPreviousPath works correctly', () => {
      renderForm({ test: '' });
      tree.getMountedInstance().goBack({ formData: { test: '' } });
      expect(router.push.calledWith('/first-page')).to.be.true;
    });

    it('onNavBack goPath works correctly', () => {
      renderForm({ test: 'test' });
      tree.getMountedInstance().goBack({ formData: { test: 'test' } });
      expect(router.push.calledWith('last-page')).to.be.true;
    });
  });

  describe('should allow for urlParams on goNextPath or goPreviousPath', () => {
    let tree;
    let setData;
    let router;
    let onSubmit;
    const baseForm = makeForm();
    const testPageConfig = {
      schema: {
        type: 'object',
        properties: {
          test: { type: 'string' },
        },
      },
      uiSchema: {},
      onNavForward: ({ goNextPath, urlParams }) => {
        goNextPath(urlParams);
      },
      onNavBack: ({ goPreviousPath, urlParams }) => {
        goPreviousPath(urlParams);
      },
    };

    function renderForm(data) {
      tree = SkinDeep.shallowRender(
        <FormPage
          router={router}
          setData={setData}
          form={{
            pages: {
              firstPage: baseForm.pages.firstPage,
              testPage: testPageConfig,
              lastPage: baseForm.pages.lastPage,
            },
            data,
          }}
          onSubmit={onSubmit}
          location={{
            pathname: '/testing',
            query: {
              mode: 'add',
            },
          }}
          route={makeRoute({
            pageConfig: {
              pageKey: 'testPage',
              ...testPageConfig,
            },
          })}
        />,
      );
    }

    beforeEach(() => {
      setData = sinon.spy();
      onSubmit = sinon.spy();
      router = {
        push: sinon.spy(),
      };
    });

    it('onNavForward goNextPath works correctly', () => {
      renderForm({ test: '' });
      tree.getMountedInstance().onSubmit({ formData: { test: '' } });
      expect(router.push.calledWith('/next-page?mode=add')).to.be.true;
    });

    it('onNavBack goPreviousPath works correctly', () => {
      renderForm({ test: '' });
      tree.getMountedInstance().goBack({ formData: { test: '' } });
      expect(router.push.calledWith('/first-page?mode=add')).to.be.true;
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
              goToPath('/testing?index=3');
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
    expect(router.push.calledWith('/testing?index=3')).to.be.true;
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

  it('prePopulateArray should update data if allowPathWithNoItems and showPagePerItem is set', () => {
    const setData = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormPage
        form={makeFormArrayEmployersNoData()}
        route={makeRouteArrayEmployers({
          showPagePerItem: true,
          allowPathWithNoItems: true,
        })}
        params={{ index: 0 }}
        location={{ pathname: '/testing/0' }}
        setData={setData}
      />,
    );

    tree.getMountedInstance().prePopulateArrayData();
    expect(setData.firstCall.args[0]).to.eql({
      arrayProp: [{ name: undefined }],
    });
  });

  it('prePopulateArray should not update data if allowPathWithNoItems is not set', () => {
    const setData = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormPage
        form={makeFormArrayEmployersNoData()}
        route={makeRouteArrayEmployers({
          showPagePerItem: true,
        })}
        params={{ index: 0 }}
        location={{ pathname: '/testing/0' }}
        setData={setData}
      />,
    );

    tree.getMountedInstance().prePopulateArrayData();
    expect(setData.firstCall).to.eql(null);
  });

  it('getArrayIndexedData and setArrayIndexedData should behave correctly', () => {
    const tree = SkinDeep.shallowRender(
      <FormPage
        form={makeFormArrayEmployersNoData()}
        route={makeRouteArrayEmployers({
          showPagePerItem: true,
        })}
        params={{ index: 0 }}
        location={{ pathname: '/testing/0' }}
      />,
    );

    const formPage = tree.getMountedInstance();
    const data = formPage.getArrayIndexedData();
    expect(data).to.eql(undefined);

    const newData = formPage.setArrayIndexedData({
      name: 'bob',
    });
    expect(newData).to.eql({
      arrayProp: [
        {
          name: 'bob',
        },
      ],
    });
  });

  it('should allow going to an array page with no data if allowPathWithNoItems is enabled', () => {
    const router = {
      push: sinon.spy(),
    };
    const onSubmit = sinon.spy();
    const route = {
      pageConfig: {
        pageKey: 'firstPage',
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
          path: '/array-item',
          pageKey: 'arrayItem',
          showPagePerItem: true,
          arrayPath: 'arrayProp',
          allowPathWithNoItems: true,
        },
      ],
    };

    const form = {
      pages: {
        firstPage: {
          uiSchema: {},
          schema: {
            name: {
              type: 'string',
            },
          },
        },
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
          showPagePerItem: true,
          arrayPath: 'arrayProp',
          allowPathWithNoItems: true,
        },
      },
      data: {
        name: 'test',
        arrayProp: undefined,
      },
    };

    const tree = SkinDeep.shallowRender(
      <FormPage
        form={form}
        route={route}
        router={router}
        onSubmit={onSubmit}
        location={{ pathname: '/first-page' }}
      />,
    );

    tree.getMountedInstance().onSubmit({});
    expect(router.push.calledWith('/array-item')).to.be.true;
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
      const contentBeforeButtons = 'before';
      const contentAfterButtons = 'after';
      const tree = SkinDeep.shallowRender(
        <FormPage
          form={makeBypassForm(CustomPage)()}
          route={makeBypassRoute(CustomPage)()}
          location={location}
          contentBeforeButtons={contentBeforeButtons}
          contentAfterButtons={contentAfterButtons}
        />,
      );

      expect(tree.everySubTree('SchemaForm')).to.be.empty;
      expect(tree.everySubTree('CustomPage')).not.to.be.empty;
      const { props } = tree.everySubTree('CustomPage')[0].getRenderOutput();
      expect(props.contentBeforeButtons).to.equal(contentBeforeButtons);
      expect(props.contentAfterButtons).to.equal(contentAfterButtons);
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

    it('should focus on ".nav-header > h2" in pre-v3 forms when useCustomScrollAndFocus is not set in form config', async () => {
      const CustomPage = () => (
        <div id="main" className="nav-header">
          <div name="topScrollElement" />
          <h2 id="nav-form-header">H2</h2>
          <div name="topContentElement" />
          <h3>H3</h3>
        </div>
      );
      render(
        <FormPage
          form={makeBypassForm(CustomPage)()}
          route={{
            ...makeBypassRoute(CustomPage)(),
            formConfig: { useCustomScrollAndFocus: false },
          }}
          location={location}
        />,
      );

      await waitFor(() => {
        expect(document.activeElement.tagName).to.eq('H2');
      });
    });

    it('should focus on ".usa-step-indicator__heading" in v3 forms when useCustomScrollAndFocus is not set in form config', async () => {
      const CustomPageV3 = () => (
        <div id="main" className="nav-header">
          <div name="topScrollElement" />
          <va-segmented-progress-bar
            total="7"
            current="1"
            uswds="true"
            heading-text="Your identity"
            name="v3SegmentedProgressBar"
            header-level="2"
            className="hydrated"
          >
            <div className="usa-step-indicator__header">
              <h2 className="usa-step-indicator__heading">
                <span className="usa-step-indicator__heading-counter">
                  <span className="usa-sr-only">Step</span>
                  <span className="usa-step-indicator__current-step">1</span>
                  <span className="usa-step-indicator__total-steps"> of 7</span>
                </span>
                <span className="usa-step-indicator__heading-text">H2</span>
              </h2>
            </div>
          </va-segmented-progress-bar>
          <h3>H3</h3>
        </div>
      );
      render(
        <FormPage
          form={makeBypassForm(CustomPageV3)()}
          route={{
            ...makeBypassRoute(CustomPageV3)(),
            formConfig: { useCustomScrollAndFocus: false },
          }}
          location={location}
        />,
      );

      it('should focus on "#main h3" when useCustomScrollAndFocus is set in form config', async () => {
        const CustomPage = () => (
          <div id="main">
            <div name="topScrollElement" />
            <h2>H2</h2>
            <div name="topContentElement" />
            <h3>H3</h3>
          </div>
        );
        render(
          <FormPage
            form={makeBypassForm(CustomPage)()}
            route={{
              ...makeBypassRoute(CustomPage)(),
              formConfig: { useCustomScrollAndFocus: true },
            }}
            location={location}
          />,
        );

        await waitFor(() => {
          expect(document.activeElement.tagName).to.eq('H3');
        });
      });

      await waitFor(() => {
        expect(document.activeElement.tagName).to.eq('H2');
      });
    });

    it('can receive ContentBeforeButtons that has access to setFormData and router', () => {
      const setData = sinon.spy();
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
          // eslint-disable-next-line react/prop-types
          ContentBeforeButtons: ({ router: r, formData, setFormData }) => (
            <>
              <va-button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  setFormData({
                    ...formData,
                    test: true,
                  });
                }}
              >
                set data
              </va-button>
              <va-button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  r.push('/testing');
                }}
              >
                go
              </va-button>
            </>
          ),
        },
      });

      const { getByText } = render(
        <FormPage
          router={router}
          form={makeForm()}
          setData={setData}
          route={route}
          location={{ pathname: '/next-page' }}
        />,
      );

      fireEvent.click(getByText(/set data/));
      expect(setData.firstCall.args[0]).to.eql({
        test: true,
      });
      fireEvent.click(getByText(/go/));
      expect(router.push.calledWith('/testing')).to.be.true;
    });
  });
});
