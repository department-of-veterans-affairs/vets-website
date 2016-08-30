import React from 'react';

import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';

class Detail extends React.Component {
  render() {
    return (
      <div>
        <BackLink/>
        <ContactCard/>
      </div>
    );
  }
}

export default Detail;
