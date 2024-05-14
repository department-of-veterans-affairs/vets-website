import React from 'react';

import WhatToExpect from './WhatToExpect';
import ScreenReader from './ScreenReader';
import WhatWeCollect from './WhatWeCollect';

export default function MoreAboutOurChatbot() {
  return (
    <>
      <h3>More about our chatbot</h3>
      <va-accordion>
        <va-accordion-item>
          <WhatToExpect />
        </va-accordion-item>

        <va-accordion-item>
          <ScreenReader />
        </va-accordion-item>

        <va-accordion-item>
          <WhatWeCollect />
        </va-accordion-item>
      </va-accordion>
    </>
  );
}
