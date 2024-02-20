import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ServicePeriodReview from '../../../components/ServicePeriodReview';

import maximalData from '../../e2e/fixtures/data/maximal-test.json';

describe('<ServicePeriodReview>', () => {
  const setup = ({ data = {}, editPage = () => {} } = {}) => (
    <div>
      <ServicePeriodReview
        data={{ ...maximalData.data, ...data }}
        editPage={editPage}
      />
    </div>
  );

  it('should render content', () => {
    const { container } = render(setup());
    expect($('h4', container).textContent).to.eq('Service Periods');
    expect($('dt', container).textContent).to.eq('Branch of service');
    expect($('dd', container).textContent).to.eq('Army, Navy');
    expect($$('dt', container)[1].textContent).to.eq(
      'Date initially entered active duty',
    );
    expect($$('dd', container)[1].textContent).to.eq('03/02/2003');
    expect($$('dt', container)[2].textContent).to.eq(
      'Final release date from active duty',
    );
    expect($$('dd', container)[2].textContent).to.eq('03/20/2007');
    expect($$('dt', container)[3].textContent).to.eq('Military Service number');
    expect($$('dd', container)[3].textContent).to.eq('123456');
  });

  it('should switch to edit mode', () => {
    const editPageSpy = sinon.spy();
    const { container } = render(setup({ editPage: editPageSpy }));

    fireEvent.click($('va-button', container));
    expect(editPageSpy.called).to.be.true;
  });
});
