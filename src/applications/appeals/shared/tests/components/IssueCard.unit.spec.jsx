import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { IssueCard, determineActiveReview } from '../../components/IssueCard';
import { getAdditionalIssue, getContestableIssue } from '../test-utils';

describe('<IssueCard>', () => {
  const getProps = ({
    appName = 'Supplemental Claim',
    showCheckbox = true,
    showSeparator = false,
    onChange = () => {},
    onRemove = () => {},
  } = {}) => ({
    appName,
    id: 'id',
    index: 0,
    options: { appendId: 'z' },
    showCheckbox,
    showSeparator,
    onChange,
    onRemove,
  });

  describe('basic rendering', () => {
    it('should render nothing when item is null', () => {
      const props = getProps();
      const { container } = render(<IssueCard {...props} item={null} />);

      expect($$('va-checkbox', container).length).to.equal(0);
      expect($$('.widget-wrapper', container).length).to.equal(0);
    });

    it('should render a contestable issue with checkbox', () => {
      const props = getProps();
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('va-checkbox', container)).to.have.lengthOf(1);
      expect($$('[label="issue-10"]', container)).to.have.lengthOf(1);
      expect($$('a.edit-issue-link', container).length).to.equal(0);
      expect($$('.remove-issue', container).length).to.equal(0);
    });

    it('should render an additional issue with edit and remove buttons', () => {
      const props = getProps();
      const issue = getAdditionalIssue('22');
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('va-checkbox', container)).to.have.lengthOf(1);
      expect($$('[label="new-issue-22"]', container)).to.have.lengthOf(1);
      expect($$('.edit-issue-link', container).length).to.equal(1);
      expect($$('.remove-issue', container).length).to.equal(1);
    });

    it('should render a selected issue with appendId included', () => {
      const props = getProps();
      const issue = getContestableIssue('01', true);
      const { container } = render(<IssueCard {...props} item={issue} />);
      const checkbox = $$('va-checkbox', container);

      expect(checkbox.length).to.equal(1);
      expect(checkbox[0].id).to.equal('id_0_z');
      expect(checkbox[0].checked).to.be.true;
    });

    it('should render without appendId when not provided in options', () => {
      const props = { ...getProps(), options: {} };
      const issue = getContestableIssue('01', true);
      const { container } = render(<IssueCard {...props} item={issue} />);
      const checkbox = $$('va-checkbox', container);

      expect(checkbox[0].id).to.equal('id_0');
    });

    it('should render issue card content with description', () => {
      const props = getProps();
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('#issue-0-description', container).length).to.be.greaterThan(0);
    });
  });

  describe('checkbox functionality', () => {
    it('should call onChange when the checkbox is toggled', () => {
      const onChange = sinon.spy();
      const props = getProps({ onChange });
      const issue = getContestableIssue('01', true);
      const { container } = render(<IssueCard {...props} item={issue} />);

      const checkbox = $('va-checkbox', container);
      fireEvent(
        checkbox,
        new CustomEvent('vaChange', { detail: { checked: true } }),
      );

      expect(onChange.callCount).to.equal(1);
      expect(onChange.firstCall.args[0]).to.equal(0);
    });

    it('should call onChange with correct index', () => {
      const onChange = sinon.spy();
      const props = { ...getProps({ onChange }), index: 5 };
      const issue = getContestableIssue('01', false);
      const { container } = render(<IssueCard {...props} item={issue} />);

      const checkbox = $('va-checkbox', container);
      fireEvent(
        checkbox,
        new CustomEvent('vaChange', { detail: { checked: false } }),
      );

      expect(onChange.callCount).to.equal(1);
      expect(onChange.firstCall.args[0]).to.equal(5);
    });

    it('should show unselected checkbox for unselected issue', () => {
      const props = getProps();
      const issue = getContestableIssue('01', false);
      const { container } = render(<IssueCard {...props} item={issue} />);
      const checkbox = $('va-checkbox', container);

      expect(checkbox.checked).to.be.false;
    });
  });

  describe('without checkbox', () => {
    it('should render without checkbox, edit/remove buttons, and show issue name as strong text', () => {
      const props = getProps({ showCheckbox: false });
      const additionalIssue = getAdditionalIssue('03', true);
      const { container, rerender } = render(
        <IssueCard {...props} item={additionalIssue} />,
      );

      expect($$('va-checkbox', container).length).to.equal(0);
      expect($$('.edit-issue-link', container).length).to.equal(0);
      expect($$('.remove-issue', container).length).to.equal(0);

      let title = $('.widget-title', container);
      expect(title).to.exist;
      expect(title.textContent).to.equal('new-issue-03');

      // Test with contestable issue
      const contestableIssue = getContestableIssue('05', true);
      rerender(<IssueCard {...props} item={contestableIssue} />);

      title = $('.widget-title', container);
      expect(title.textContent).to.equal('issue-05');
    });
  });

  describe('edit and remove buttons', () => {
    it('should render edit link and remove button for additional issues', () => {
      const props = getProps();
      const issue = getAdditionalIssue('22');
      const { container } = render(<IssueCard {...props} item={issue} />);

      const editLinks = $$('.edit-issue-link', container);
      expect(editLinks.length).to.be.greaterThan(0);
      expect(editLinks[0].getAttribute('text')).to.equal('Edit');
      expect(editLinks[0].getAttribute('href')).to.equal('/add-issue');

      const removeButtons = $$('.remove-issue', container);
      expect(removeButtons.length).to.be.greaterThan(0);
      expect(removeButtons[0].getAttribute('label')).to.equal(
        'remove new-issue-22',
      );
      expect(removeButtons[0].getAttribute('text')).to.equal('Remove');
    });

    it('should render edit link at different indices', () => {
      const props = { ...getProps(), index: 7 };
      const issue = getAdditionalIssue('22');
      const { container } = render(<IssueCard {...props} item={issue} />);

      const editLinks = $$('.edit-issue-link', container);
      expect(editLinks.length).to.be.greaterThan(0);
      expect(editLinks[0].getAttribute('href')).to.equal('/add-issue');
    });

    it('should call onRemove with correct index when remove button is clicked', () => {
      const onRemove = sinon.spy();
      const props = getProps({ onRemove });
      const issue = getAdditionalIssue('22');
      const { container, rerender } = render(
        <IssueCard {...props} item={issue} />,
      );

      let removeButtons = $$('.remove-issue', container);
      fireEvent.click(removeButtons[0]);

      expect(onRemove.callCount).to.equal(1);
      expect(onRemove.firstCall.args[0]).to.equal(0);

      // Test with different index
      const propsWithIndex = { ...getProps({ onRemove }), index: 3 };
      rerender(<IssueCard {...propsWithIndex} item={issue} />);

      removeButtons = $$('.remove-issue', container);
      fireEvent.click(removeButtons[0]);

      expect(onRemove.callCount).to.equal(2);
      expect(onRemove.secondCall.args[0]).to.equal(3);
    });

    it('should not render edit/remove buttons for contestable issues', () => {
      const props = getProps();
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('.edit-issue-link', container).length).to.equal(0);
      expect($$('.remove-issue', container).length).to.equal(0);
    });
  });

  describe('active review message', () => {
    it('should show active review alert with claim status link for issue under active review', () => {
      const props = getProps({ appName: 'Supplemental Claim' });
      const issue = {
        ...getContestableIssue('10'),
        activeReview: true,
        titleOfActiveReview: 'Supplemental Claim',
      };
      const { container } = render(<IssueCard {...props} item={issue} />);

      const alert = $('va-alert', container);
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('info');
      expect(alert.hasAttribute('slim')).to.be.true;
      expect(alert.textContent).to.include(
        'issue-10 is part of an active Supplemental Claim',
      );

      const link = $('va-link', container);
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('/claim-or-appeal-status/');
      expect(link.getAttribute('text')).to.equal('Check your claim status');
    });

    it('should not show active review alert when activeReview is false', () => {
      const props = getProps();
      const issue = {
        ...getContestableIssue('10'),
        activeReview: false,
        titleOfActiveReview: 'Supplemental Claim',
      };
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('va-alert', container).length).to.equal(0);
    });

    it('should not show active review alert when titleOfActiveReview does not match', () => {
      const props = getProps({ appName: 'Supplemental Claim' });
      const issue = {
        ...getContestableIssue('10'),
        activeReview: true,
        titleOfActiveReview: 'Higher-Level Review',
      };
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('va-alert', container).length).to.equal(0);
    });

    it('should not show active review alert when titleOfActiveReview is missing', () => {
      const props = getProps();
      const issue = {
        ...getContestableIssue('10'),
        activeReview: true,
      };
      const { container } = render(<IssueCard {...props} item={issue} />);

      expect($$('va-alert', container).length).to.equal(0);
    });
  });

  describe('blocked issues', () => {
    it('should render blocked issue without border and handle top margin based on index', () => {
      const props = getProps();
      const issue = { ...getContestableIssue('10'), isBlocked: true };
      const { container, rerender } = render(
        <IssueCard {...props} item={issue} />,
      );

      let wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.not.include('vads-u-border-bottom');
      expect(wrapper.className).to.not.include('vads-u-margin-top--5');

      // Test with index > 0
      const propsWithIndex = { ...getProps(), index: 1 };
      rerender(<IssueCard {...propsWithIndex} item={issue} />);

      wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.include('vads-u-margin-top--5');
    });

    it('should add left margin when blocked and showCheckbox is false', () => {
      const props = getProps({ showCheckbox: false });
      const issue = { ...getContestableIssue('10'), isBlocked: true };
      const { container } = render(<IssueCard {...props} item={issue} />);

      const innerDiv = $('.widget-wrapper > div', container);
      expect(innerDiv.className).to.include('vads-u-margin-left--4');
    });
  });

  describe('separator', () => {
    it('should conditionally show separator based on showSeparator prop', () => {
      const issue = getContestableIssue('10');
      const { container, rerender } = render(
        <IssueCard {...getProps({ showSeparator: true })} item={issue} />,
      );

      let wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.include('vads-u-border-top--1px');
      expect(wrapper.className).to.include('vads-u-border-color--gray-medium');
      expect(wrapper.className).to.include('vads-u-margin-top--4');

      rerender(
        <IssueCard {...getProps({ showSeparator: false })} item={issue} />,
      );

      wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.not.include('vads-u-border-top--1px');
    });
  });

  describe('CSS classes', () => {
    it('should apply correct classes for additional vs contestable issues', () => {
      const props = getProps();
      const additionalIssue = getAdditionalIssue('22');
      const { container, rerender } = render(
        <IssueCard {...props} item={additionalIssue} />,
      );

      let wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.include('additional-issue');

      const contestableIssue = getContestableIssue('10');
      rerender(<IssueCard {...props} item={contestableIssue} />);

      wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.not.include('additional-issue');
    });

    it('should apply checkbox-hidden class when showCheckbox is false', () => {
      const props = getProps({ showCheckbox: false });
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      const wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.include('checkbox-hidden');
    });

    it('should apply border-bottom for non-blocked issues', () => {
      const props = getProps();
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      const wrapper = $('.widget-wrapper', container);
      expect(wrapper.className).to.include('vads-u-border-bottom--1px');
      expect(wrapper.className).to.include('vads-u-border-color--gray-light');
    });
  });

  describe('list item structure', () => {
    it('should render as a list item with correct id and name', () => {
      const props = { ...getProps(), index: 3 };
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      const listItem = $('li', container);
      expect(listItem.id).to.equal('issue-3');
      expect(listItem.getAttribute('name')).to.equal('issue-3');
    });

    it('should render with correct data attributes', () => {
      const props = getProps();
      const issue = getContestableIssue('10');
      const { container } = render(<IssueCard {...props} item={issue} />);

      const checkbox = $('va-checkbox', container);
      expect(checkbox.getAttribute('data-dd-action-name')).to.equal(
        'Issue Name',
      );
    });
  });

  describe('determineActiveReview helper', () => {
    it('should return true when appName and titleOfActiveReview match and activeReview is true', () => {
      const item = {
        activeReview: true,
        titleOfActiveReview: 'Supplemental Claim',
      };

      expect(determineActiveReview('Supplemental Claim', item)).to.be.true;
    });

    it('should return false when activeReview is false', () => {
      const item = {
        activeReview: false,
        titleOfActiveReview: 'Supplemental Claim',
      };

      expect(determineActiveReview('Supplemental Claim', item)).to.be.false;
    });

    it('should return false when titleOfActiveReview does not match', () => {
      const item = {
        activeReview: true,
        titleOfActiveReview: 'Higher-Level Review',
      };

      expect(determineActiveReview('Supplemental Claim', item)).to.be.false;
    });

    it('should return false when appName does not match', () => {
      const item = {
        activeReview: true,
        titleOfActiveReview: 'Supplemental Claim',
      };

      expect(determineActiveReview('Higher-Level Review', item)).to.be.false;
    });

    it('should return false when titleOfActiveReview is missing', () => {
      const item = {
        activeReview: true,
      };

      expect(determineActiveReview('Supplemental Claim', item)).to.be.false;
    });

    it('should return falsy when activeReview is missing', () => {
      const item = {
        titleOfActiveReview: 'Supplemental Claim',
      };

      expect(determineActiveReview('Supplemental Claim', item)).to.not.be.ok;
    });
  });
});
