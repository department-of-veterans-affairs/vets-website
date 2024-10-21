import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import CustomGroupCheckboxField from '../../components/CustomGroupCheckboxField';

const props = {
  uiSchema: {
    'ui:options': {
      labels: ['Label 1', 'Label 2'],
    },
  },
  idSchema: {
    $id: '',
  },
  formData: [],
};

const invalidProps = {
  uiSchema: { 'ui:options': null },
  idSchema: null,
  formData: null,
};

describe('<CustomGroupCheckboxField>', () => {
  it('should render with invalid props', () => {
    const wrapper = shallow(<CustomGroupCheckboxField {...invalidProps} />);
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });
  it('should render with props', () => {
    const wrapper = shallow(<CustomGroupCheckboxField {...props} />);
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should call onChange with checked', async () => {
    const onChange = sinon.spy();

    const { container } = render(
      <CustomGroupCheckboxField {...props} onChange={onChange} />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, name: 'Label 1' },
    });
    expect(onChange.called).to.be.true;
  });

  it('should call onChange with unchecked', async () => {
    const onChange = sinon.spy();

    const { container } = render(
      <CustomGroupCheckboxField
        {...props}
        formData={['Label 1']}
        onChange={onChange}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: false, name: 'Label 1' },
    });

    expect(onChange.called).to.be.true;
  });
});
