import { expect } from 'chai';

import { createMemoryHistory } from 'history';
import { spy } from 'sinon';
import { getSearchQueryChanged, updateUrlParams } from '../../selectors/search';
import { getDefaultState } from '../helpers';
import { TABS } from '../../constants';

const defaultState = getDefaultState();

describe('getSearchQueryChanged', () => {
  it('compares default state query to initial state query', () => {
    expect(getSearchQueryChanged(defaultState.search.query)).to.be.false;
  });

  it('compares modified query to initial state query', () => {
    expect(
      getSearchQueryChanged({ ...defaultState.search.query, name: 'test' }),
    ).to.be.true;
  });
});

describe('updateUrlParams', () => {
  it('pushes only tab to url', () => {
    const history = createMemoryHistory();
    spy(history, 'push');

    updateUrlParams(
      history,
      TABS.name,
      defaultState.search.query,
      defaultState.filters,
    );
    expect(history.push.calledOnce).to.be.true;
    expect(history.push.getCall(0).args[0]).to.equal('/?search=name');
  });

  it('pushes query name params to url', () => {
    const history = createMemoryHistory();
    spy(history, 'push');

    const query = {
      ...defaultState.search.query,
      search: TABS.name,
      name: 'test',
    };
    updateUrlParams(history, TABS.name, query, defaultState.filters);
    expect(history.push.calledOnce).to.be.true;
    expect(history.push.getCall(0).args[0]).to.equal('/?search=name&name=test');
  });

  it('pushes query location params to url', () => {
    const history = createMemoryHistory();
    spy(history, 'push');

    const query = {
      ...defaultState.search.query,
      search: TABS.location,
      location: 'nowhere, ka',
    };
    updateUrlParams(history, TABS.location, query, defaultState.filters);
    expect(history.push.calledOnce).to.be.true;
    expect(history.push.getCall(0).args[0]).to.equal(
      '/?search=location&location=nowhere%2C%20ka&excludedSchoolTypes%5B%5D=PUBLIC&excludedSchoolTypes%5B%5D=FOR%20PROFIT&excludedSchoolTypes%5B%5D=PRIVATE&excludedSchoolTypes%5B%5D=FOREIGN&excludedSchoolTypes%5B%5D=FLIGHT&excludedSchoolTypes%5B%5D=CORRESPONDENCE&excludedSchoolTypes%5B%5D=HIGH%20SCHOOL',
    );
  });

  it('pushes version to url', () => {
    const history = createMemoryHistory();
    spy(history, 'push');

    const query = {
      ...defaultState.search.query,
      search: TABS.location,
      location: 'nowhere, ka',
    };
    updateUrlParams(history, TABS.location, query, defaultState.filters, 1);
    expect(history.push.calledOnce).to.be.true;
    expect(history.push.getCall(0).args[0]).to.equal(
      '/?search=location&location=nowhere%2C%20ka&version=1&excludedSchoolTypes%5B%5D=PUBLIC&excludedSchoolTypes%5B%5D=FOR%20PROFIT&excludedSchoolTypes%5B%5D=PRIVATE&excludedSchoolTypes%5B%5D=FOREIGN&excludedSchoolTypes%5B%5D=FLIGHT&excludedSchoolTypes%5B%5D=CORRESPONDENCE&excludedSchoolTypes%5B%5D=HIGH%20SCHOOL',
    );
  });

  it('pushes filters params to url', () => {
    const history = createMemoryHistory();
    spy(history, 'push');

    const query = {
      ...defaultState.search.query,
      search: TABS.name,
      name: 'test',
    };
    const filters = {
      ...defaultState.filters,
      excludeCautionFlags: true,
    };

    updateUrlParams(history, TABS.name, query, filters);
    expect(history.push.calledOnce).to.be.true;
    expect(history.push.getCall(0).args[0]).to.equal(
      '/?search=name&name=test&excludeCautionFlags=true',
    );
  });
});
