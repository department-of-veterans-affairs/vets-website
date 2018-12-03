import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import { SetPreferences } from '../../containers/SetPreferences';

const savePreferences = spy();
const setPreference = spy();
const push = spy();

const props = {
  savePreferences,
  setPreference,
  isLoading: false,
  preferences: {
    dashboard: {
      healthcare: false,
    },
  },
  router: {
    push,
  },
};

describe('<SetPreferences>', () => {
  it('should render', () => {
    props.isLoading = false;
    const component = shallow(<SetPreferences {...props} />);

    expect(component.debug()).to.equal(`<div className="row user-profile-row">
  <div className="small-12 columns">
    <h1 id="dashboard-title">
      Find VA Benefits
    </h1>
    <p className="va-introtext">
      Tell us which benefits you’re interested in, so we can help you apply. Select one or more of the types of benefits below, and we’ll help you get started.
    </p>
    <div className="preferences-grid">
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
    </div>
    <div>
      <LoadingButton isLoading={false} onClick={[Function]}>
        <span>
          Save Preferences
        </span>
      </LoadingButton>
      <Link to="/" className="usa-button usa-button-secondary" onlyActiveOnIndex={false} style={{...}}>
        Cancel
      </Link>
    </div>
  </div>
</div>`);
  });
  it('should handle updates', () => {
    props.isLoading = false;
    const component = mount(<SetPreferences {...props} />);

    component
      .find('Checkbox')
      .first()
      .simulate('click');
    expect(setPreference.args[0][0]).to.equal('healthcare');
    expect(setPreference.args[0][1]).to.equal(true);
    component
      .find('button')
      .first()
      .simulate('click');
    expect(push.args[0][0]).to.equal('/');
    expect(savePreferences.args[0][0].healthcare).to.equal(false);
  });
  it('should render loading view', () => {
    props.isLoading = true;
    const component = shallow(<SetPreferences {...props} />);

    expect(component.debug()).to.equal(`<div className="row user-profile-row">
  <div className="small-12 columns">
    <h1 id="dashboard-title">
      Find VA Benefits
    </h1>
    <p className="va-introtext">
      Tell us which benefits you’re interested in, so we can help you apply. Select one or more of the types of benefits below, and we’ll help you get started.
    </p>
    <div className="preferences-grid">
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
      <Component item={{...}} onChange={[Function]} checked={false} />
    </div>
    <div>
      <LoadingButton isLoading={true} onClick={[Function]}>
        <span>
          Save Preferences
        </span>
      </LoadingButton>
      <Link to="/" className="usa-button usa-button-secondary" onlyActiveOnIndex={false} style={{...}}>
        Cancel
      </Link>
    </div>
  </div>
</div>`);
  });
});
