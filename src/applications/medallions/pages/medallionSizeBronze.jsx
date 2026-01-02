import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import environment from 'platform/utilities/environment';
import buckets from 'site/constants/buckets';
import { VAGOVPROD, VAGOVSTAGING } from 'site/constants/environments';

const bronzeImageSrc = environment.isProduction()
  ? `${buckets[VAGOVPROD]}/img/medallions-bronze.png`
  : `${buckets[VAGOVSTAGING]}/img/medallions-bronze.png`;

const BronzeSizeDescription = () => {
  return (
    <div>
      <p>
        You can get a bronze medallion in 3 sizes. Contact the Veteran’s
        cemetery to check if they’ll accept the size of medallion you request.
      </p>
      <img
        src={bronzeImageSrc}
        alt="Bronze VA medallions in small, medium, and large sizes"
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
    'ui:description': BronzeSizeDescription,
    bronzeMedallionSize: radioUI({
      title: 'What size bronze VA medallion do you want?',
      labels: {
        small: "Small (2'' width x 1-1/2'' height x 1/3'' depth)",
        medium: "Medium (3-3/4'' width x 2-7/8'' height x 1/4'' depth)",
        large: "Large (6-3/8'' width x 4-3/4'' height x 1/2'' depth)",
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
      bronzeMedallionSize: radioSchema(['small', 'medium', 'large']),
    },
  },
};
