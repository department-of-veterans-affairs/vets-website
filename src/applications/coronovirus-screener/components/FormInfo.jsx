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
      <div class="usa-alert usa-alert-info">
        <div class="usa-alert-body">
          { this.props.children }
        </div>
      </div>
    )
  
}
}

export default FormInfo;