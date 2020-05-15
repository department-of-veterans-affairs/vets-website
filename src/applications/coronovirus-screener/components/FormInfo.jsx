import React from 'react';

class FormInfo extends React.Component {

  render() {
    return (
      <div className="usa-alert usa-alert-info">
        <div className="usa-alert-body">
          { this.props.children }
        </div>
      </div>
    )
  
}
}

export default FormInfo;