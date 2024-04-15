import React from 'react';
import Lists from './Lists';
import { getHelpList } from '../constants';

const NeedHelp = () => {
  return (
    <div slot="content">
      <Lists
        className={{ li: 'vads-u-font-weight--bold', ul: 'list-style' }}
        items={getHelpList}
      />
    </div>
  );
};

export default NeedHelp;
