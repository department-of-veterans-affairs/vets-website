import { fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
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

    const tree = render(
      <ObjectField
        schema={schema}
        idSchema={{}}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.getByRole('textbox')).to.exist;
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

    const tree = render(
      <ObjectField
        schema={schema}
        idSchema={{}}
        formData={{}}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryAllByRole('textbox')).to.be.empty;
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

    const tree = render(
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

    expect(tree.getByRole('textbox')).to.exist;
    expect(tree.getByRole('heading')).to.contain.text('Blah');
  });

  it('should render function title', () => {
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };

    const tree = render(
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

    expect(tree.getByRole('textbox')).to.exist;
    expect(tree.getByRole('heading')).to.contain.text('A function title');
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

    const tree = render(
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

    expect(tree.getByRole('textbox')).to.exist;
    expect(tree.queryAllByRole('heading')).to.be.empty;
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

    const formData = { test: true };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryAllByRole('textbox')).to.be.empty;
    expect(tree.getByRole('checkbox', { name: 'test' })).to.exist;
  });

  it('should hide expand under fields that are hidden', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const schema = {
      properties: {
        test1: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
          'ui:hidden': true,
        },
      },
    };

    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test1',
        },
      },
    };

    const formData = { test: true };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryByRole('checkbox')).to.exist;
    expect(tree.queryByRole('textbox')).to.not.exist;
  });

  it('should hide expand under fields that are hidden on review', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const schema = {
      properties: {
        test1: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
        },
      },
    };

    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test1',
          hideOnReview: true,
        },
      },
    };

    const formData = { test: true };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryByRole('checkbox')).to.exist;
    expect(tree.queryByRole('textbox')).to.not.exist;
  });

  it('should hide expand under fields that are hidden on review if false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const schema = {
      properties: {
        test1: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
        },
      },
    };

    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test1',
          hideOnReviewIfFalse: true,
        },
      },
    };

    const formData = { test: false };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryByRole('checkbox')).to.exist;
    expect(tree.queryByRole('textbox')).to.not.exist;
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

    const formData = { test: true };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryAllByRole('checkbox')).to.be.empty;
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

    const formData = { test: true };

    const uiSchema = {
      test: {
        'ui:options': {
          hideOnReview: () => formData.test,
        },
      },
    };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryAllByRole('checkbox')).to.be.empty;
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

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.queryAllByRole('checkbox')).to.be.empty;
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

    const tree = render(
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

    expect(tree.getAllByRole('textbox')).to.have.length(2);
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

    const tree = render(
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

    expect(tree.getByLabelText('Edit Page Title')).to.exist;

    const review = document.getElementsByClassName('review')[0];
    expect(within(review).getByRole('textbox')).to.exist;
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

    const tree = render(
      <ObjectField
        uiSchema={{
          'ui:options': {
            itemName: 'Custom label',
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

    expect(tree.getByLabelText('Edit Custom label')).to.exist;
  });

  it('should render aria-label on edit button using value from config', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const schema = {
      type: 'object',
      properties: {
        testKey: {
          type: 'string',
        },
      },
    };

    const tree = render(
      <ObjectField
        uiSchema={{
          'ui:options': {
            itemAriaLabel: data => data.testKey,
            itemName: 'Custom label',
          },
        }}
        schema={schema}
        formContext={{ pageTitle: 'Blah' }}
        requiredSchema={{}}
        idSchema={{ $id: 'root' }}
        formData={{
          testKey: 'Happy',
        }}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.getByLabelText('Edit Happy')).to.exist;
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

    const formData = { test: 'foo' };

    const tree = render(
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

    expect(tree.getByLabelText('Edit Blah')).to.exist;

    const review = document.querySelector('div.review');
    expect(within(review).getByRole('textbox')).to.exist;
  });

  it('should render a dl when rendering a ReviewCardField content with volatileData in reviewMode', () => {
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

    const formData = { test: 'foo' };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        formContext={{ pageTitle: 'Blah', reviewMode: true }}
        idSchema={{ $id: 'root' }}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.getByLabelText('Edit Blah')).to.exist;

    const review = document.querySelector('dl.review');
    expect(within(review).getByRole('textbox')).to.exist;
  });

  it('should render a div when rendering a custom title, like in the SelectArrayItemsWidget', () => {
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
          customTitle: 'test',
        },
      },
    };

    const formData = { test: 'foo' };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        formContext={{ pageTitle: 'Blah', reviewMode: false }}
        idSchema={{ $id: 'root' }}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.getByLabelText('Edit Blah')).to.exist;

    const review = document.querySelector('div.review');
    expect(within(review).getByRole('textbox')).to.exist;
  });

  it('should render a div when the file UI is in review mode', () => {
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
          addAnotherLabel: 'test',
        },
      },
    };

    const formData = { test: 'foo' };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        formContext={{ pageTitle: 'Blah', reviewMode: true }}
        idSchema={{ $id: 'root' }}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.getByLabelText('Edit Blah')).to.exist;

    const review = document.querySelector('div.review');
    expect(within(review).getByRole('textbox')).to.exist;
  });

  it('should render a dl when the file UI is in edit mode', () => {
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
          addAnotherLabel: 'test',
        },
      },
    };

    const formData = { test: 'foo' };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        formContext={{ pageTitle: 'Blah', reviewMode: false }}
        idSchema={{ $id: 'root' }}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.getByLabelText('Edit Blah')).to.exist;

    const review = document.querySelector('dl.review');
    expect(within(review).getByRole('textbox')).to.exist;
  });

  it('should render custom ObjectViewField', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const onClick = sinon.spy();

    const schema = {
      properties: {
        testz: {
          type: 'string',
        },
      },
    };

    const uiSchema = {
      'ui:objectViewField': ({
        title,
        defaultEditButton,
        renderedProperties,
      }) => (
        <div>
          <h3 className="test-title">{title}</h3>
          <div className="test-edit">
            {defaultEditButton({
              label: 'fooz',
              onEdit: onClick,
              text: 'barz',
            })}
          </div>
          <div className="test-props">{renderedProperties}</div>
        </div>
      ),
      testz: {},
    };

    const formData = { testz: 'foo' };

    const tree = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        formContext={{ pageTitle: 'Blah' }}
        idSchema={{ $id: 'root' }}
        requiredSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    const title = tree.getByRole('heading');
    expect(title).to.contain.text('Blah');
    expect(title.className).to.contain('test-title');

    const testProps = within(document.querySelector('.test-props'));
    const testField = testProps.getByRole('textbox');
    const testLabel = testProps.getByText('testz', { selector: 'label' });
    expect(testField).to.exist;
    expect(testField.value).to.equal('foo');
    expect(testLabel).to.exist;

    const testEdit = within(document.querySelector('.test-edit'));
    const editButton = testEdit.getByRole('button', { name: 'fooz' });
    expect(editButton).to.exist;
    expect(editButton.textContent).to.equal('barz');

    fireEvent.click(editButton);
    expect(onClick.called).to.be.true;
  });
});
