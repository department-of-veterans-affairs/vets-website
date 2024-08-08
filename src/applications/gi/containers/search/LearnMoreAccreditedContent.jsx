import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const LearnMoreAccreditedContent = ({ onCloseEvent, visible }) => {
  return (
    <VaModal
      onCloseEvent={onCloseEvent}
      visible={visible}
      modalTitle="Accreditation and why it matters"
      large
    >
      <p>
        The goal of accreditation is to ensure that the education provided by
        the institutions of higher education meets acceptable levels of quality.
        Accreditation types are either regional or national. Accreditation may
        not be necessary for every program you wish to pursue.
      </p>
      <p>
        Accreditation matters if you plan to start school at one institution and
        transfer to another to complete your degree. Be sure to ask any
        potential school you may want to transfer to about its credit transfer
        policy.
      </p>
      <p>
        CAUTION: Not every program approved for GI Bill benefits is accredited
        by the regional or national accreditor. Prior to enrolling, it’s
        important to determine whether or not your field of study requires
        accreditation for employment and/or licensing.
      </p>
      <p>
        To learn more about accreditation types, visit the{' '}
        <a
          href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#accreditation_type"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          about this tool
        </a>{' '}
        page.{' '}
      </p>
    </VaModal>
  );
};
export default LearnMoreAccreditedContent;
