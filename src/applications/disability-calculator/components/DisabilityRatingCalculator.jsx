import React from 'react';


export default class DisabilityRatingCalculator extends React.Component {

    state = {
        ratings: []
    }

    addRating() {
        this.setState({ ratings: [...this.state.ratings, ""] })
        console.log(this.state.ratings)
    }
    render() {
        return (
            <div className='calculator-container'>
                <h3>VA disability rating calculator</h3>
                <p>Use our calculator if you have more than one disability
                    rating to determine your VA comined disability rating
                </p>
                <div className="vads-l-grid-container">
                    <div className="vads-l-row">
                        <div className="vads-l-col--3 vads-u-padding-right--2">
                            Disability rating
                      </div>
                        <div className="vads-l-col--8">
                            Optional description
                      </div>
                    </div>
                    <div className="vads-l-row">
                        <div className="vads-l-col--2 vads-u-padding-right--2">
                            <input
                                type="number"
                            />
                        </div>
                        <div className="vads-l-col--8">
                            <input />
                        </div>
                        <div className="vads-l-col--2">
                            <button><i class="fas fa-trash-alt"></i></button> <a href="#">Delete</a>
                        </div>
                    </div>
                    {
                        this.state.ratings.map((rating, index) => {
                            return (
                                <div className="vads-l-row" key={index}>
                                    <div className="vads-l-col--2 vads-u-padding-right--2">
                                        <input value={rating} />
                                    </div>
                                    <div className="vads-l-col--8">
                                        <input />
                                    </div>
                                    <div className="vads-l-col--2">
                                        <button><i class="fas fa-trash-alt"></i></button> <a href="#">Delete</a>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {/* </div> */}
                    <br />
                    <div className="vads-l-grid-container">
                        <div className="vads-l-row">
                            <div className="vads-l-col--3">
                                <button onClick={(e) => this.addRating(e)}><i class="fas fa-plus-circle"></i></button><a onClick={(e) => this.addRating(e)}>Add rating</a>
                            </div>
                            <div className="vads-l-col--8">

                            </div>
                        </div>
                        <div className="vads-l-row">
                            <div className="vads-l-col--3 vads-u-padding-right--2">
                                <button className="usa-button-primary">Calculate</button>
                            </div>
                            <div className="vads-l-col--8">
                                <a href="#">Clear all</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="vads-u-font-weight--bold">This is your VA Rating:</p>
                    <div className="ratingContainer">
                        <p className="vads-u-font-size--h2">60%</p>
                    </div>
                    <p>Your actual combined disability rating is 64%/ We round this number
                        to the nearest 10% to get your <i>VA Disability rating </i>.
                        We round down values in 1 to 4, and round up values ending in 5 to 9.
                    </p>
                    <a href="#">Find your monthly amount</a>
                </div>

            </div>

        )
    }
}