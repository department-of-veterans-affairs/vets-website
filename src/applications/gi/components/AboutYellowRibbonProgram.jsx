import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

const AboutYellowRibbonProgram = ({ className }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.showAboutYellowRibbonProgram);

  return (
    <>
      {toggleValue && (
        <va-additional-info
          trigger="Learn more about Yellow Ribbon Program eligibility"
          class={className}
        >
          <p>
            The Yellow Ribbon Program can be paid towards net tuition and fee
            costs not covered by the Post-9/11 GI Bill at participating
            institutions of higher learning.{' '}
            <VaLink
              text="Find out if you qualify for the
               Yellow Ribbon Program."
              href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/"
            />
          </p>
        </va-additional-info>
      )}
    </>
  );
};

AboutYellowRibbonProgram.propTypes = {
  className: PropTypes.string,
};

export default AboutYellowRibbonProgram;
