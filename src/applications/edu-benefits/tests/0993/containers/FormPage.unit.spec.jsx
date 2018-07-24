import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { FormPageForm } from '../../../0993/containers/FormPageForm';
import fullSchema0993 from '../../../0993/config/form';

describe('Opt Out <FormPageForm>', () => {
  const location = {
    pathname: '/testing/0'
  };

  it('should render', () => {
    const route = {
      formConfig: fullSchema0993,
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      pages: {
        testPage: {
          schema: {},
          uiSchema: {},
        }
      },
      data: {}
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <FormPageForm form={form} route={route} user={user} location={location}/>
    );
    expect(tree.everySubTree('SchemaForm')).not.to.be.empty;
    expect(tree.everySubTree('Connect(DowntimeNotification)').length).to.equal(1);
  });
  describe('should handle', () => {
    let tree;
    let setData;
    let router;
    let onSubmit;
    let form;
    let route;
    let user;
    beforeEach(() => {
      setData = sinon.spy();
      onSubmit = sinon.spy();
      router = {
        push: sinon.spy()
      };
      route = {
        formConfig: fullSchema0993,
        pageConfig: {
          pageKey: 'testPage',
          schema: {},
          uiSchema: {},
          errorMessages: {},
          title: ''
        },
        pageList: [
          {
            path: 'previous-page'
          },
          {
            path: 'testing',
            pageKey: 'testPage'
          },
          {
            path: 'next-page'
          }
        ]
      };
      form = {
        pages: {
          testPage: {
            schema: {},
            uiSchema: {},
          }
        },
        data: {},
        testPage: {
          schema: {},
          uiSchema: {},
          data: {}
        }
      };
      user = {
        profile: {
          savedForms: []
        },
        login: {
          currentlyLoggedIn: false
        }
      };

      tree = SkinDeep.shallowRender(
        <FormPageForm
          router={router}
          setData={setData}
          form={form}
          user={user}
          onSubmit={onSubmit}
          location={location}
          route={route}/>
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

      expect(router.push.calledWith('next-page'));
    });
  });
  it('should render array page', () => {
    const route = {
      formConfig: fullSchema0993,
      pageConfig: {
        pageKey: 'testPage',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      pages: {
        testPage: {
          schema: {
            properties: {
              arrayProp: {
                items: [{}]
              }
            }
          },
          uiSchema: {
            arrayProp: {
              items: {}
            }
          }
        }
      },
      data: {
        arrayProp: [{}]
      }
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <FormPageForm
        form={form}
        user={user}
        route={route}
        params={{ index: 0 }}
        location={location}/>
    );

    expect(tree.subTree('SchemaForm').props.schema).to.equal(form.pages.testPage.schema.properties.arrayProp.items[0]);
    expect(tree.subTree('SchemaForm').props.uiSchema).to.equal(form.pages.testPage.uiSchema.arrayProp.items);
    expect(tree.subTree('SchemaForm').props.data).to.equal(form.data.arrayProp[0]);
  });
  it('should handle change in array page', () => {
    const setData = sinon.spy();
    const route = {
      formConfig: fullSchema0993,
      pageConfig: {
        pageKey: 'testPage',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      pages: {
        testPage: {
          schema: {
            properties: {
              arrayProp: {
                items: [{}]
              }
            }
          },
          uiSchema: {
            arrayProp: {
              items: {}
            }
          }
        }
      },
      data: {
        arrayProp: [{}]
      }
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <FormPageForm
        setData={setData}
        form={form}
        user={user}
        route={route}
        params={{ index: 0 }}
        location={location}/>
    );

    tree.getMountedInstance().onChange({ test: 2 });

    expect(setData.firstCall.args[0]).to.eql({
      arrayProp: [
        {
          test: 2
        }
      ]
    });
  });
  it('should update data when submitting on array page', () => {
    const setData = sinon.spy();
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
        errorMessages: {},
        title: ''
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      pages: {
        testPage: {
          schema: {
            properties: {
              arrayProp: {
                items: [{}]
              }
            }
          },
          uiSchema: {
            arrayProp: {
              items: {}
            }
          }
        }
      },
      data: {
        arrayProp: [{}]
      }
    };
    const user = {
      profile: {
        savedForms: []
      },
      login: {
        currentlyLoggedIn: false
      }
    };
    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <FormPageForm
        setData={setData}
        router={router}
        form={form}
        user={user}
        route={route}
        location={location}
        params={{ index: 0 }}/>
    );

    tree.getMountedInstance().onSubmit({ formData: { test: 2 } });

    expect(setData.firstCall.args[0]).to.eql({
      arrayProp: [
        {
          test: 2
        }
      ]
    });
  });
});
