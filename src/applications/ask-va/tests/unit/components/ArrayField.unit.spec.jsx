import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ArrayField from '../../../components/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f,
  },
};
const formContext = {};
const requiredSchema = {};

describe('Schemaform review <ArrayField>', () => {
  it('should render', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(
      uiSchema['ui:title'],
    );
    expect(tree.everySubTree('SchemaForm')).to.be.empty;
  });
  it('should render items', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
      additionalItems: {},
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [{}, {}];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.everySubTree('SchemaForm').length).to.equal(2);
  });
  it('should render item name', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
        itemName: 'item name',
      },
    };
    const arrayData = [{}, {}];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    tree.getMountedInstance().handleAdd();
    expect(tree.everySubTree('.schemaform-array-row-title')[0].text()).to.equal(
      'New item name',
    );
    expect(tree.everySubTree('button')[2].text()).to.equal(
      'Add another item name',
    );
  });

  it('should call handleAdd in edit mode with no data', () => {
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
        itemName: 'item name',
      },
    };
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={[]}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        registry={registry}
        formContext={{ onReviewPage: true }}
        pageTitle=""
        editing={false} // Not already in edit mode
        requiredSchema={requiredSchema}
      />,
    );
    tree.getMountedInstance().componentDidMount();
    expect(tree.everySubTree('.schemaform-array-row-title')[0].text()).to.equal(
      'New item name',
    );
    expect(tree.everySubTree('button')[2].text()).to.equal(
      'Add another item name',
    );
  });

  it('should render array warning', () => {
    // If it's a BasicArrayField with a set minItems, make sure it doesn't break
    //  if no items are found; it should render a validation warning instead.
    const idSchema = {};
    const schema = {
      type: 'array',
      minItems: 1,
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:field': 'BasicArrayField',
      items: {},
      'ui:options': {
        viewField: f => f,
        itemName: 'Item name',
      },
    };
    const arrayData = undefined;
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    tree.getMountedInstance().handleAdd();

    expect(tree.everySubTree('.schemaform-review-array-error')).to.not.be.empty;
  });
  it('should render start in edit mode for duplicate items', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {
        test: {
          type: 'string',
        },
      },
      'ui:options': {
        viewField: f => f,
        itemName: 'Item name',
        duplicateKey: 'field',
      },
    };
    // Duplicates are case insensitive
    const arrayData = [
      { field: 'a' },
      { field: 'b' },
      { field: 'A' },
      { field: 'a' },
      { field: 'B' },
    ];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.getMountedInstance().state.editing).to.deep.equal([
      false,
      false,
      true,
      true,
      true,
    ]);
  });

  it('should render unique aria-labels on buttons from ui option key in item', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {
        test: {},
        'ui:options': {
          itemAriaLabel: data => data.field,
        },
      },
      'ui:options': {
        viewField: f => f,
        itemAriaLabel: data => data.field,
        itemName: 'Itemz',
      },
    };
    const arrayData = [{ field: 'foo' }, { field: 'bar' }];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    tree.getMountedInstance().handleEdit(1, true);
    tree.getMountedInstance().handleAdd();
    expect(tree.everySubTree('.schemaform-array-row-title')[0].text()).to.equal(
      'New Itemz',
    );
    const buttons = tree.everySubTree('button');
    expect(buttons[0].props['aria-label']).to.equal('Update bar');
    expect(buttons[1].props['aria-label']).to.equal('Remove bar');
    expect(buttons[2].props['aria-label']).to.equal('Update Itemz');
    expect(buttons[3].props['aria-label']).to.equal('Remove Itemz');
    expect(buttons[4].text()).to.equal('Add another Itemz');
  });

  describe('should handle', () => {
    let tree;
    let setData;
    beforeEach(() => {
      const schema = {
        type: 'array',
        maxItems: 2,
        items: [
          {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      };
      const uiSchema = {
        'ui:title': 'List of things',
        items: {},
        'ui:options': {
          viewField: f => f,
        },
      };
      const arrayData = [{}];
      setData = sinon.spy();
      tree = SkinDeep.shallowRender(
        <ArrayField
          pageKey="page1"
          setData={setData}
          arrayData={arrayData}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );
    });
    it('edit', () => {
      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.true;

      tree.subTree('SchemaForm').props.onEdit();

      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.undefined;
    });
    it('update', () => {
      tree.subTree('SchemaForm').props.onEdit();
      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.undefined;

      tree.subTree('SchemaForm').props.onSubmit();

      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.true;
    });
    it('add', () => {
      expect(tree.everySubTree('SchemaForm').length).to.equal(1);

      tree.getMountedInstance().handleAdd();

      expect(tree.everySubTree('SchemaForm').length).to.equal(2);
    });
    it('enforces max items', () => {
      expect(tree.subTree('.add-btn').props.disabled).to.be.false;

      tree.getMountedInstance().handleAdd();

      expect(tree.subTree('.add-btn').props.disabled).to.be.true;
    });
  });

  it('should update state when props change', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
      additionalItems: {},
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [
      {
        testing: 1,
      },
    ];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    const instance = tree.getMountedInstance();

    const newProps = {
      ...instance.props,
      arrayData: [],
    };

    instance.UNSAFE_componentWillReceiveProps(newProps);

    expect(instance.state.items).to.eql(newProps.arrayData);
    expect(instance.state.editing).to.eql([]);
  });
  it('should render reviewTitle first', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
        reviewTitle: 'My List',
      },
    };
    const arrayData = [];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle="Page Title"
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(
      uiSchema['ui:options'].reviewTitle,
    );
    expect(tree.everySubTree('SchemaForm')).to.be.empty;
  });
  it('should render page title', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': ' ',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [];
    const tree = SkinDeep.shallowRender(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle="Page Title"
        requiredSchema={requiredSchema}
      />,
    );

    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(
      'Page Title',
    );
    expect(tree.everySubTree('SchemaForm')).to.be.empty;
  });
});
