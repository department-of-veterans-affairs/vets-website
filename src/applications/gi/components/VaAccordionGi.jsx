import React from 'react';
import PropTypes from 'prop-types';
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings';

const VaAccordionGi = ({ title, children, expanded, onChange }) => {
  return (
    <VaAccordion uswds openSingle>
      <VaAccordionItem
        open={expanded}
        onClick={e => {
          if (e.target.tagName === 'VA-ACCORDION-ITEM') {
            onChange();
          }
          // eslint-disable-next-line no-console
          console.log('-------------');
          // eslint-disable-next-line no-console
          console.log(e.target);
          // eslint-disable-next-line no-console
          console.log(e.target.toString());
          // eslint-disable-next-line no-console
          console.log(`-------tageName=${e.target.tagName}`);
          // eslint-disable-next-line no-console
          console.log(typeof e.target);
          /*
            // eslint-disable-next-line no-console
            console.log(e);
            // eslint-disable-next-line no-console
            console.log(e.nativeEvent);
           */
        }}
      >
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
