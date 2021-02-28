import React from 'react';
import Select from '@department-of-veterans-affairs/component-library/Select';

const I18Select = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Select
        // TODO: update label based on props
        label={
          <div>
            <i
              aria-hidden="true"
              className="fas fa-globe vads-u-color--primary vads-u-margin-right--0p5"
            />
            <span>Read this page in: </span>
          </div>
        }
        name="branch"
        onKeyDown={function noRefCheck() {}}
        onValueChange={function noRefCheck() {}}
        options={['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard']}
        value={{
          dirty: false,
          value: 'Marines',
        }}
      />
    </div>
  );
};

export default I18Select;
