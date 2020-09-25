import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { showContestableIssueError } from '../../content/contestableIssueAlerts';

describe('Content: contestableIssueAlerts', () => {
  const Alert = ({ error, type }) => showContestableIssueError({ error, type });

  it('should show an invalid benefit type error', () => {
    const tree = mount(<Alert error={'invalidBenefitType'} type={'foo'} />);
    expect(tree.find('.usa-alert-heading').text()).to.equal(
      'We don’t support this benefit type',
    );
    expect(tree.find('.usa-alert-text').text()).to.equal(
      'We don’t currently support the "foo" benefit type',
    );
    tree.unmount();
  });
  it('should show network error', () => {
    const tree = mount(<Alert error={'someError'} />);
    expect(tree.find('.usa-alert-heading').text()).to.equal(
      'We can’t load your issues',
    );
    expect(tree.find('.usa-alert-text').text()).to.contain(
      'We’re having some connection issues on our end. Please refresh',
    );
    tree.unmount();
  });
});
