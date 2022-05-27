import React from 'react';
import { helloWorld } from '../api/HelloWorldApi';
export class TestForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            postSubmit: 'preSubmit'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.postSubmit);
        const res = helloWorld();
        console.log(res);
        this.setState({postSubmit: 'post submit'}, () => {
            console.log(this.state.postSubmit);
        });
    }

    render() {
        return (
        <form onSubmit={this.handleSubmit}>
            <label>
            Name:
            <input 
                type="text" 
                value={this.state.value} 
                onChange={this.handleChange} 
            />
            </label>
            <input 
                className='button' 
                type="submit" 
                value="Submit" 
                onClick={this.handleSubmit}
            />
        </form>
        );
    }
}

TestForm.defaultProps = {
    value: ''
}