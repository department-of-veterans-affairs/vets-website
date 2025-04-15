import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import content from '../../../../locales/en/content.json';
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';
import FacilityList from '../../../../components/FormFields/FacilityList';

describe('CG <FacilityList>', () => {
  const subject = ({
    reviewMode,
    submitted,
    context = undefined,
    value = undefined,
    error = undefined,
    onChangeSpy = () => {},
  } = {}) => {
    const props = {
      facilities: mockFetchFacilitiesResponse.facilities,
      formContext: context === undefined ? { reviewMode, submitted } : context,
      onChange: onChangeSpy,
      query: 'Columbus',
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

  it('should render `va-radio` component when not in review mode', () => {
    const { selectors } = subject({ context: null });
    expect(selectors().vaRadio).to.exist;
  });

  it('should render facility name container when in review mode', () => {
    const { selectors } = subject({ reviewMode: true, value: 'vha_757QC' });
    const { name, vaRadio } = selectors();
    expect(vaRadio).to.not.exist;
    expect(name).to.exist;
    expect(name.textContent).to.contain('Columbus VA Clinic');
  });

  it('should render an `em dash` when facility ID is not found in review mode', () => {
    const { selectors } = subject({ reviewMode: true, value: 'flerp' });
    const { name, vaRadio } = selectors();
    expect(vaRadio).to.not.exist;
    expect(name).to.exist;
    expect(name.textContent).to.contain('&mdash;');
  });

  it('should fire the `onChange` method when radio option has been selected', async () => {
    const onChangeSpy = sinon.spy();
    const { selectors } = subject({ onChangeSpy });
    await waitFor(() => {
      const { vaRadio } = selectors();
      const value = mockFetchFacilitiesResponse.facilities[0].id;
      vaRadio.__events.vaValueChange({ detail: { value } });
      expect(onChangeSpy.calledWith(value)).to.be.true;
      expect(vaRadio).to.not.have.attr('error');
    });
  });

  it('should render error message when form has been submitted with no selected value', () => {
    const { selectors } = subject({ submitted: true });
    expect(selectors().vaRadio).to.have.attr(
      'error',
      content['validation-facilities--default-required'],
    );
  });

  it('should render error message when error string is passed into the field props', () => {
    const error = 'some error message';
    const { selectors } = subject({ error });
    expect(selectors().vaRadio).to.have.attr('error', error);
  });
});
