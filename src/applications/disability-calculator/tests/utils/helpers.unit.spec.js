import { expect } from 'chai';
import { calculateRating, roundRating } from "../../utils/helpers";


describe('Disabilty  Caclulator helper', () => {
    it('should calculate ', () => {
        const result = calculateRating([30, 20, 10]);
        expect(result).to.be.equal(50);
    })
})