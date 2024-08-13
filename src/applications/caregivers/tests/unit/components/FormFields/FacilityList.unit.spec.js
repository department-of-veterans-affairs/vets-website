import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { mockLightHouseFacilitiesResponseWithTransformedAddresses } from '../../../mocks/responses';
import FacilityList from '../../../../components/FormFields/FacilityList';

describe('CG <FacilityList>', () => {
  const getData = ({ reviewMode = false, submitted = false, value = '' }) => ({
    props: {
      facilities: mockLightHouseFacilitiesResponseWithTransformedAddresses.data,
      formContext: { reviewMode, submitted },
      onChange: sinon.spy(),
      query: 'Tampa',
      value,
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<FacilityList {...props} />);
    const selectors = () => ({
      name: container.querySelector('[ data-testid="cg-facility-name"]'),
      vaRadio: container.querySelector('va-radio'),
    });
    return { container, selectors };
  };

  context('when the component renders on the form page', () => {
    it('should render `va-radio` component when not in review mode', () => {
      const { props } = getData({});
      const { selectors } = subject({ props });
      expect(selectors().vaRadio).to.exist;
    });

    it('should render facility name container when in review mode', () => {
      const { props } = getData({ reviewMode: true, value: 'vha_111AA' });
      const { selectors } = subject({ props });
      expect(selectors().name).to.exist;
      expect(selectors().name.textContent).to.contain('Test VA Clinic');
      expect(selectors().vaRadio).to.not.exist;
    });

    it('should render &mdash; when facility id is not found in review mode', () => {
      const { props } = getData({ reviewMode: true, value: 'flerp' });
      const { selectors } = subject({ props });
      expect(selectors().name).to.exist;
      expect(selectors().name.textContent).to.contain('&mdash;');
      expect(selectors().vaRadio).to.not.exist;
    });
  });

  context('when form has been submitted with no value', () => {
    it('should add `error` prop to the `va-radio` web component', () => {
      const { props } = getData({ submitted: true });
      const { selectors } = subject({ props });
      expect(selectors().vaRadio).to.have.attr('error');
    });
  });

  context('when radio option has been selected', () => {
    it('should fire the `onChange` method', async () => {
      const { props } = getData({});
      const { selectors } = subject({ props });
      await waitFor(() => {
        const value = props.facilities[0].id;
        selectors().vaRadio.__events.vaValueChange({ detail: { value } });
        expect(props.onChange.calledWith(value)).to.be.true;
        expect(selectors().vaRadio).to.not.have.attr('error');
      });
    });
  });
});
