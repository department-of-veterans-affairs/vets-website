import React from 'react';

class FormInfo extends React.Component {
  componentDidMount() {
    
  }

  updateField(name, value) {
    this.props.updateField(name, value);
    this.forceUpdate();
  }

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