import React from 'react';
import PropTypes from 'prop-types';
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings';

const VaAccordionGi = ({ title, children, expanded, onChange }) => {
  return (
    <VaAccordion uswds>
      <VaAccordionItem open={expanded} onClick={onChange}>
        <h2 slot="headline">{title}</h2>
        {children}
      </VaAccordionItem>
    </VaAccordion>
  );
};

VaAccordionGi.prototype = {
  title: PropTypes.string,
  children: PropTypes.any,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
};

export default VaAccordionGi;
