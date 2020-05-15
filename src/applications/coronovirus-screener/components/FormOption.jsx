import React from 'react';

class FormOption extends React.Component {

  render() {
    return (
      <>
        <button type="button" className="usa-button usa-button-big" value={this.props.value} name={this.props.name}>
          { this.props.children }
        </button>
      </>
    )
  }
}

export default FormOption;