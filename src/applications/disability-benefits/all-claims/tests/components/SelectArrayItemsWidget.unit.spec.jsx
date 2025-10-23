import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import get from 'platform/utilities/data/get';

import { SelectArrayItemsWidget } from '../../components/SelectArrayItemsWidget';

describe('<SelectArrayItemsWidget>', () => {
  let defaultProps = {};
  const onChangeSpy = sinon.spy();
  const selectedPropName = 'selected'; // Different from default to test that it uses this option
  const labelElement = props => (
    <div>
      {Object.keys(props).map(key => (
        <p key={key} id={key}>
          {key}: {props[key]}
        </p>
      ))}
    </div>
  );

  beforeEach(() => {
    // Reset default props before each test
    onChangeSpy.reset();
    defaultProps = {
      value: [
        {
          name: 'item one',
          propTwo: 'asdf',
          className: 'vads-u-display--inline',
        },
        {
          name: 'item two',
          className: 'vads-u-display--inline',
        },
      ],
      id: 'id',
      onChange: onChangeSpy,
      options: {
        label: labelElement,
        selectedPropName,
        customTitle: 'Custom title',
      },
      formContext: {
        onReviewPage: true,
        reviewMode: false,
      },
    };
  });

  it('should render a list of check boxes', () => {
    const wrapper = shallow(<SelectArrayItemsWidget {...defaultProps} />);
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(
      defaultProps.value.length,
    );
    wrapper.unmount();
  });

  it('should render a custom label component for the checkboxes', () => {
    const wrapper = shallow(<SelectArrayItemsWidget {...defaultProps} />);
    expect(wrapper.find('fieldset').length).to.equal(1);
    expect(wrapper.find('legend').text()).to.equal('Custom title');
    expect(wrapper.find('labelElement').length).to.equal(
      defaultProps.value.length,
    );
    wrapper.unmount();
  });

  it('should not wrap the checkboxes in a fieldset', () => {
    const props = {
      ...defaultProps,
      options: {
        label: labelElement,
        selectedPropName,
        // title is trimmed of whitespace, making this the same as undefined
        customTitle: ' ',
      },
    };
    const wrapper = shallow(<SelectArrayItemsWidget {...props} />);
    expect(wrapper.find('fieldset').length).to.equal(0);
    expect(wrapper.find('labelElement').length).to.equal(
      defaultProps.value.length,
    );
    wrapper.unmount();
  });

  it('should pass the custom label the form data for that item', () => {
    const wrapper = shallow(<SelectArrayItemsWidget {...defaultProps} />);
    wrapper.find('labelElement').forEach((element, index) => {
      expect(element.props()).to.eql(defaultProps.value[index]);
    });
    wrapper.unmount();
  });

  it('should call onChange with the toggled the selected property when the checkbox is toggled', () => {
    const wrapper = mount(<SelectArrayItemsWidget {...defaultProps} />);
    wrapper.find('.form-checkbox').forEach((element, index) => {
      onChangeSpy.reset();

      // Grab the default "checked" state
      // Note: Using `get` because that's what the widget uses
      const initiallySelected = get(selectedPropName, element.props());

      // "Click" the option
      // .simulate('click') wasn't calling the onChange handler for some reason
      element
        .find('input')
        .first()
        .props()
        .onChange({ target: { checked: !initiallySelected } });

      // Check that it changed
      expect(onChangeSpy.callCount).to.equal(1);
      expect(onChangeSpy.firstCall.args[0][index]).to.eql({
        ...defaultProps.value[index],
        selected: !initiallySelected,
      });

      // "Click" the option
      element
        .find('input')
        .first()
        .props()
        .onChange({ target: { checked: !!initiallySelected } });

      // Check that it changed back
      // Note: Because we're not actually re-rendering, it doesn't exactly "change back," but it's probably
      //  a close enough approximation to not worry about it.
      expect(onChangeSpy.callCount).to.equal(2);
      expect(onChangeSpy.secondCall.args[0][index]).to.eql({
        ...defaultProps.value[index],
        selected: !!initiallySelected,
      });
    });
    wrapper.unmount();
  });

  it('should update to an empty list of rated disabilities', () => {
    const autoSaveFormSpy = sinon.spy();
    const setDataSpy = sinon.spy();
    const initialProps = {
      value: [
        {
          name: 'item one',
          ratingDecisionId: '123',
          diagnosticCode: 987,
          ratingPercentage: 20,
        },
      ],
      testUpdatedRatedDisabilities: true,
      formData: {
        updatedRatedDisabilities: [{}],
      },
      formId: '526',
      id: 'id',
      onChange: onChangeSpy,
      options: {
        label: labelElement,
        selectedPropName,
        customTitle: 'Custom title',
      },
      formContext: {
        onReviewPage: true,
        reviewMode: false,
      },
      autoSaveForm: autoSaveFormSpy,
      setData: setDataSpy,
      metadata: {
        version: 99,
        returnUrl: '/test',
        submission: { test: 123 },
      },
    };
    const wrapper = shallow(<SelectArrayItemsWidget {...initialProps} />);
    expect(autoSaveFormSpy.firstCall.args[0]).to.eql('526');
    expect(autoSaveFormSpy.firstCall.args[1]).to.deep.equal({
      ratedDisabilities: [
        { disabilityActionType: 'NONE', 'view:selected': false },
      ],
    });
    expect(autoSaveFormSpy.firstCall.args[2]).to.eql(99);
    expect(autoSaveFormSpy.firstCall.args[3]).to.eql('/test');
    expect(autoSaveFormSpy.firstCall.args[4]).to.deep.equal({ test: 123 });
    wrapper.unmount();
  });
  it('should update the selected disabilites with new info', () => {
    const autoSaveFormSpy = sinon.spy();
    const setDataSpy = sinon.spy();
    const initialProps = {
      value: [
        {
          name: 'item one',
          ratingDecisionId: '123',
          diagnosticCode: 987,
          ratingPercentage: 20,
          disabilityActionType: 'NONE',
        },
        {
          name: 'item two',
          ratingDecisionId: '345',
          diagnosticCode: 765,
          ratingPercentage: 30,
          disabilityActionType: 'WORSENED',
          'view:selected': true,
        },
        {
          name: 'item three',
          ratingDecisionId: '567',
          diagnosticCode: 543,
          ratingPercentage: 10,
          'view:selected': true,
        },
      ],
      testUpdatedRatedDisabilities: true,
      formData: {
        updatedRatedDisabilities: [
          {
            name: 'item 2',
            ratingDecisionId: '345',
            diagnosticCode: 765,
            ratingPercentage: 32,
          },
          {
            name: 'item 3',
            ratingDecisionId: '567',
            diagnosticCode: 543,
            ratingPercentage: 22,
          },
          {
            name: 'item 4',
            ratingDecisionId: '789',
            diagnosticCode: 321,
            ratingPercentage: 5,
          },
        ],
      },
      formId: '526',
      id: 'id',
      onChange: onChangeSpy,
      options: {
        label: labelElement,
        selectedPropName,
        customTitle: 'Custom title',
      },
      formContext: {
        onReviewPage: true,
        reviewMode: false,
      },
      autoSaveForm: autoSaveFormSpy,
      setData: setDataSpy,
      metadata: {
        version: 99,
        returnUrl: '/test',
        submission: { test: 123 },
      },
    };
    const wrapper = shallow(<SelectArrayItemsWidget {...initialProps} />);
    expect(autoSaveFormSpy.firstCall.args[0]).to.eql('526');
    expect(autoSaveFormSpy.firstCall.args[1]).to.deep.equal({
      ratedDisabilities: [
        {
          name: 'item 2',
          ratingDecisionId: '345',
          diagnosticCode: 765,
          ratingPercentage: 32,
          disabilityActionType: 'WORSENED',
          'view:selected': true,
        },
        {
          name: 'item 3',
          ratingDecisionId: '567',
          diagnosticCode: 543,
          ratingPercentage: 22,
          disabilityActionType: 'INCREASE',
          'view:selected': true,
        },
        {
          name: 'item 4',
          ratingDecisionId: '789',
          diagnosticCode: 321,
          disabilityActionType: 'NONE',
          ratingPercentage: 5,
          'view:selected': false,
        },
      ],
    });
    expect(autoSaveFormSpy.firstCall.args[2]).to.eql(99);
    expect(autoSaveFormSpy.firstCall.args[3]).to.eql('/test');
    expect(autoSaveFormSpy.firstCall.args[4]).to.deep.equal({ test: 123 });
    wrapper.unmount();
  });
  it('should update from an empty list of rated disabilites to new info', () => {
    const autoSaveFormSpy = sinon.spy();
    const setDataSpy = sinon.spy();
    const initialProps = {
      value: [],
      testUpdatedRatedDisabilities: true,
      formData: {
        updatedRatedDisabilities: [
          {
            name: 'item one',
            ratingDecisionId: '123',
            diagnosticCode: 987,
            ratingPercentage: 20,
          },
          {
            name: 'item two',
            ratingDecisionId: '345',
            diagnosticCode: 765,
            ratingPercentage: 30,
          },
          {
            name: 'item three',
            ratingDecisionId: '567',
            diagnosticCode: 543,
            ratingPercentage: 10,
          },
        ],
      },
      formId: '526',
      id: 'id',
      onChange: onChangeSpy,
      options: {
        label: labelElement,
        selectedPropName,
        customTitle: 'Custom title',
      },
      formContext: {
        onReviewPage: true,
        reviewMode: false,
      },
      autoSaveForm: autoSaveFormSpy,
      setData: setDataSpy,
      metadata: {
        version: 99,
        returnUrl: '/test',
        submission: { test: 123 },
      },
    };
    const wrapper = shallow(<SelectArrayItemsWidget {...initialProps} />);
    expect(autoSaveFormSpy.firstCall.args[0]).to.eql('526');
    expect(autoSaveFormSpy.firstCall.args[1]).to.deep.equal({
      ratedDisabilities: [
        {
          name: 'item one',
          ratingDecisionId: '123',
          diagnosticCode: 987,
          ratingPercentage: 20,
          disabilityActionType: 'NONE',
          'view:selected': false,
        },
        {
          name: 'item two',
          ratingDecisionId: '345',
          diagnosticCode: 765,
          ratingPercentage: 30,
          disabilityActionType: 'NONE',
          'view:selected': false,
        },
        {
          name: 'item three',
          ratingDecisionId: '567',
          diagnosticCode: 543,
          ratingPercentage: 10,
          disabilityActionType: 'NONE',
          'view:selected': false,
        },
      ],
    });
    expect(autoSaveFormSpy.firstCall.args[2]).to.eql(99);
    expect(autoSaveFormSpy.firstCall.args[3]).to.eql('/test');
    expect(autoSaveFormSpy.firstCall.args[4]).to.deep.equal({ test: 123 });
    wrapper.unmount();
  });
});
