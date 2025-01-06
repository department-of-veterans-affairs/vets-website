import React from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

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
    onNext: PropTypes.func,
    onBack: PropTypes.func,
  }),
};

export default AddressPage;
