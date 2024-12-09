import { expect } from 'chai';
import {
  countKeywordsFound,
  countWholePhraseMatchesFound,
  createKeywordsArray,
  createOrderedResults,
  filterArticles,
  getKeywordCounts,
  getOrderedResults,
  getWholePhraseMatches,
} from '../../hooks/useGetSearchResults';
import articles from '../articles.json';

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

    it('should return the correct number of keywords found with no search string', () => {
      expect(countKeywordsFound('', '')).to.equal(1);
    });

    it('should return the correct number of keywords found with no search string', () => {
      expect(
        countKeywordsFound('Protect your identity with the VA', ''),
      ).to.equal(0);
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

    it('should return 0 if the whole search phrase does not match a result', () => {
      expect(
        countWholePhraseMatchesFound(
          'Protect your identity with the V',
          'Protect your identity with the VA',
        ),
      ).to.equal(0);
    });

    it('should return 0 if the whole search phrase matches a result', () => {
      expect(
        countWholePhraseMatchesFound('', 'Protect your identity with the VA'),
      ).to.equal(0);
    });

    it('should return a number matching the string length if the keyword is an empty string', () => {
      expect(
        countWholePhraseMatchesFound('Protect your identity with the VA', ''),
      ).to.equal(32);
    });

    it('should return -1 if both values given are empty', () => {
      expect(countWholePhraseMatchesFound('', '')).to.equal(-1);
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
      ).to.deep.equal([
        articles[4],
        articles[14],
        articles[31],
        articles[38],
        articles[49],
        articles[50],
      ]);
    });

    it('should correctly filter the articles down to the ones that match the keywords', () => {
      expect(filterArticles(articles, ['gi', 'bill'])).to.deep.equal([
        articles[31],
      ]);
    });

    it('should correctly filter the articles down to the ones that match the keywords', () => {
      expect(filterArticles(articles, ['active', 'duty'])).to.deep.equal([
        articles[5],
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
        keywordsCountsContent: 2,
        keywordsCountsIntroText: 2,
        keywordsCountsIntroTextAndContent: 4,
        keywordsCountsTitle: 0,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(
        getKeywordCounts(['protect', 'your', 'identity'], articles[5]),
      ).to.deep.equal({
        keywordsCountsContent: 1,
        keywordsCountsIntroText: 1,
        keywordsCountsIntroTextAndContent: 2,
        keywordsCountsTitle: 0,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(
        getKeywordCounts(['education', 'benefit'], articles[4]),
      ).to.deep.equal({
        keywordsCountsContent: 2,
        keywordsCountsIntroText: 1,
        keywordsCountsIntroTextAndContent: 3,
        keywordsCountsTitle: 1,
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
        wholePhraseMatchCountsContent: 1,
        wholePhraseMatchCountsIntroText: 1,
        wholePhraseMatchCountsTitle: 0,
        wholePhraseMatchCountsTotal: 2,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(
        getWholePhraseMatches('education benefit', articles[49]),
      ).to.deep.equal({
        wholePhraseMatchCountsContent: 2,
        wholePhraseMatchCountsIntroText: 1,
        wholePhraseMatchCountsTitle: 1,
        wholePhraseMatchCountsTotal: 4,
      });
    });

    it('should return the correct counts for a given article and keywords', () => {
      expect(getWholePhraseMatches('covid', articles[44])).to.deep.equal({
        wholePhraseMatchCountsContent: 3,
        wholePhraseMatchCountsIntroText: 2,
        wholePhraseMatchCountsTitle: 1,
        wholePhraseMatchCountsTotal: 6,
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

  describe('createOrderedResults', () => {
    it('should return ordered results as expected', () => {
      expect(createOrderedResults(articles, 'gi bill')).to.deep.equal([
        {
          ...articles[31],
          keywordsCountsContent: 6,
          keywordsCountsIntroText: 4,
          keywordsCountsIntroTextAndContent: 10,
          keywordsCountsTitle: 2,
          wholePhraseMatchCountsContent: 3,
          wholePhraseMatchCountsIntroText: 2,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 6,
        },
      ]);
    });

    it('should return ordered results as expected', () => {
      expect(createOrderedResults(articles, 'disability')).to.deep.equal([
        {
          ...articles[5],
          keywordsCountsContent: 2,
          keywordsCountsIntroText: 1,
          keywordsCountsIntroTextAndContent: 3,
          keywordsCountsTitle: 1,
          wholePhraseMatchCountsContent: 2,
          wholePhraseMatchCountsIntroText: 1,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 4,
        },
        {
          ...articles[38],
          keywordsCountsContent: 1,
          keywordsCountsIntroText: 1,
          keywordsCountsIntroTextAndContent: 2,
          keywordsCountsTitle: 1,
          wholePhraseMatchCountsContent: 1,
          wholePhraseMatchCountsIntroText: 1,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 3,
        },
      ]);
    });

    it('should return ordered results as expected', () => {
      expect(createOrderedResults(articles, 'benefits')).to.deep.equal([
        {
          ...articles[38],
          keywordsCountsContent: 0,
          keywordsCountsIntroText: 0,
          keywordsCountsIntroTextAndContent: 0,
          keywordsCountsTitle: 0,
          wholePhraseMatchCountsContent: 3,
          wholePhraseMatchCountsIntroText: 2,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 6,
        },
        {
          ...articles[31],
          keywordsCountsContent: 0,
          keywordsCountsIntroText: 0,
          keywordsCountsIntroTextAndContent: 0,
          keywordsCountsTitle: 0,
          wholePhraseMatchCountsContent: 3,
          wholePhraseMatchCountsIntroText: 2,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 6,
        },
        {
          ...articles[4],
          keywordsCountsContent: 0,
          keywordsCountsIntroText: 0,
          keywordsCountsIntroTextAndContent: 0,
          keywordsCountsTitle: 0,
          wholePhraseMatchCountsContent: 2,
          wholePhraseMatchCountsIntroText: 1,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 4,
        },
        {
          ...articles[49],
          keywordsCountsContent: 1,
          keywordsCountsIntroText: 1,
          keywordsCountsIntroTextAndContent: 2,
          keywordsCountsTitle: 1,
          wholePhraseMatchCountsContent: 1,
          wholePhraseMatchCountsIntroText: 0,
          wholePhraseMatchCountsTitle: 0,
          wholePhraseMatchCountsTotal: 1,
        },
        {
          ...articles[50],
          keywordsCountsContent: 1,
          keywordsCountsIntroText: 0,
          keywordsCountsIntroTextAndContent: 1,
          keywordsCountsTitle: 1,
          wholePhraseMatchCountsContent: 0,
          wholePhraseMatchCountsIntroText: 1,
          wholePhraseMatchCountsTitle: 0,
          wholePhraseMatchCountsTotal: 1,
        },
        {
          ...articles[14],
          keywordsCountsContent: 0,
          keywordsCountsIntroText: 1,
          keywordsCountsIntroTextAndContent: 1,
          keywordsCountsTitle: 0,
          wholePhraseMatchCountsContent: 0,
          wholePhraseMatchCountsIntroText: 0,
          wholePhraseMatchCountsTitle: 1,
          wholePhraseMatchCountsTotal: 1,
        },
      ]);
    });
  });
});
