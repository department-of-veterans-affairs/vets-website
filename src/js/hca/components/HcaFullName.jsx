import React from 'react';
import FullName from '../../common/components/questions/FullName';
import { lastNameCharMin } from '../../common/utils/validations';

class HcaFullName extends React.Component {
  render() {
    return (
      <FullName {...this.props} lastNameCharMin={lastNameCharMin}/>
    );
  }
}

export default HcaFullName;
