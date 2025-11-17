import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import moment from 'moment';
import { mount } from 'enzyme';
import externalServiceStatus from '~/platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import useDowntimeApproachingRenderMethod from '../useDowntimeApproachingRenderMethod';

// Test component that uses the hook
function TestComponent({ downtime, children }) {
  const renderMethod = useDowntimeApproachingRenderMethod();
  return renderMethod(downtime, children);
}

describe('useDowntimeApproachingRenderMethod', () => {
  const createDowntime = (
    status = externalServiceStatus.downtimeApproaching,
  ) => ({
    status,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T14:00:00Z',
  });

  const children = <div data-testid="test-children">Children content</div>;

  describe('when downtime.status === externalServiceStatus.downtimeApproaching', () => {
    it('should display the modal', () => {
      const downtime = createDowntime();
      const { container } = render(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal.getAttribute('id')).to.equal('downtime-approaching-modal');
      expect(modal.getAttribute('visible')).to.equal('true');
    });

    it('should render children when modal is shown', () => {
      const downtime = createDowntime();
      const { getByTestId } = render(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      expect(getByTestId('test-children')).to.exist;
      expect(getByTestId('test-children').textContent).to.equal(
        'Children content',
      );
    });

    it('should dismiss modal via onCloseEvent', async () => {
      const downtime = createDowntime();
      const wrapper = mount(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      // Verify modal is initially visible
      const modal = wrapper.find('VaModal');
      expect(modal.prop('visible')).to.be.true;

      // Get the onCloseEvent handler from VaModal
      const onCloseEvent = modal.prop('onCloseEvent');

      // Trigger onCloseEvent
      onCloseEvent();

      // Wait for state update and re-render
      await waitFor(() => {
        wrapper.update();
        const updatedModal = wrapper.find('VaModal');
        expect(updatedModal.prop('visible')).to.be.false;
      });

      wrapper.unmount();
    });

    it('should dismiss modal via button click', async () => {
      const downtime = createDowntime();
      const wrapper = mount(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      // Verify modal is initially visible
      const modal = wrapper.find('VaModal');
      expect(modal.prop('visible')).to.be.true;

      // Find the va-button using Enzyme's find method
      const buttonWrapper = wrapper.find('va-button');
      expect(buttonWrapper.length).to.be.greaterThan(0);
      expect(buttonWrapper.prop('text')).to.equal('Continue');

      // Get the DOM node from the button wrapper
      const buttonElement = buttonWrapper.getDOMNode();
      expect(buttonElement).to.exist;

      // Access the onClick handler - va-button web component exposes it via __events
      const onClickHandler = buttonElement.__events?.click;
      if (onClickHandler) {
        onClickHandler();
      } else {
        // Fallback: trigger click event directly
        buttonElement.click();
      }

      // Wait for state update and re-render
      await waitFor(() => {
        wrapper.update();
        const updatedModal = wrapper.find('VaModal');
        expect(updatedModal.prop('visible')).to.be.false;
      });

      wrapper.unmount();
    });

    it('should display correct modal title and content', () => {
      const downtime = createDowntime();
      const { container } = render(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      // Modal title is in the modal-title attribute, not as text content
      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal.getAttribute('modal-title')).to.equal(
        'Some parts of your dashboard will be down for maintenance soon',
      );

      // Verify the content text is present by checking the paragraph's textContent
      const paragraph = container.querySelector('va-modal p');
      expect(paragraph).to.exist;

      const paragraphText = paragraph.textContent;
      // Check for key phrases that should be in the content (flexible with apostrophe characters)
      expect(paragraphText).to.include(
        'making updates to some tools and features',
      );
      expect(paragraphText).to.include('check back soon');

      const startTime = moment(downtime.startTime);
      const formattedDate = startTime.format('MMMM Do');
      expect(paragraphText).to.include(formattedDate);
    });
  });

  describe('when downtime.status !== externalServiceStatus.downtimeApproaching', () => {
    it('should not display modal and return children', () => {
      const downtime = createDowntime(externalServiceStatus.ok);
      const { container, getByTestId } = render(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      const modal = container.querySelector('va-modal');
      expect(modal).to.not.exist;
      expect(getByTestId('test-children')).to.exist;
    });

    it('should not display modal when status is down', () => {
      const downtime = createDowntime(externalServiceStatus.down);
      const { container, getByTestId } = render(
        <TestComponent downtime={downtime}>{children}</TestComponent>,
      );

      const modal = container.querySelector('va-modal');
      expect(modal).to.not.exist;
      expect(getByTestId('test-children')).to.exist;
    });
  });
});
