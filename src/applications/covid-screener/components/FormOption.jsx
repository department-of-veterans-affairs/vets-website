import React from 'react';

class FormOption extends React.Component {
  componentDidMount() {
    
  }

  updateField(name, value) {
    this.props.updateField(name, value);
    this.forceUpdate();
  }

  render() {
    return (
      <>
        <button type="button" className="usa-button usa-button-big">{ this.props.children }</button>
      </>
    )
  
}
}

export default FormOption;