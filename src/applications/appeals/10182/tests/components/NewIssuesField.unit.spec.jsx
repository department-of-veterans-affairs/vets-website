import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import NewIssuesField from '../../components/NewIssuesField';
import contestableIssues from '../../pages/contestableIssues';
import { MAX_NEW_CONDITIONS } from '../../constants';

const { items } = contestableIssues.schema.properties.additionalIssues;

const getProps = ({
  onChange = () => {},
  formData = [],
  errorSchema = [],
  touched = {},
} = {}) => ({
  schema: {
    type: 'array',
    maxItems: 100,
    additionalItems: items,
    items: formData.map(() => items),
  },
  uiSchema: contestableIssues.uiSchema.additionalIssues,
  errorSchema,
  idSchema: { $id: 'additionalIssues' },
  formData,
  registry: {
    definitions: {},
    fields: {
      TitleField: f => f,
      SchemaField: () => <p />,
    },
  },
  formContext: { setTouched: f => f, touched },
  onBlur: f => f,
  onChange,
});

describe('<NewIssuesField>', () => {
  it('should render wrapper & add button', () => {
    const wrapper = shallow(<NewIssuesField {...getProps()} />);
    expect(wrapper.find('.additional-issues-wrap').length).to.equal(1);
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
    wrapper.unmount();
  });
  it('should render item cards', () => {
    const formData = [
      { issue: 'test', decisionDate: '2020-01-01' },
      { issue: 'test2', decisionDate: '2020-01-02' },
    ];
    const wrapper = mount(<NewIssuesField {...getProps({ formData })} />);

    expect(wrapper.find('.widget-outline').length).to.equal(2);
    expect(wrapper.find('button.edit').length).to.equal(2);
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render 2 item cards with one in edit mode', () => {
    const formData = [
      { issue: 'test2', decisionDate: '2020-01-01' },
      { issue: '' },
    ];
    const wrapper = mount(<NewIssuesField {...getProps({ formData })} />);

    expect(wrapper.find('.widget-outline').length).to.equal(1); // card
    expect(wrapper.find('.additional-issues').length).to.equal(1); // edit
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
    wrapper.unmount();
  });
  it('should render edit mode with update & remove button', () => {
    const formData = [{ issue: '' }];
    const wrapper = mount(<NewIssuesField {...getProps({ formData })} />);

    expect(wrapper.find('fieldset.additional-issues').length).to.equal(1);
    expect(wrapper.find('.schemaform-field-container').length).to.equal(1);
    expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
    expect(wrapper.find('button.update').length).to.equal(1);
    expect(wrapper.find('button.remove').length).to.equal(1);
    wrapper.unmount();
  });

  describe('should handle', () => {
    it('edit', () => {
      const formData = [{ issue: 'test2', decisionDate: '2020-01-01' }];
      const wrapper = mount(<NewIssuesField {...getProps({ formData })} />);

      expect(wrapper.find('.widget-outline').length).to.equal(1);
      wrapper.find('.edit').simulate('click');

      expect(wrapper.find('.widget-outline').length).to.equal(0);
      expect(wrapper.find('.additional-issues').length).to.equal(1);
      wrapper.unmount();
    });
    it('update when valid', () => {
      const formData = [{ issue: 'test2', decisionDate: '2020-01-01' }];
      const wrapper = mount(<NewIssuesField {...getProps({ formData })} />);

      expect(wrapper.find('.widget-outline').length).to.equal(1);
      expect(wrapper.find('.additional-issues').length).to.equal(0);

      wrapper.find('.edit').simulate('click');
      expect(wrapper.find('.widget-outline').length).to.equal(0);
      expect(wrapper.find('.additional-issues').length).to.equal(1);

      wrapper.find('.update').simulate('click');
      expect(wrapper.find('.widget-outline').length).to.equal(1);
      expect(wrapper.find('.additional-issues').length).to.equal(0);
      wrapper.unmount();
    });
    it('update when invalid (prevent saving)', () => {
      const formData = [{ issue: '', decisionDate: '' }];
      const wrapper = shallow(<NewIssuesField {...getProps({ formData })} />);

      expect(wrapper.find('.additional-issues').length).to.equal(1);
      expect(wrapper.find('.widget-outline').length).to.equal(0);

      wrapper.simulate('submit');
      expect(wrapper.find('.additional-issues').length).to.equal(1);
      expect(wrapper.find('.widget-outline').length).to.equal(0);
      wrapper.unmount();
    });
    it('remove', () => {
      const onChange = sinon.spy();
      const props = getProps({ formData: [{}], onChange });
      const wrapper = mount(<NewIssuesField {...props} />);

      expect(wrapper.find('.widget-outline').length).to.equal(0);
      expect(wrapper.find('.additional-issues').length).to.equal(1);

      wrapper.find('.remove').simulate('click');
      expect(onChange.called).to.be.true;
      expect(onChange.firstCall.args[0].length).to.equal(0);
      wrapper.unmount();
    });

    it('add', () => {
      const onChange = sinon.spy();
      const props = getProps({ formData: [], onChange });
      const wrapper = mount(<NewIssuesField {...props} />);

      expect(wrapper.find('.va-growable-add-btn').length).to.equal(1);
      expect(wrapper.find('.additional-issues').length).to.equal(0);
      expect(wrapper.find('.widget-outline').length).to.equal(0);

      wrapper.find('.va-growable-add-btn').simulate('click');
      expect(onChange.called).to.be.true;
      const formData = onChange.firstCall.args[0];
      expect(formData.length).to.equal(1);
      expect(formData[0]).to.deep.equal({
        issue: undefined,
        decisionDate: undefined,
      });
      wrapper.unmount();
    });
    it('max conditions by hiding the add button', () => {
      const onChange = sinon.spy();
      const props = getProps({
        formData: new Array(MAX_NEW_CONDITIONS + 2).fill({
          issue: 'x',
          decisionDate: '2020-01-01',
        }),
        onChange,
      });
      const wrapper = mount(<NewIssuesField {...props} />);

      expect(wrapper.find('.va-growable-add-btn').length).to.equal(0);
      expect(wrapper.find('.additional-issues').length).to.equal(0);
      expect(wrapper.find('.widget-outline').length).to.equal(
        MAX_NEW_CONDITIONS + 2,
      );
      wrapper.unmount();
    });
  });
});
