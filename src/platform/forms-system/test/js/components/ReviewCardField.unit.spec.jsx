import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import flow from 'lodash/flow';

import set from 'platform/utilities/data/set';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

const viewComponent = formData => (
  <div>
    {Object.keys(formData).map(property => (
      <p key={property}>{property}</p>
    ))}
  </div>
);

describe('Schemaform: ReviewCardField', () => {
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
      'ui:field': ReviewCardField,
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
    const wrapper = shallow(<ReviewCardField {...defaultProps} />);
    expect(wrapper.text()).to.contain('Thing');
    wrapper.unmount();
  });

  it('should throw an error if no viewComponent is found', () => {
    expect(() => {
      // Not necessary if not componentWillUnmount
      // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
      shallow(<ReviewCardField {...defaultProps} uiSchema={{}} />);
    }).to.throw('viewComponent');
  });

  it('should throw an error if schema type is not object or array', () => {
    expect(() => {
      // Not necessary if not componentWillUnmount
      // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
      shallow(
        <ReviewCardField {...defaultProps} schema={{ type: 'string' }} />,
      );
    }).to.throw('Unknown schema type');
  });

  // Also tests that it renders a custom component
  it('should start in view mode', () => {
    const wrapper = shallow(<ReviewCardField {...defaultProps} />);
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
      <ReviewCardField {...defaultProps} errorSchema={errorSchema} />,
    );
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);
    wrapper.unmount();
  });

  it('should pass formData the custom view component', () => {
    const wrapper = shallow(<ReviewCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').props()).to.eql({
      formData: defaultProps.formData,
    });
    wrapper.unmount();
  });

  it('should transition to edit mode', () => {
    const wrapper = shallow(<ReviewCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').length).to.equal(1);

    // Start editing
    wrapper.find('.usa-button-secondary').simulate('click');
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);
    wrapper.unmount();
  });

  it('should transition to view mode', () => {
    // Not sure how to be not duplicate an existing test here
    const wrapper = shallow(<ReviewCardField {...defaultProps} />);
    expect(wrapper.find('viewComponent').length).to.equal(1);

    // Start editing
    wrapper.find('.usa-button-secondary').simulate('click');
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);

    // Go back to viewing
    wrapper.find('.update-button').simulate('click');
    expect(wrapper.find('.input-section').length).to.equal(0);
    expect(wrapper.find('viewComponent').length).to.equal(1);
    wrapper.unmount();
  });

  it('should show the input value after editing a second time', () => {
    const wrapper = mount(<ReviewCardField {...defaultProps} />);

    // Start editing
    wrapper.find('.usa-button-secondary').simulate('click');

    // Find the input and update its value
    const inputField = wrapper
      .find('input')
      .first()
      .instance();

    inputField.value = 'test';

    // Go back to viewing
    wrapper.find('.update-button').simulate('click');

    // Go back to editing
    wrapper.find('.usa-button-secondary').simulate('click');

    // Expect the updated value to still be there
    expect(inputField.value).to.equal('test');

    wrapper.unmount();
  });

  it('should not transition to view mode if there are validation errors', () => {
    // Start with errors
    const errorSchema = {
      field1: { __errors: ['Arbitrary error string here'] },
      field2: { __errors: [] },
    };
    const wrapper = mount(
      <ReviewCardField {...defaultProps} errorSchema={errorSchema} />,
    );
    expect(wrapper.find('viewComponent').length).to.equal(0);
    expect(wrapper.find('.input-section').length).to.equal(1);

    // Try to go back to viewing
    wrapper.find('.update-button').simulate('click');
    expect(wrapper.find('.input-section').length).to.equal(1);
    expect(wrapper.find('viewComponent').length).to.equal(0);

    // Also check that the validation error is rendered while we're at it
    expect(wrapper.text()).to.contain('Arbitrary error string here');
    wrapper.unmount();
  });

  it('should render the appropriate field in reviewMode according to the data type', () => {
    const props = set('formContext.onReviewPage', true, defaultProps);
    const tree = shallow(<ReviewCardField {...props} />);
    expect(tree.find('ObjectField').length).to.equal(1);
    tree.unmount();
  });

  it('should handle a custom reviewTitle', () => {
    const props = set(
      'uiSchema.ui:options.reviewTitle',
      'Thingy',
      defaultProps,
    );
    const tree = shallow(<ReviewCardField {...props} />);
    expect(tree.find('.review-card--title').text()).to.equal('Thingy');
    tree.unmount();
  });

  it('should handle a subtitle', () => {
    const props = flow(
      defProps => set('uiSchema.ui:subtitle', 'Subtitle text', defProps),
      defProps => set('uiSchema.ui:options.startInEdit', true, defProps),
    )(defaultProps);

    const tree = shallow(<ReviewCardField {...props} />);
    expect(tree.find('.review-card--subtitle').text()).to.equal(
      'Subtitle text',
    );
    tree.unmount();
  });

  describe('startInEdit', () => {
    it('should handle truthy values', () => {
      const props = set('uiSchema.ui:options.startInEdit', true, defaultProps);
      const tree = shallow(<ReviewCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(1);
      tree.unmount();
    });

    it('should handle falsey values', () => {
      const props = set('uiSchema.ui:options.startInEdit', false, defaultProps);
      const tree = shallow(<ReviewCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(0);
      tree.unmount();
    });

    it('should handle functions', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        formData => formData.field1 === 'asdf',
        defaultProps,
      );
      const tree = shallow(<ReviewCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(1);
      tree.unmount();
    });

    it('should not show cancel button when startInEdit forces edit mode (non-volatile)', () => {
      const props = set('uiSchema.ui:options.startInEdit', true, defaultProps);
      const tree = shallow(<ReviewCardField {...props} />);
      expect(tree.find('.input-section').length).to.equal(1);
      expect(tree.find('.cancel-button').length).to.equal(0);
      tree.unmount();
    });

    it('should show cancel button after a successful save then re-edit (non-volatile)', () => {
      const props = set('uiSchema.ui:options.startInEdit', true, defaultProps);
      const tree = shallow(<ReviewCardField {...props} />);
      // Started in edit, no cancel
      expect(tree.find('.cancel-button').length).to.equal(0);

      // Save successfully
      tree.find('.update-button').simulate('click');
      // Now in view mode, click edit
      tree.find('.usa-button-secondary').simulate('click');
      // Cancel should now be available
      expect(tree.find('.cancel-button').length).to.equal(1);
      tree.unmount();
    });
  });

  it('should handle a custom editTitle', () => {
    const editModeProps = set(
      'uiSchema.ui:options.startInEdit',
      true,
      defaultProps,
    );
    const props = set('uiSchema.ui:options.editTitle', 'Thingy', editModeProps);
    const tree = shallow(<ReviewCardField {...props} />);
    expect(tree.find('.review-card--title').text()).to.equal('Thingy');
    tree.unmount();
  });

  describe('volatileData', () => {
    const defaultVDProps = set(
      'uiSchema.ui:options.volatileData',
      true,
      defaultProps,
    );

    it('should remove the edit button from the header in review mode', () => {
      const tree = shallow(<ReviewCardField {...defaultVDProps} />);
      expect(tree.find('.review-card--header .edit-button').length).to.equal(0);
      tree.unmount();
    });

    it('should remove the save button in review mode', () => {
      const tree = shallow(<ReviewCardField {...defaultVDProps} />);
      expect(tree.find('.update-button').length).to.equal(0);
      tree.unmount();
    });

    it('should render a dl wrapper in review mode', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        true,
        defaultVDProps,
      );
      const tree = mount(
        <ReviewCardField
          {...props}
          formContext={{ onReviewPage: true, reviewMode: true }}
        />,
      );
      expect(tree.find('dl.review').length).to.equal(1);
      tree.unmount();
    });

    it('should not render a dl wrapper in edit mode', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        true,
        defaultVDProps,
      );
      const tree = mount(
        <ReviewCardField
          {...props}
          formContext={{ onReviewPage: true, reviewMode: false }}
        />,
      );
      expect(tree.find('.review').length).to.equal(0);
      tree.unmount();
    });

    it('should add a "New X" button in review mode', () => {
      const tree = shallow(<ReviewCardField {...defaultVDProps} />);
      const editButtons = tree.find('.edit-button');
      expect(editButtons.length).to.equal(1);
      expect(editButtons.first().text()).to.equal('New Thing');
      tree.unmount();
    });

    it('should handle a custom itemName', () => {
      const props = set(
        'uiSchema.ui:options.itemName',
        'Doodad',
        defaultVDProps,
      );
      const tree = shallow(<ReviewCardField {...props} />);
      expect(tree.find('.edit-button').text()).to.equal('New Doodad');
      tree.unmount();
    });

    it('should not allow canceling if starting in edit mode', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        true,
        defaultVDProps,
      );
      const tree = shallow(<ReviewCardField {...props} />);
      expect(tree.find('.cancel-button').length).to.equal(0);
      tree.unmount();
    });

    it('should add a save & cancel button in edit mode', () => {
      const tree = shallow(<ReviewCardField {...defaultVDProps} />);
      // Start editing
      tree.find('.usa-button-primary').simulate('click');
      expect(tree.find('.update-button').length).to.equal(1);
      expect(tree.find('.cancel-button').length).to.equal(1);
      tree.unmount();
    });

    it('should handle canceling an update', () => {
      defaultVDProps.onChange.reset();
      // Start in review mode with some data
      const tree = shallow(<ReviewCardField {...defaultVDProps} />);
      // Start editing
      tree.find('.usa-button-primary').simulate('click');

      // Ideally, we'd enter some data in here, but because the onChange is a
      //  prop that's passed to the field, it wouldn't really test the actual
      //  functionality here. Instead, we'll just test that the cancel calls
      //  onChange with the original data.
      // It's not a comprehensive test.

      // Cancel update
      tree.find('.cancel-button').simulate('click');
      expect(defaultVDProps.onChange.calledWith(defaultVDProps.formData));
      tree.unmount();
    });
  });
});
