import React from 'react';

const AdditionalSupport = () => {
  return (
    <div className="row vads-u-margin-y--2">
      <div className="usa-width-one-whole medium-8 columns">
        <h2 id="additional-support">Additional support</h2>
        <p className="help-talk">
          You can also call MyVA411 for 24/7 assistance at{' '}
          <va-telephone contact="8006982411" class="hydrated" />.
        </p>
        <p className="help-talk">
          <strong>If you need an interpreter: </strong>
          Call us at <va-telephone contact="8006982411" class="hydrated" /> and
          select 0. We’ll connect you with a VA call center agent. Tell the
          agent that you want a language interpreter to join the call.
        </p>
      </div>
    </div>
  );
};

export default AdditionalSupport;
