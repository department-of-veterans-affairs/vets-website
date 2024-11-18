import { expect } from 'chai';
import {
  countKeywordsFound,
  countWholePhraseMatchesFound,
  createKeywordsArray,
  filterArticles,
  getKeywordCounts,
  getOrderedResults,
  getWholePhraseMatches,
} from '../../hooks/useGetSearchResults';
import articles from '../components/articles.json';

describe('Resources and Support hooks', () => {
  describe('countKeywordsFound', () => {
    it('should return the correct number of keywords found when there are no matches', () => {
      expect(
        countKeywordsFound('Change your address on file with VA', 'identity'),
      ).to.equal(0);
    });

    it('should return the correct number of keywords found', () => {
      expect(
        countKeywordsFound('Protect your identity with the VA', 'identity'),
      ).to.equal(1);
    });

    it('should return the correct number of keywords found', () => {
      expect(countKeywordsFound('', 'protect')).to.equal(0);
    });
  });

  describe('countWholePhraseMatchesFound', () => {
    it('should return 1 if the whole search phrase matches a result', () => {
      expect(
        countWholePhraseMatchesFound(
          'Protect your identity with the VA',
          'Protect your identity with the VA',
        ),
      ).to.equal(1);
    });

    it('should return 0 if the whole search phrase matches a result', () => {
      expect(
        countWholePhraseMatchesFound(
          'Protect your identity with the V',
          'Protect your identity with the VA',
        ),
      ).to.equal(0);
    });
  });

  describe('createKeywordsArray', () => {
    it('should return the correct array of keywords for a query', () => {
      expect(createKeywordsArray('Protect your identity')).to.deep.equal([
        'protect',
        'your',
        'identity',
      ]);
    });

    it('should return the correct array of keywords for a query', () => {
      expect(
        createKeywordsArray('benefits for families of the deceased'),
      ).to.deep.equal(['benefit', 'famil', 'deceased']);
    });

    it('should return an empty array when the keywords are blank', () => {
      expect(createKeywordsArray('')).to.deep.equal([]);
    });

    it('should return the correct array of keywords for a query', () => {
      expect(
        createKeywordsArray(
          `here's a long search string with weird characters @#$%sdjsa0 and short words of it to`,
        ),
      ).to.deep.equal([
        "here'",
        'long',
        'search',
        'string',
        'weird',
        'character',
        '@#$%sdjsa0',
        'short',
        'word',
        'it',
      ]);
    });
  });

  describe('filterArticles', () => {
    it('should correctly filter the articles down to the ones that match the keywords', () => {
      expect(
        filterArticles(articles, ['benefit', 'famil', 'deceased']),
      ).to.deep.equal(articles.slice(0, 10));
    });

    it('should correctly filter the articles down to the ones that match the keywords', () => {
      expect(filterArticles(articles, ['gi', 'bill'])).to.deep.equal([
        articles[3],
        articles[6],
      ]);
    });

    it('should return no articles when none match the given keywords', () => {
      expect(filterArticles(articles, ['discharge', 'upgrade'])).to.deep.equal(
        [],
      );
    });
  });

  describe('getKeywordCounts', () => {
    it('should return the correct counts for a given article and keywords', () => {
      expect(getKeywordCounts(['gi', 'bill'], articles[3])).to.deep.equal({
        keywordsCountsContent: 0,
        keywordsCountsIntroText: 0,
        keywordsCountsIntroTextAndContent: 0,
        keywordsCountsTitle: 2,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(
        getKeywordCounts(['protect', 'your', 'identity'], articles[5]),
      ).to.deep.equal({
        keywordsCountsContent: 0,
        keywordsCountsIntroText: 0,
        keywordsCountsIntroTextAndContent: 0,
        keywordsCountsTitle: 4,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(getKeywordCounts([], articles[3])).to.deep.equal({
        keywordsCountsContent: 0,
        keywordsCountsIntroText: 0,
        keywordsCountsIntroTextAndContent: 0,
        keywordsCountsTitle: 0,
      });
    });

    it('should return zeroes when there are no keyword matches', () => {
      expect(getKeywordCounts(['bananas'], articles[2])).to.deep.equal({
        keywordsCountsContent: 0,
        keywordsCountsIntroText: 0,
        keywordsCountsIntroTextAndContent: 0,
        keywordsCountsTitle: 0,
      });
    });
  });

  describe('getWholePhraseMatches', () => {
    it('should return the correct counts for a given article and keywords', () => {
      expect(getWholePhraseMatches('gi bill', articles[3])).to.deep.equal({
        wholePhraseMatchCountsContent: 0,
        wholePhraseMatchCountsIntroText: 0,
        wholePhraseMatchCountsTitle: 1,
        wholePhraseMatchCountsTotal: 1,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(
        getWholePhraseMatches('education benefit', articles[0]),
      ).to.deep.equal({
        wholePhraseMatchCountsContent: 1,
        wholePhraseMatchCountsIntroText: 1,
        wholePhraseMatchCountsTitle: 1,
        wholePhraseMatchCountsTotal: 3,
      });
    });

    it('should return zeroes when there are no matches', () => {
      expect(getWholePhraseMatches('test', articles[1])).to.deep.equal({
        wholePhraseMatchCountsContent: 0,
        wholePhraseMatchCountsIntroText: 0,
        wholePhraseMatchCountsTitle: 0,
        wholePhraseMatchCountsTotal: 0,
      });
    });
  });

  describe('getOrderedResults', () => {
    const filteredArticles = [
      {
        title:
          'Will I have to pay back the GI Bill benefits I used if I fail a class?',
        keywordsCountsContent: 6,
        keywordsCountsIntroText: 4,
        keywordsCountsIntroTextAndContent: 10,
        keywordsCountsTitle: 4,
        wholePhraseMatchCountsContent: 3,
        wholePhraseMatchCountsIntroText: 2,
        wholePhraseMatchCountsTitle: 1,
        wholePhraseMatchCountsTotal: 6,
      },
      {
        title: 'Montgomery GI Bill refunds',
        keywordsCountsContent: 20,
        keywordsCountsIntroText: 2,
        keywordsCountsIntroTextAndContent: 22,
        keywordsCountsTitle: 2,
        wholePhraseMatchCountsContent: 11,
        wholePhraseMatchCountsIntroText: 1,
        wholePhraseMatchCountsTitle: 1,
        wholePhraseMatchCountsTotal: 13,
      },
      {
        title: 'GI Bill and other VA education benefit payments FAQs',
        keywordsCountsContent: 20,
        keywordsCountsIntroText: 2,
        keywordsCountsIntroTextAndContent: 0,
        keywordsCountsTitle: 2,
        wholePhraseMatchCountsContent: 15,
        wholePhraseMatchCountsIntroText: 3,
        wholePhraseMatchCountsTitle: 10,
        wholePhraseMatchCountsTotal: 13,
      },
    ];

    it('should return the articles ordered correctly', () => {
      expect(getOrderedResults(filteredArticles)).to.deep.equal([
        filteredArticles[1],
        filteredArticles[2],
        filteredArticles[0],
      ]);
    });
  });
});
