import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import PrivateRecordsAuthorization from '../../components/Authorization';

describe('PrivateRecordsAuthorization', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      data: {
        patient4142Acknowledgement: false,
      },
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      setFormData: sinon.spy(),
      updatePage: sinon.spy(),
      onReviewPage: false,
    };
  });

  describe('component rendering', () => {
    it('should render without crashing', () => {
      const wrapper = shallow(
        <PrivateRecordsAuthorization {...defaultProps} />,
      );
      expect(wrapper.exists()).to.be.true;
      wrapper.unmount();
    });

    it('should render the main heading', () => {
      const wrapper = shallow(
        <PrivateRecordsAuthorization {...defaultProps} />,
      );
      const heading = wrapper.find('h3').first();
      expect(heading.text()).to.equal(
        'Authorize the release of non-VA medical records to VA',
      );
      wrapper.unmount();
    });

    it('should render the authorization checkbox', () => {
      const wrapper = shallow(
        <PrivateRecordsAuthorization {...defaultProps} />,
      );
      const checkbox = wrapper.find('[id="privacy-agreement"]');
      expect(checkbox).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should render the privacy modal', () => {
      const wrapper = shallow(
        <PrivateRecordsAuthorization {...defaultProps} />,
      );
      const modal = wrapper.find('[modalTitle="Privacy Act Statement"]');
      expect(modal).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should render all accordion sections', () => {
      const wrapper = shallow(
        <PrivateRecordsAuthorization {...defaultProps} />,
      );
      const accordionItems = wrapper.find('va-accordion-item');
      expect(accordionItems).to.have.lengthOf(5);
      wrapper.unmount();
    });
  });

  describe('checkbox interactions', () => {
    it('should update form data when checkbox is checked', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      // Simulate the VA checkbox change event
      checkbox.prop('onVaChange')({ target: { checked: true } });

      expect(defaultProps.setFormData.calledOnce).to.be.true;
      expect(
        defaultProps.setFormData.calledWith({
          ...defaultProps.data,
          patient4142Acknowledgement: true,
        }),
      ).to.be.true;
      wrapper.unmount();
    });

    it('should update form data when checkbox is unchecked', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      checkbox.prop('onVaChange')({ target: { checked: false } });

      expect(defaultProps.setFormData.calledOnce).to.be.true;
      expect(
        defaultProps.setFormData.calledWith({
          ...defaultProps.data,
          patient4142Acknowledgement: false,
        }),
      ).to.be.true;
      wrapper.unmount();
    });

    it('should reflect the checked state from props', () => {
      const propsWithChecked = {
        ...defaultProps,
        data: { patient4142Acknowledgement: true },
      };
      const wrapper = mount(
        <PrivateRecordsAuthorization {...propsWithChecked} />,
      );
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      expect(checkbox.prop('checked')).to.be.true;
      wrapper.unmount();
    });
  });

  describe('navigation and form submission', () => {
    it('should call goForward when Continue is clicked and checkbox is checked', () => {
      const propsWithChecked = {
        ...defaultProps,
        data: { patient4142Acknowledgement: true },
      };
      const wrapper = mount(
        <PrivateRecordsAuthorization {...propsWithChecked} />,
      );
      const navButtons = wrapper.find('FormNavButtons');

      navButtons.prop('goForward')();

      expect(defaultProps.goForward.calledOnce).to.be.true;
      expect(defaultProps.goForward.calledWith(propsWithChecked.data)).to.be
        .true;
      wrapper.unmount();
    });

    it('should call goBack when Back is clicked', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const navButtons = wrapper.find('FormNavButtons');

      navButtons.prop('goBack')();

      expect(defaultProps.goBack.calledOnce).to.be.true;
      wrapper.unmount();
    });
  });

  describe('review page functionality', () => {
    let reviewPageProps;

    beforeEach(() => {
      reviewPageProps = {
        ...defaultProps,
        onReviewPage: true,
        updatePage: sinon.spy(),
      };
    });

    it('should render Update button instead of FormNavButtons on review page', () => {
      const wrapper = mount(
        <PrivateRecordsAuthorization {...reviewPageProps} />,
      );
      const navButtons = wrapper.find('FormNavButtons');
      const updateButton = wrapper.find('[text="Update page"]');

      expect(navButtons).to.have.lengthOf(0);
      expect(updateButton).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should call updatePage when Update is clicked and checkbox is checked', () => {
      const propsWithChecked = {
        ...reviewPageProps,
        data: { patient4142Acknowledgement: true },
      };
      const wrapper = mount(
        <PrivateRecordsAuthorization {...propsWithChecked} />,
      );
      const updateButton = wrapper.find('[text="Update page"]');

      updateButton.prop('onClick')();

      expect(reviewPageProps.updatePage.calledOnce).to.be.true;
      wrapper.unmount();
    });
  });

  describe('modal functionality', () => {
    it('should show modal when visible prop is true', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);

      // Find and click the privacy button to open modal
      const modalButton = wrapper
        .find('[text="Review Privacy Act Statement"]')
        .first();
      modalButton.prop('onClick')();

      wrapper.update();
      const modal = wrapper
        .find('[modalTitle="Privacy Act Statement"]')
        .first();
      expect(modal.prop('visible')).to.be.true;
      wrapper.unmount();
    });

    it('should close modal when close event is triggered', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);

      // Open modal first
      const modalButton = wrapper
        .find('[text="Review Privacy Act Statement"]')
        .first();
      modalButton.prop('onClick')();
      wrapper.update();

      // Close modal
      const modal = wrapper
        .find('[modalTitle="Privacy Act Statement"]')
        .first();
      modal.prop('onCloseEvent')();

      wrapper.update();
      const modalAfterClose = wrapper
        .find('[modalTitle="Privacy Act Statement"]')
        .first();
      expect(modalAfterClose.prop('visible')).to.be.false;
      wrapper.unmount();
    });
  });

  describe('error handling', () => {
    it('should show error state on checkbox when error exists', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);

      // Trigger error by trying to submit without checkbox
      const navButtons = wrapper.find('FormNavButtons');
      navButtons.prop('goForward')();
      wrapper.update();

      const checkbox = wrapper.find('[id="privacy-agreement"]').first();
      expect(checkbox.prop('error')).to.equal(
        'Select the checkbox to authorize us to get your non-VA medical records',
      );
      wrapper.unmount();
    });

    it('should not show error state on checkbox initially', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      expect(checkbox.prop('error')).to.equal('');
      wrapper.unmount();
    });
  });

  describe('content sections', () => {
    it('should render contentBeforeButtons when provided', () => {
      const contentBeforeButtons = <div className="before-content">Before</div>;
      const wrapper = mount(
        <PrivateRecordsAuthorization
          {...defaultProps}
          contentBeforeButtons={contentBeforeButtons}
        />,
      );

      expect(wrapper.find('.before-content')).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should render contentAfterButtons when provided', () => {
      const contentAfterButtons = <div className="after-content">After</div>;
      const wrapper = mount(
        <PrivateRecordsAuthorization
          {...defaultProps}
          contentAfterButtons={contentAfterButtons}
        />,
      );

      expect(wrapper.find('.after-content')).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });

  describe('link interactions', () => {
    it('should have links that reference accordion sections', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const sectionTwoLinks = wrapper.find('[href="#section-two"]');

      expect(sectionTwoLinks.length).to.be.greaterThan(0);
      wrapper.unmount();
    });

    it('should have acknowledgement link', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const acknowledgementLink = wrapper.find('[href="#acknowledgement"]');

      expect(acknowledgementLink).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should have section one link', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const sectionOneLink = wrapper.find('[href="#section-one"]');

      expect(sectionOneLink).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });

  describe('analytics and accessibility', () => {
    it('should have enable-analytics on checkbox', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      expect(checkbox.prop('enable-analytics')).to.be.true;
      wrapper.unmount();
    });

    it('should have required attribute on checkbox', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      expect(checkbox.prop('required')).to.be.true;
      wrapper.unmount();
    });

    it('should have proper id and name on checkbox', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      expect(checkbox.prop('id')).to.equal('privacy-agreement');
      expect(checkbox.prop('name')).to.equal('privacy-agreement');
      wrapper.unmount();
    });
  });

  describe('checkbox label', () => {
    it('should have correct authorization label', () => {
      const wrapper = mount(<PrivateRecordsAuthorization {...defaultProps} />);
      const checkbox = wrapper.find('[id="privacy-agreement"]').first();

      expect(checkbox.prop('label')).to.equal(
        'I acknowledge and authorize this release of information',
      );
      wrapper.unmount();
    });
  });
});
