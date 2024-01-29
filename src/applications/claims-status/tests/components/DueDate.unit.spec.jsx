import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import moment from 'moment';

import { DATE_FORMATS } from '../../constants';
import { buildDateFormatter } from '../../utils/helpers';
import DueDate from '../../components/DueDate';

describe('<DueDate>', () => {
  const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);

  it('should render past due class', () => {
    const date = moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate}`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render past due class when less than day difference', () => {
    const date = moment()
      .subtract(1, 'hour')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate}`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class', () => {
    const date = moment()
      .add(1, 'day')
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
