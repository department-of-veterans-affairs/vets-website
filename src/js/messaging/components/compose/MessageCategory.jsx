import React from 'react';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';

class MessageCategory extends React.Component {
  render() {
    const categories = this.props.categories;

    return (
      <div className={this.props.cssClass}>
        <ErrorableSelect
            additionalClass={`${this.props.cssClass}-category`}
            label="Category"
            name="messageCategory"
            onValueChange={this.props.onValueChange}
            options={categories}
            value={this.props.category}/>
      </div>
    );
  }
}

MessageCategory.propTypes = {
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  categories: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.number }),
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.string }),
    ])).isRequired,
  category: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired
};

export default MessageCategory;
