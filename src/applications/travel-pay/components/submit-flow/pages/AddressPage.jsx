import React from 'react';
import PropTypes from 'prop-types';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AddressPage = ({ handlers }) => {
  return (
    <div>
      <h1>Address page</h1>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

AddressPage.propTypes = {
  handlers: PropTypes.shape({
    onBack: PropTypes.func,
    onNext: PropTypes.func,
  }),
};

export default AddressPage;
