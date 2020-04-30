import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ObjectField from '../../../src/js/review/ObjectField';

describe('Schemaform review: ObjectField', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField')).not.to.be.empty;
  });
  it('should not render hidden field', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          'ui:hidden': true,
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        formData={{}}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField')).to.be.empty;
  });
  it('should render header', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={{}}
        schema={schema}
        formContext={{ pageTitle: 'Blah' }}
        requiredSchema={{}}
        idSchema={{ $id: 'root' }}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('.form-review-panel-page-header-row')).not.to.be
      .empty;
    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(
      'Blah',
    );
  });
  it('should render function title', () => {
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={{}}
        schema={schema}
        formContext={{ pageTitle: () => 'A function title' }}
        requiredSchema={{}}
        idSchema={{ $id: 'root' }}
        formData={{}}
        onChange={f => f}
        onBlur={f => f}
      />,
    );

    expect(tree.everySubTree('.form-review-panel-page-header-row')).not.to.be
      .empty;
    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(
      'A function title',
    );
  });
  it('should hide title', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={{}}
        schema={schema}
        requiredSchema={{}}
        formContext={{ hideTitle: true, pageTitle: 'Blah' }}
        idSchema={{ $id: 'root' }}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('.form-review-panel-page-header-row')).not.to.be
      .empty;
    // Empty headers are no longer rendered
    expect(tree.subTree('.form-review-panel-page-header')).to.be.false;
  });
  it('should hide expand under items when collapsed', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
          'ui:collapsed': true,
        },
      },
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test',
        },
      },
    };
    const formData = {
      test: true,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
  });
  it('should hide fields that are hide on review', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      test: {
        'ui:options': {
          hideOnReview: true,
        },
      },
    };
    const formData = {
      test: true,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField')).to.be.empty;
  });
  it('should hide fields that are hide on review using callback', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
      },
    };
    const formData = {
      test: true,
    };
    const uiSchema = {
      test: {
        'ui:options': {
          hideOnReview: () => formData.test,
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField')).to.be.empty;
  });
  it('should hide false fields that are hide on review false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      test: {
        'ui:options': {
          hideOnReviewIfFalse: true,
        },
      },
    };
    const formData = {
      test: false,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField')).to.be.empty;
  });
  it('should show expandable fields', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
        test2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        uiSchema={uiSchema}
        formData={{ test: 'thing', test2: 'Stuff' }}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('SchemaField').length).to.equal(2);
  });
  it('should render aria-label on edit button using page title', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={{}}
        schema={schema}
        formContext={{ pageTitle: 'Page Title' }}
        requiredSchema={{}}
        idSchema={{ $id: 'root' }}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(
      tree.subTree('.form-review-panel-page-header-row').subTree('.edit-btn')
        .props['aria-label'],
    ).to.equal('Edit Page Title');
    const review = tree.props.children[1];
    expect(review.type).to.equal('dl');
    expect(review.props.className).to.equal('review');
  });
  it('should render aria-label on edit button using value from config', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={{
          'ui:options': {
            ariaLabelForEditButtonOnReview: 'Custom label',
          },
        }}
        schema={schema}
        formContext={{ pageTitle: 'Blah' }}
        requiredSchema={{}}
        idSchema={{ $id: 'root' }}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(
      tree.subTree('.form-review-panel-page-header-row').subTree('.edit-btn')
        .props['aria-label'],
    ).to.equal('Custom label');
  });

  it('should render a div when rendering a ReviewCardField content with volatileData', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      test: {
        'ui:options': {
          volatileData: true,
        },
      },
    };
    const formData = {
      test: { foo: 'test' },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        formContext={{ pageTitle: 'Blah' }}
        idSchema={{ $id: 'root' }}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );
    // expecting a "div.review" instead of a "dl.review"
    const review = tree.props.children[1];
    expect(review.type).to.equal('div');
    expect(review.props.className).to.equal('review');
  });
});
