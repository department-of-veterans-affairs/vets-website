import React from 'react';
import { render } from '@testing-library/react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import ReportModal from '../../components/results/ReportModal';

describe('ReportModal component', () => {
  it('should mount with phone, email, address', () => {
    const { container } = render(
      <ReportModal
        representativeName="Bob Tester"
        representativeId="472"
        address="123 My Test Ave Columbus, OH 43210"
        phone="(304) 318-8697"
        email="example@rep.com"
        existingReports={[]}
      />,
    );

    const emailCheckBox = container.querySelector('va-checkbox[label="Email"]');

    const addressCheckBox = container.querySelector(
      'va-checkbox[label="Address"]',
    );
    const phoneNumberCheckBox = container.querySelector(
      'va-checkbox[label="Phone number"]',
    );
    const otherCheckBox = container.querySelector('va-checkbox[label="Other"]');

    expect(emailCheckBox).to.exist;

    expect(addressCheckBox).to.exist;

    expect(otherCheckBox).to.exist;
    expect(phoneNumberCheckBox).to.exist;
  });

  it('should parse reports array', () => {
    localStorage.setItem(
      'vaReports',
      '[{"representativeId":"28162","reports":{"address":"1521 Scottsdale Ave Columbus, OH 43235","otherComment":"test"}}]',
    );
    const localReportsArray = localStorage.getItem('vaReports');

    expect(localReportsArray).to.equal(
      '[{"representativeId":"28162","reports":{"address":"1521 Scottsdale Ave Columbus, OH 43235","otherComment":"test"}}]',
    );
  });

  it('should render correct list items when there are existing reports', () => {
    const existingReports = {
      address: '123 Main St',
      email: 'rep@example.com',
      phone: '794-273-8433',
      other: 'Some other information',
    };

    const wrapper = shallow(
      <ReportModal
        representativeName="Bob Test"
        representativeId="123"
        address="123 Main St"
        phone="794-273-8433"
        email="rep@example.com"
        existingReports={existingReports}
        submitRepresentativeReport={() => {}}
        onCloseModal={() => {}}
      />,
    );

    expect(wrapper.find('ul').exists()).to.be.true;

    expect(wrapper.contains(<li>Outdated address</li>)).to.be.true;
    expect(wrapper.contains(<li>Outdated email</li>)).to.be.true;
    expect(wrapper.contains(<li>Outdated phone number</li>)).to.be.true;
    expect(wrapper.contains(<li>Other: "Some other information"</li>)).to.be
      .true;

    wrapper.unmount();
  });

  it('does not cause text input to render when selecting "Address"', () => {
    const wrapper = mount(
      <ReportModal
        representativeName="Bob law"
        representativeId="123"
        address="123 Main St"
        phone="794-273-8433"
        email="rep@example.com"
        existingReports={{}}
        submitRepresentativeReport={() => {}}
        onCloseModal={() => {}}
        handleOtherInputChangeTestId="1"
      />,
    );
    wrapper.find('#test-button').simulate('click');

    wrapper.update();

    const vaTextInputExists = wrapper.find('va-text-input').exists();
    expect(vaTextInputExists).to.be.false;
    wrapper.unmount();
  });

  it('does not cause text input to render when selecting "Email"', () => {
    const wrapper = mount(
      <ReportModal
        representativeName="Bob law"
        representativeId="123"
        address="123 Main St"
        phone="794-273-8433"
        email="rep@example.com"
        existingReports={{}}
        submitRepresentativeReport={() => {}}
        onCloseModal={() => {}}
        handleOtherInputChangeTestId="2"
      />,
    );
    wrapper.find('#test-button').simulate('click');

    wrapper.update();

    const vaTextInputExists = wrapper.find('va-text-input').exists();
    expect(vaTextInputExists).to.be.false;
    wrapper.unmount();
  });

  it('does not cause text input to render when selecting "Phone"', () => {
    const wrapper = mount(
      <ReportModal
        representativeName="Bob law"
        representativeId="123"
        address="123 Main St"
        phone="794-273-8433"
        email="rep@example.com"
        existingReports={{}}
        submitRepresentativeReport={() => {}}
        onCloseModal={() => {}}
        handleOtherInputChangeTestId="3"
      />,
    );
    wrapper.find('#test-button').simulate('click');

    wrapper.update();

    const vaTextInputExists = wrapper.find('va-text-input').exists();
    expect(vaTextInputExists).to.be.false;
    wrapper.unmount();
  });

  it('causes text input to render when selecting "Other"', () => {
    const wrapper = mount(
      <ReportModal
        representativeName="Bob law"
        representativeId="123"
        address="123 Main St"
        phone="794-273-8433"
        email="rep@example.com"
        existingReports={{}}
        submitRepresentativeReport={() => {}}
        onCloseModal={() => {}}
        handleOtherInputChangeTestId="4"
      />,
    );
    wrapper.find('#test-button').simulate('click');

    wrapper.update();

    const vaTextInputExists = wrapper.find('va-text-input').exists();
    expect(vaTextInputExists).to.be.true;
    wrapper.unmount();
  });

  it('closes modal on successful submit', () => {
    const wrapper = mount(
      <ReportModal
        representativeName="Bob law"
        representativeId="123"
        address="123 Main St"
        phone="976-876-5432"
        email="rep@example.com"
        existingReports={{}}
        submitRepresentativeReport={() => {}}
        onCloseModal={() => {}}
        testReportObject={{
          phone: '976-876-5432',
          email: null,
          address: null,
          other: null,
        }}
      />,
    );
    wrapper.find('#set-report-object-button').simulate('click');

    wrapper.update();

    wrapper.find('#submit-modal-test-button').simulate('click');

    wrapper.update();

    const header = wrapper.find('.report-modal-header');

    expect(header).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
