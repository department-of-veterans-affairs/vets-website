import React from 'react';

export default class CurrencyWidget extends React.Component {
  onBlur = () => {
    this.props.onBlur(this.props.id);
  }

  handleChange = (event) => {
    const val = event.target.value;
    if (val === '') {
      this.props.onChange();
    } else {
      // Sometimes we get a string back (e.g. when you enter 10.00)
      // so we need to parse it to be sure
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        this.props.onChange(parsed);
      } else {
        this.props.onChange(val);
      }
    }
  }

  render() {
    let val = this.props.value;
    if (typeof val === 'number') {
      val = val.toFixed(2);
    }

    return (
      <input type="number"
          id={this.props.id}
          name={this.props.id}
          disabled={this.props.disabled}
          autoComplete={this.props.options.autocomplete || false}
          className={this.props.options.widgetClassNames}
          value={typeof val === 'undefined' ? '' : val}
          onBlur={this.onBlur}
          onChange={this.handleChange}/>
    );
  }
}
