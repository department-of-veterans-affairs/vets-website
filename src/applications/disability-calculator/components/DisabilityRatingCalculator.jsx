import React from 'react';


export default class DisabilityRatingCalculator extends React.Component {

    state = {
        ratings: []
    }

    addRating() {
        this.setState({ ratings: [...this.state.ratings, ""] })
    }
    render() {
        return (
            <div className='calculator-container'>
                <h3>VA disability rating calculator</h3>
                <p>Use our calculator if you have more than one disability
                    rating to determine your VA comined disability rating
                </p>
                <label>Rating</label>
                {
                    this.state.ratings.map((rating, index) => {
                        return (
                            <div key={index}>
                                <input value={rating} />
                            </div>
                        )
                    })
                }
                <button className="usa-button-primary" onClick={(e) => this.addRating(e)}>Add rating</button>
                <button className="usa-button-primary">Submit</button>




            </div>
        )
    }
}