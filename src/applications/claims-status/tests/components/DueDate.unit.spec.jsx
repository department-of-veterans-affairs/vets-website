import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import moment from 'moment';

import { buildDateFormatter } from '../../utils/helpers';
import DueDate from '../../components/DueDate';

const formatDate = buildDateFormatter();

describe('<DueDate>', () => {
  it('should render past due class when theres more than a years difference', () => {
    const date = moment()
      .subtract(15, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - Due a year ago`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render past due class when theres more than a months difference', () => {
    const date = moment()
      .subtract(4, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - Due 4 months ago`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render past due class when theres more than a days difference', () => {
    const date = moment()
      .subtract(3, 'day')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - Due 3 days ago`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class when more than a days difference', () => {
    const date = moment()
      .add(3, 'day')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate}`;

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class when more than a months difference', () => {
    const date = moment()
      .add(10, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate}`;

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class when more than a years difference', () => {
    const date = moment()
      .add(15, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate}`;

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });
});
