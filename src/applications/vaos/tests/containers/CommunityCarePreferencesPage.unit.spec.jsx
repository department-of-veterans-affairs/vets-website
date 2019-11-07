import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import useFormPageTester from '../useFormPageTester';

import { CommunityCarePreferencesPage } from '../../containers/CommunityCarePreferencesPage';

function CommunityCarePreferencesPageTester(props) {
  const formProps = useFormPageTester(
    props.data,
    'openCommunityCarePreferencesPage',
  );
  return <CommunityCarePreferencesPage {...props} {...formProps} />;
}

describe('VAOS <CommunityCarePreferencesPage>', () => {
  it('should render loading state', () => {
    const form = mount(
      <CommunityCarePreferencesPage
        openCommunityCarePreferencesPage={f => f}
        loading
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    form.unmount();
  });

  it('should render', () => {
    const form = mount(<CommunityCarePreferencesPageTester />);

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should render provider fields', () => {
    const form = mount(
      <CommunityCarePreferencesPageTester
        data={{ hasCommunityCareProvider: true }}
      />,
    );

    expect(form.find('input').length).to.equal(10);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <CommunityCarePreferencesPageTester
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should update data after change', () => {
    const form = mount(<CommunityCarePreferencesPageTester />);

    selectRadio(form, 'root_hasCommunityCareProvider', 'Y');

    expect(form.find('#root_hasCommunityCareProviderYes').getDOMNode().checked)
      .to.be.true;
    form.unmount();
  });

  it('should submit with valid data', () => {
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <CommunityCarePreferencesPageTester
        data={{ hasCommunityCareProvider: false, preferredLanguage: 'english' }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
