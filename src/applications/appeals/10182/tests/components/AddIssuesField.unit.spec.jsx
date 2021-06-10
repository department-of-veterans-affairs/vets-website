import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { AddIssuesField } from '../../components/AddIssuesField';
import additionalIssues from '../../pages/additionalIssues';
import { MAX_NEW_CONDITIONS } from '../../constants';
import { getDate } from '../../utils/dates';

const { items } = additionalIssues.schema.properties.additionalIssues;

const getProps = ({
  onChange = () => {},
  formData = [{}],
  errorSchema = [],
  touched = {},
  onReviewPage,
  reviewMode,
} = {}) => ({
  schema: {
    type: 'array',
    maxItems: 100,
    additionalItems: items,
    items: formData.map(() => items),
  },
  uiSchema: additionalIssues.uiSchema.additionalIssues,
  errorSchema,
  idSchema: { $id: 'additionalIssues' },
  formData,
  fullFormData: {
    'view:hasIssuesToAdd': true,
  },
  registry: {
    definitions: {},
    fields: {
      TitleField: f => f,
      SchemaField: () => <p />,
    },
  },
  formContext: {
    setTouched: f => f,
    touched,
    onReviewPage,
    reviewMode,
  },
  onBlur: f => f,
  onChange,
  setFormData: () => {},
});

describe('<AddIssuesField>', () => {
  const validDate = getDate({ offset: { months: -2 } });
  it('should render wrapper & add button', () => {
    const wrapper = shallow(<AddIssuesField {...getProps()} />);
    expect(wrapper.find('.additional-issues-wrap').length).to.equal(1);
    // add button not visible while editing
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(0);
    wrapper.unmount();
  });
  it('should render item cards', () => {
    const formData = [
      { issue: 'test', decisionDate: validDate },
      { issue: 'test2', decisionDate: validDate },
    ];
    const wrapper = mount(<AddIssuesField {...getProps({ formData })} />);

    expect(wrapper.find('.widget-outline').length).to.equal(2);
    expect(wrapper.find('button.edit').length).to.equal(2);
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render edit mode with update & remove button', () => {
    const formData = [{ issue: '' }];
    const wrapper = mount(<AddIssuesField {...getProps({ formData })} />);

    expect(wrapper.find('.editing fieldset').length).to.equal(1);
    expect(wrapper.find('.schemaform-field-container').length).to.equal(1);
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(0);
    expect(wrapper.find('button.update').length).to.equal(1);
    // no remove button when editing the only issue
    expect(wrapper.find('button.remove').length).to.equal(0);
    wrapper.unmount();
  });
  it('should render 2 item cards with one in edit mode', () => {
    const formData = [{ issue: 'test2', decisionDate: validDate }, {}];
    const wrapper = mount(<AddIssuesField {...getProps({ formData })} />);

    expect(wrapper.find('.widget-outline').length).to.equal(1); // card
    expect(wrapper.find('.editing').length).to.equal(1); // edit
    expect(wrapper.find('button.update').length).to.equal(1);
    expect(wrapper.find('button.remove').length).to.equal(1);
    // add button not visible while editing
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(0);
    wrapper.unmount();
  });

  describe('should handle', () => {
    it('edit', () => {
      const formData = [{ issue: 'test2', decisionDate: validDate }];
      const wrapper = mount(<AddIssuesField {...getProps({ formData })} />);

      expect(wrapper.find('.widget-outline').length).to.equal(1);
      wrapper.find('.edit').simulate('click');

      expect(wrapper.find('.widget-outline').length).to.equal(0);
      expect(wrapper.find('.editing').length).to.equal(1);
      wrapper.unmount();
    });
    it('update when valid', () => {
      const formData = [{ issue: 'test2', decisionDate: validDate }];
      const wrapper = mount(<AddIssuesField {...getProps({ formData })} />);

      expect(wrapper.find('.widget-outline').length).to.equal(1);
      expect(wrapper.find('.editing').length).to.equal(0);

      wrapper.find('.edit').simulate('click');
      expect(wrapper.find('.widget-outline').length).to.equal(0);
      expect(wrapper.find('.editing').length).to.equal(1);

      wrapper.find('.update').simulate('click');
      expect(wrapper.find('.widget-outline').length).to.equal(1);
      expect(wrapper.find('.editing').length).to.equal(0);
      wrapper.unmount();
    });
    it('update when invalid (prevent saving)', () => {
      const formData = [{ issue: '', decisionDate: '' }];
      const wrapper = shallow(<AddIssuesField {...getProps({ formData })} />);

      expect(wrapper.find('.editing').length).to.equal(1);
      expect(wrapper.find('.widget-outline').length).to.equal(0);

      wrapper.simulate('submit');
      expect(wrapper.find('.editing').length).to.equal(1);
      expect(wrapper.find('.widget-outline').length).to.equal(0);
      wrapper.unmount();
    });
    it('remove', () => {
      const onChange = sinon.spy();
      // Remove button hidden with only one entry, so add 2
      const props = getProps({ formData: [{}, {}], onChange });
      const wrapper = mount(<AddIssuesField {...props} />);

      expect(wrapper.find('.widget-outline').length).to.equal(0);
      expect(wrapper.find('.editing').length).to.equal(2);

      wrapper
        .find('.remove')
        .first()
        .simulate('click');
      expect(onChange.called).to.be.true;
      // one issue removed, one left
      expect(onChange.firstCall.args[0].length).to.equal(1);
      wrapper.unmount();
    });

    it('add', () => {
      const onChange = sinon.spy();
      const props = getProps({
        formData: [{ issue: 'test', decisionDate: validDate }],
        onChange,
      });
      const wrapper = mount(<AddIssuesField {...props} />);

      expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
      expect(wrapper.find('.editing').length).to.equal(0);
      expect(wrapper.find('.widget-outline').length).to.equal(1);

      wrapper.find('.va-growable-add-btn').simulate('click');
      expect(onChange.called).to.be.true;
      const formData = onChange.firstCall.args[0];
      expect(formData.length).to.equal(2);
      expect(formData).to.deep.equal([
        {
          issue: 'test',
          decisionDate: validDate,
        },
        {
          issue: undefined,
          decisionDate: undefined,
        },
      ]);
      wrapper.unmount();
    });
    it('max conditions by hiding the add button', () => {
      const onChange = sinon.spy();
      const props = getProps({
        formData: new Array(MAX_NEW_CONDITIONS + 2).fill({
          issue: 'x',
          decisionDate: validDate,
        }),
        onChange,
      });
      const wrapper = mount(<AddIssuesField {...props} />);

      expect(wrapper.find('.va-growable-add-btn').length).to.equal(0);
      expect(wrapper.find('.editing').length).to.equal(0);
      expect(wrapper.find('.widget-outline').length).to.equal(
        MAX_NEW_CONDITIONS + 2,
      );
      wrapper.unmount();
    });
  });
  it('should set view additional issues flag when visible', () => {
    const setFormData = sinon.spy();
    const wrapper = shallow(
      <AddIssuesField
        {...getProps()}
        setFormData={setFormData}
        fullFormData={{}}
      />,
    );
    expect(setFormData.called).to.be.true;
    expect(setFormData.args[0][0]['view:hasIssuesToAdd']).to.be.true;
    wrapper.unmount();
  });
});
