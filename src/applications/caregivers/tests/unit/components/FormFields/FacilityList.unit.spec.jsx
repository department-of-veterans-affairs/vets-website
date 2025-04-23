import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import content from '../../../../locales/en/content.json';
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';
import FacilityList from '../../../../components/FormFields/FacilityList';

// declare error message content
const ERROR_MSG_REQUIRED = content['validation-facilities--default-required'];

describe('CG <FacilityList>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  let onChange;

  const subject = ({
    reviewMode,
    submitted,
    context = undefined,
    value = undefined,
    error = undefined,
  } = {}) => {
    const props = {
      formContext: context === undefined ? { reviewMode, submitted } : context,
      query: 'Columbus',
      facilities,
      onChange,
      value,
      error,
    };
    const { container } = render(<FacilityList {...props} />);
    const selectors = () => ({
      name: container.querySelector('[ data-testid="cg-facility-name"]'),
      vaRadio: container.querySelector('va-radio'),
    });
    return { selectors };
  };

  beforeEach(() => {
    onChange = sinon.spy();
  });

  afterEach(() => {
    onChange.resetHistory();
  });

  it('should render `va-radio` component when not in review mode', () => {
    const { selectors } = subject({ context: null });
    expect(selectors().vaRadio).to.exist;
  });

  it('should render facility name container when in review mode', () => {
    const { selectors } = subject({ reviewMode: true, value: 'vha_757QC' });
    const { name, vaRadio } = selectors();
    expect(vaRadio).to.not.exist;
    expect(name.textContent).to.contain('Columbus VA Clinic');
  });

  it('should render an `em dash` when facility ID is not found in review mode', () => {
    const { selectors } = subject({ reviewMode: true, value: 'flerp' });
    const { name, vaRadio } = selectors();
    expect(vaRadio).to.not.exist;
    expect(name.textContent).to.contain('&mdash;');
  });

  it('should fire the `onChange` method when radio option has been selected', () => {
    const { selectors } = subject();
    const { vaRadio } = selectors();
    const value = facilities[0].id;
    vaRadio.__events.vaValueChange({ detail: { value } });
    sinon.assert.calledWithExactly(onChange, value);
    expect(vaRadio).to.not.have.attr('error');
  });

  it('should render error message when form has been submitted with no selected value', () => {
    const { selectors } = subject({ submitted: true });
    expect(selectors().vaRadio).to.have.attr('error', ERROR_MSG_REQUIRED);
  });

  it('should render error message when error string is passed into the field props', () => {
    const error = 'some error message';
    const { selectors } = subject({ error });
    expect(selectors().vaRadio).to.have.attr('error', error);
  });
});
