import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import useFormPageTester from '../useFormPageTester';

import { CommunityCareProviderPage } from '../../containers/CommunityCareProviderPage';

function CommunityCareProviderPageTester(props) {
  const formProps = useFormPageTester(props.data);
  return <CommunityCareProviderPage {...props} {...formProps} />;
}

describe('VAOS <CommunityCareProviderPage>', () => {
  it('should render', () => {
    const form = mount(<CommunityCareProviderPageTester />);

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should render provider fields', () => {
    const form = mount(
      <CommunityCareProviderPageTester
        data={{ hasCommunityCareProvider: true }}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <CommunityCareProviderPageTester
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should update data after change', () => {
    const form = mount(<CommunityCareProviderPageTester />);

    selectRadio(form, 'root_hasCommunityCareProvider', 'Y');

    expect(form.find('#root_hasCommunityCareProviderYes').getDOMNode().checked)
      .to.be.true;
    form.unmount();
  });

  it('should submit with valid data', () => {
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <CommunityCareProviderPageTester
        data={{ hasCommunityCareProvider: false }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
