import React from 'react';
import { calculateRating, roundRating } from '../utils/helpers';


export class CalculatedDisabilityRating extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('props ratings: ', this.props)
        return (
            <div>
                Your rating is: {calculateRating(this.props.ratings)} %
            </div>
        )
    }
}