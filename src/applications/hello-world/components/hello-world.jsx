import React from 'react';
import HelloWorldApi from '../api/HelloWorldApi';

export class HelloWorld extends React.PureComponent {
  async handleSubmit(event) {
    event.preventDefault();
    try {
      const form = this.getFormState();
      await HelloWorldApi.submitForm(form);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error');
    }
  }

  getFormState() {
    return {
      firstField: this.state.firstField,
    };
  }

  handleChangeFor = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    return (
      <div>
        <div className="message">Hello World</div>
        <form className="testForm" onSubmit={this.handleSubmit}>
          <h1>Hello World Form</h1>
          <label>
            TestEntry:
            <input
              type="text"
              name="test"
              onChange={this.handleChangeFor('firstField')}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default HelloWorld;
