import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { SAVED_SEPARATION_DATE } from '../../constants';
import {
  UpdateMilitaryHistory,
  addServicePeriod,
} from '../../components/UpdateMilitaryHistory';

describe('UpdateMilitaryHistory', () => {
  let wrapper;
  let oldSessionStorage;
  let storage = {};
  const servicePeriods = () => [
    {
      serviceBranch: 'Army',
      dateRange: {
        from: '2015-12-31',
        to: '2020-12-31',
      },
    },
  ];
  const form = {
    data: {
      serviceInformation: {
        servicePeriods: servicePeriods(),
      },
    },
  };

  const useEffect = sinon.stub(React, 'useEffect');

  function setUp(separationDate, test) {
    const setFormData = data => {
      form.data = data;
    };
    oldSessionStorage = window.sessionStorage;
    delete window.sessionStorage;
    window.sessionStorage = {
      getItem: key => storage[key] || null,
      setItem: (key, value) => {
        storage[key] = value;
      },
      removeItem: key => delete storage[key],
    };
    if (separationDate) {
      window.sessionStorage.setItem(SAVED_SEPARATION_DATE, separationDate);
    }
    useEffect.onCall(0).callsFake(() => {
      // duplicate code from useEffect in UpdateMilitaryHistory
      if (form.data && separationDate) {
        addServicePeriod(form.data, separationDate, setFormData);
      }
    });
    wrapper = shallow(<UpdateMilitaryHistory form={form} />);
    test();
    useEffect.resetHistory();
  }

  afterEach(() => {
    window.sessionStorage = oldSessionStorage;
    storage = {};
    wrapper.unmount();
    form.data.serviceInformation.servicePeriods = servicePeriods();
  });

  after(() => {
    useEffect.restore();
  });

  it('should get called', () => {
    setUp('', () => {
      expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
        servicePeriods(),
      );
    });
  });
  it('should update the form data', () => {
    setUp('2021-01-30', () => {
      expect(form.data.serviceInformation.servicePeriods).to.deep.equal([
        ...servicePeriods(),
        {
          serviceBranch: '',
          dateRange: {
            from: '',
            to: '2021-01-30',
          },
        },
      ]);
    });
  });
});
