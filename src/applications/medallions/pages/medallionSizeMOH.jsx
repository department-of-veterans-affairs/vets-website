import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import environment from 'platform/utilities/environment';
import buckets from 'site/constants/buckets';
import { VAGOVPROD, VAGOVSTAGING } from 'site/constants/environments';

const mohImageSrc = environment.isProduction()
  ? `${buckets[VAGOVPROD]}/img/medallions-moh.png`
  : `${buckets[VAGOVSTAGING]}/img/medallions-moh.png`;

const MOHSizeDescription = () => {
  return (
    <div>
      <p>
        You can get a Medal of Honor in 2 sizes. Contact the Veteran’s cemetery
        to check if they’ll accept the size of medallion you request.
      </p>
      <img
        src={mohImageSrc}
        alt="Medal of Honor VA medallions in medium and large sizes"
        className="vads-u-margin-y--2 vads-u-display--block"
        style={{ maxWidth: '100%', width: '400px' }}
      />
      <p>
        <a
          href="https://www.cem.va.gov/hmm/types.asp#Medallions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about the sizes of medallions (opens in a new tab)
        </a>
      </p>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Size of medallion'),
    'ui:description': MOHSizeDescription,
    mohMedallionSize: radioUI({
      title: 'What size Medal of Honor VA medallion do you want?',
      labels: {
        medium: "Medium (3'' x 0.3'' depth)",
        large: "Large (5'' x 0.4'' depth)",
      },
      required: () => true,
      errorMessages: {
        required: 'Please select an option',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      mohMedallionSize: radioSchema(['medium', 'large']),
    },
  },
};
