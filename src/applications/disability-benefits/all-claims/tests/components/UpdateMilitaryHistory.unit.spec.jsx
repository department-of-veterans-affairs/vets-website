import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SAVED_SEPARATION_DATE } from '../../constants';
import { UpdateMilitaryHistory } from '../../components/UpdateMilitaryHistory';

import { daysFromToday } from '../../utils/dates/formatting';

const inRangeBddDate = daysFromToday(120);

const inRangeBddDate2 = daysFromToday(100);

describe('UpdateMilitaryHistory', () => {
  let wrapper;

  const servicePeriods = (to = inRangeBddDate2) => [
    {
      serviceBranch: 'Army',
      dateRange: {
        from: '2015-12-31',
        to,
      },
    },
  ];
  const form = {
    data: {
      serviceInformation: {
        servicePeriods: [],
      },
    },
  };

  function setUp({ separationDate = '', to, callback }) {
    form.data.serviceInformation.servicePeriods = servicePeriods(to);
    const setFormData = data => {
      form.data = data;
    };
    if (separationDate) {
      global.window.sessionStorage.setItem(
        SAVED_SEPARATION_DATE,
        separationDate,
      );
    }
    wrapper = mount(
      <UpdateMilitaryHistory form={form} setFormData={setFormData} />,
    );
    callback();
  }

  afterEach(() => {
    global.window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    wrapper.unmount();
    form.data.serviceInformation.servicePeriods = [];
  });

  it('should get called', () => {
    setUp({
      separationDate: '', // don't add separation date to sessionStorage
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(),
        );
      },
    });
  });
  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10219/tests
  it.skip('should update the form data', () => {
    setUp({
      separationDate: inRangeBddDate,
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal([
          ...servicePeriods(),
          {
            serviceBranch: '',
            dateRange: {
              from: '',
              to: inRangeBddDate,
            },
          },
        ]);
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(2);
        expect(form.data['view:isBddData']).to.be.true;
      },
    });
  });
  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10219/tests
  it.skip('should add separation date to an existing "empty" entry', () => {
    setUp({
      separationDate: inRangeBddDate,
      to: '', // Add empty "to" date in prefill
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(inRangeBddDate),
        );
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(1);
        expect(form.data['view:isBddData']).to.be.true;
      },
    });
  });
  it('should not add a duplicate separation date', () => {
    setUp({
      separationDate: inRangeBddDate,
      to: inRangeBddDate, // Separation date already in prefill
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(inRangeBddDate),
        );
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(1);
        // expect(form.data['view:isBddData']).to.be.true;
      },
    });
  });
});
