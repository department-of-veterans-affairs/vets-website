import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import useFormPageTester from '../useFormPageTester';
import { FETCH_STATUS } from '../../utils/constants';

import { CommunityCarePreferencesPage } from '../../containers/CommunityCarePreferencesPage';

function CommunityCarePreferencesPageTester(props) {
  const formProps = useFormPageTester(
    props.data,
    'openCommunityCarePreferencesPage',
  );
  return (
    <CommunityCarePreferencesPage
      {...props}
      {...formProps}
      parentFacilitiesStatus={FETCH_STATUS.succeeded}
    />
  );
}

describe('VAOS <CommunityCarePreferencesPage>', () => {
  it('should render loading state', () => {
    const form = mount(
      <CommunityCarePreferencesPage
        openCommunityCarePreferencesPage={f => f}
        parentFacilitiesStatus={FETCH_STATUS.loading}
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
        parentFacilitiesStatus={FETCH_STATUS.succeeded}
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
        parentFacilitiesStatus={FETCH_STATUS.succeeded}
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

  it('document title should match h1 text', () => {
    const form = mount(<CommunityCarePreferencesPageTester />);
    const pageTitle = 'Tell us your Community Care preferences';

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);

    form.unmount();
  });

  it('should display error msg when phone number exceeds 10 char', () => {
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <CommunityCarePreferencesPageTester
        data={{
          hasCommunityCareProvider: true,
          preferredLanguage: 'english',
          communityCareProvider: {
            practiceName: 'Practice name',
            firstName: 'Jane',
            lastName: 'Doe',
            phone: '5555555555555555555555555',
            address: {
              street: '123 Test',
              street2: 'line 2',
              city: 'Northampton',
              state: 'MA',
              postalCode: '01060',
            },
          },
        }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });
});
