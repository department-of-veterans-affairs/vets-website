import { expect } from 'chai';
import { shallow } from 'enzyme';
import _ from 'lodash/fp';
import set from 'platform/utilities/data/set';
import React from 'react';
import { spy } from 'sinon';
import { AddressCardField } from '../components/addressFields/AddressCardField';

const viewComponent = formData => (
  <div>
    {Object.keys(formData).map(property => (
      <p key={property}>{property}</p>
    ))}
  </div>
);
describe('Schemaform: AddressCardField', () => {
  const defaultProps = {
    schema: {
      type: 'object',
      properties: {
        field1: { type: 'string' },
        field2: { type: 'boolean' },
      },
    },
    uiSchema: {
      'ui:title': 'Thing',
      'ui:subtitle': 'Subtitle',
      'ui:field': AddressCardField,
      'ui:options': { viewComponent },
    },
    idSchema: {
      $id: 'something',
      field1: { $id: 'field1' },
      field2: { $id: 'field2' },
    },
    errorSchema: {
      field1: { __errors: [] },
      field2: { __errors: [] },
    },
    formContext: {
      onError: () => {},
    },
    formData: {
      field1: 'asdf',
    },
    onChange: spy(),
    onBlur: () => {},
  };

  it('should render', () => {
    const wrapper = shallow(<AddressCardField {...defaultProps} />);
    expect(
      wrapper.containsMatchingElement(
        <h4 className="review-card--title">Thing</h4>,
      ),
    ).to.equal(true);
    wrapper.unmount();
  });

  it('should throw an error if no viewComponent is found', () => {
    expect(() => {
      // eslint-disable-next-line va-enzyme/unmount
      shallow(<AddressCardField {...defaultProps} uiSchema={{}} />);
    }).to.throw('viewComponent');
  });

  it('should throw an error if schema type is not object or array', () => {
    expect(() => {
      // eslint-disable-next-line va-enzyme/unmount
      shallow(
        <AddressCardField {...defaultProps} schema={{ type: 'string' }} />,
      );
    }).to.throw('Unknown schema type');
  });

  // Also tests that it renders a custom component
  it('should start in view mode', () => {
    const wrapper = shallow(<AddressCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').length).to.equal(1);
    expect(wrapper.find('.input-section').length).to.equal(0);
    wrapper.unmount();
  });

  it('should start in edit mode', () => {
    const errorSchema = {
      field1: { __errors: ['Arbitrary error string here'] },
      field2: { __errors: [] },
    };
    const wrapper = shallow(
      <AddressCardField {...defaultProps} errorSchema={errorSchema} />,
    );
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);
    wrapper.unmount();
  });

  it('should pass formData the custom view component', () => {
    const wrapper = shallow(<AddressCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').props()).to.eql({
      formData: defaultProps.formData,
    });
    wrapper.unmount();
  });

  it('should transition to edit mode', () => {
    const wrapper = shallow(<AddressCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').length).to.equal(1);

    // Start editing
    wrapper.find('a').simulate('click');
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);
    wrapper.unmount();
  });

  it('should transition to view mode', () => {
    // Not sure how to be not duplicate an existing test here
    const wrapper = shallow(<AddressCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').length).to.equal(1);

    // Start editing
    wrapper.find('a').simulate('click');
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);

    // Go back to viewing
    wrapper.find('.cancel-button').simulate('click');
    expect(wrapper.find('.input-section').length).to.equal(0);
    expect(wrapper.find('viewComponent').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render the appropriate field in reviewMode according to the data type', () => {
    const props = set('formContext.onReviewPage', true, defaultProps);
    const tree = shallow(<AddressCardField {...props} />);
    expect(tree.find('ObjectField').length).to.equal(1);
    tree.unmount();
  });

  it('should handle a custom reviewTitle', () => {
    const props = set(
      'uiSchema.ui:options.reviewTitle',
      'Thingy',
      defaultProps,
    );
    const tree = shallow(<AddressCardField {...props} />);
    expect(tree.find('.review-card--title').text()).to.equal('Thingy');
    tree.unmount();
  });

  it('should handle a subtitle', () => {
    const props = _.flow(
      _.set('uiSchema.ui:subtitle', 'Subtitle text'),
      _.set('uiSchema.ui:options.startInEdit', true),
    )(defaultProps);

    const tree = shallow(<AddressCardField {...props} />);
    expect(tree.find('.review-card--subtitle').text()).to.equal(
      'Subtitle text',
    );
    tree.unmount();
  });

  describe('startInEdit', () => {
    it('should handle truthy values', () => {
      const props = set('uiSchema.ui:options.startInEdit', true, defaultProps);
      const tree = shallow(<AddressCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(1);
      tree.unmount();
    });

    it('should handle falsey values', () => {
      const props = set('uiSchema.ui:options.startInEdit', false, defaultProps);
      const tree = shallow(<AddressCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(0);
      tree.unmount();
    });

    it('should handle functions', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        formData => formData.field1 === 'asdf',
        defaultProps,
      );
      const tree = shallow(<AddressCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(1);
      tree.unmount();
    });
  });

  it('should handle a custom editTitle', () => {
    const editModeProps = set(
      'uiSchema.ui:options.startInEdit',
      true,
      defaultProps,
    );
    const props = set('uiSchema.ui:options.editTitle', 'thingy', editModeProps);
    const wrapper = shallow(<AddressCardField {...props} />);
    expect(
      wrapper.containsMatchingElement(
        <button className="usa-button-primary update-button">
          Save thingy
        </button>,
      ),
    ).to.equal(true);
    wrapper.unmount();
  });
});
