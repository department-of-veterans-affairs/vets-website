import React from 'react';

const NeedHelp = () => {
  return (
    <div className="vads-u-margin-top--6">
      <va-need-help>
        <div slot="content">
          <p>
            <strong>If you have triuble using this onile form,</strong> call us
            at <va-telephone contact="1884424551" />
          </p>
          <p>
            <strong>
              If you need help gathering your information or filling out your
              form,{' '}
            </strong>
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
