import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import flow from 'lodash/flow';
import set from 'platform/utilities/data/set';
import React from 'react';
import { spy } from 'sinon';
import ReviewCardField from '../components/ReviewCardField';

const viewComponent = formData => (
  <div>
    {Object.keys(formData).map(property => (
      <p key={property}>{property}</p>
    ))}
  </div>
);

const mockStore = {
  getState: () => ({
    form: {
      data: {
        permanentAddress: {
          'view:livesOnMilitaryBaseInfo': {},
          country: 'USA',
          street: '101 Example Street',
          street2: 'Apt 2',
          city: 'Kansas City',
          state: 'MO',
          postalCode: '64117',
        },
        temporaryAddress: {
          'view:livesOnMilitaryBaseInfo': {},
          country: 'USA',
          street: '201 Example Street',
          city: 'Galveston',
          state: 'TX',
          postalCode: '77550',
        },
        'view:currentAddress': 'permanentAddress',
        formData: {
          'view:livesOnMilitaryBaseInfo': {},
          country: 'USA',
          street: '101 Example Street',
          street2: 'Apt 2',
          city: 'Kansas City',
          state: 'MO',
          postalCode: '64117',
        },
        schema: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            street2: { type: 'boolean' },
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
          street: { $id: 'street' },
          street2: { $id: 'street2' },
        },
        errorSchema: {
          street: { __errors: [] },
          street2: { __errors: [] },
        },
        formContext: {
          onError: () => {},
        },
        onChange: spy(),
        onBlur: () => {},
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const getMockData = mockStore.getState();
const mockData = getMockData.form.data;

describe("the ReviewCardField's", () => {
  describe('review mode', () => {
    it('should render', () => {
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
        />,
      );
      expect(wrapper.html()).to.contain('Thing');
      wrapper.unmount();
    });
    it('should throw an error if no viewComponent is found', () => {
      expect(() => {
        // Not necessary if not componentWillUnmount
        // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
        shallow(
          <ReviewCardField
            name="permanentAddress"
            store={mockStore}
            {...mockData}
            uiSchema={{}}
          />,
        )
          .dive()
          .dive();
      }).to.throw('viewComponent');
    });
    it('should throw an error if schema type is not object or array', () => {
      expect(() => {
        // Not necessary if not componentWillUnmount
        // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
        shallow(
          <ReviewCardField
            name="permanentAddress"
            store={mockStore}
            {...mockData}
            schema={{ type: 'string' }}
          />,
        )
          .dive()
          .dive();
      }).to.throw('Unknown schema type');
    });
    // Also tests that it renders a custom component
    it('should start in view mode', () => {
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
        />,
      )
        .dive()
        .dive();
      expect(wrapper.find('viewComponent').length).to.equal(1);
      expect(wrapper.find('.input-section').length).to.equal(0);
      wrapper.unmount();
    });
    it('should transition to edit mode', () => {
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
        />,
      )
        .dive()
        .dive();
      expect(wrapper.find('viewComponent').length).to.equal(1);

      // Start editing
      wrapper.find('.vads-c-link').simulate('click');
      expect(wrapper.find('viewComponent').length).to.equal(0);
      expect(wrapper.find('.input-section').length).to.equal(1);
      wrapper.unmount();
    });
    it('should pass formData to the custom view component', () => {
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
        />,
      )
        .dive()
        .dive();

      expect(wrapper.find('viewComponent').props().formData).to.equal(
        mockData.formData,
      );
      wrapper.unmount();
    });
    it('should render the appropriate field in reviewMode according to the data type', () => {
      const props = set('formContext.onReviewPage', true, mockData);
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('ObjectField').length).to.equal(1);
      tree.unmount();
    });

    it('should handle a custom reviewTitle', () => {
      const props = set('uiSchema.ui:options.reviewTitle', 'Thingy', mockData);
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('.review-card--title').text()).to.equal('Thingy');
      tree.unmount();
    });

    it('should handle a subtitle', () => {
      const props = flow(
        data => set('uiSchema.ui:subtitle', 'Subtitle text', data),
        data => set('uiSchema.ui:options.startInEdit', true, data),
      )(mockData);

      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('.review-card--subtitle').text()).to.equal(
        'Subtitle text',
      );
      tree.unmount();
    });

    it('should start in edit mode', () => {
      const errorSchema = {
        street: { __errors: ['Arbitrary error string here'] },
        street2: { __errors: [] },
      };
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
          errorSchema={errorSchema}
        />,
      )
        .dive()
        .dive();
      expect(wrapper.find('viewComponent').length).to.equal(0);
      expect(wrapper.find('.input-section').length).to.equal(1);
      wrapper.unmount();
    });

    it('should transition to view mode', () => {
      // Not sure how to be not duplicate an existing test here
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
        />,
      )
        .dive()
        .dive();
      expect(wrapper.find('viewComponent').length).to.equal(1);

      // Start editing
      wrapper.find('.vads-c-link').simulate('click');
      expect(wrapper.find('viewComponent').length).to.equal(0);
      expect(wrapper.find('.input-section').length).to.equal(1);

      // Go back to viewing
      wrapper.find('.update-button').simulate('click');
      expect(wrapper.find('.input-section').length).to.equal(0);
      expect(wrapper.find('viewComponent').length).to.equal(1);
      wrapper.unmount();
    });

    it('should not transition to view mode if there are validation errors', () => {
      // Start with errors
      const errorSchema = {
        street: { __errors: ['Arbitrary error string here'] },
        street2: { __errors: [] },
      };
      const wrapper = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...mockData}
          errorSchema={errorSchema}
        />,
      )
        .dive()
        .dive();
      expect(wrapper.find('viewComponent').length).to.equal(0);
      expect(wrapper.find('.input-section').length).to.equal(1);

      // Try to go back to viewing
      wrapper.find('.update-button').simulate('click');
      expect(wrapper.find('.input-section').length).to.equal(1);
      expect(wrapper.find('viewComponent').length).to.equal(0);

      // Also check that the validation error is rendered while we're at it
      expect(wrapper.html()).to.contain('Arbitrary error string here');
      wrapper.unmount();
    });
  });

  describe('edit mode', () => {
    it('should handle truthy values', () => {
      const props = set('uiSchema.ui:options.startInEdit', true, mockData);
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('.input-section').length).to.equal(1);
      tree.unmount();
    });

    it('should handle falsey values', () => {
      const props = set('uiSchema.ui:options.startInEdit', false, mockData);
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      );
      expect(tree.find('.input-section').length).to.equal(0);
      tree.unmount();
    });

    it('should handle functions', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        formData => formData.street === '101 Example Street',
        mockData,
      );
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('.input-section').length).to.equal(1);
      tree.unmount();
    });
    it('should handle a custom editTitle', () => {
      const editModeProps = set(
        'uiSchema.ui:options.startInEdit',
        true,
        mockData,
      );
      const props = set(
        'uiSchema.ui:options.editTitle',
        'Thingy',
        editModeProps,
      );
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('.review-card--edit-title').text()).to.equal(
        'Edit thingy',
      );
      tree.unmount();
    });
  });

  describe('volatileData features', () => {
    const defaultVDProps = set(
      'uiSchema.ui:options.volatileData',
      true,
      mockData,
    );

    it('should remove the edit button from the header in review mode', () => {
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...defaultVDProps}
        />,
      );
      expect(tree.find('.review-card--header .edit-button').length).to.equal(0);
      tree.unmount();
    });

    it('should remove the save button in review mode', () => {
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...defaultVDProps}
        />,
      );
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
          name="permanentAddress"
          store={mockStore}
          {...props}
          formContext={{ onReviewPage: true, reviewMode: true }}
        />,
      );
      expect(tree.find('.review').length).to.equal(1);
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
          name="permanentAddress"
          store={mockStore}
          {...props}
          formContext={{ onReviewPage: true, reviewMode: false }}
        />,
      );
      expect(tree.find('.review').length).to.equal(0);
      tree.unmount();
    });

    it('should add a "New X" button in review mode', () => {
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...defaultVDProps}
        />,
      )
        .dive()
        .dive();
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
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      )
        .dive()
        .dive();
      expect(tree.find('.edit-button').text()).to.equal('New Doodad');
      tree.unmount();
    });

    it('should not allow canceling if starting in edit mode', () => {
      const props = set(
        'uiSchema.ui:options.startInEdit',
        true,
        defaultVDProps,
      );
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...props}
        />,
      );
      expect(tree.find('.cancel-button').length).to.equal(0);
      tree.unmount();
    });

    it('should add a save & cancel button in edit mode', () => {
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...defaultVDProps}
        />,
      )
        .dive()
        .dive();
      // Start editing
      tree.find('.usa-button-primary').simulate('click');
      expect(tree.find('.update-button').length).to.equal(1);
      expect(tree.find('.cancel-button').length).to.equal(1);
      tree.unmount();
    });

    it('should handle canceling an update', () => {
      defaultVDProps.onChange.reset();
      // Start in review mode with some data
      const tree = shallow(
        <ReviewCardField
          name="permanentAddress"
          store={mockStore}
          {...defaultVDProps}
        />,
      )
        .dive()
        .dive();
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
