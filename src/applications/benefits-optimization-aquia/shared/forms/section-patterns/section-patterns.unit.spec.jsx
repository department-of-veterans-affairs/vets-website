import { expect } from 'chai';
import sinon from 'sinon';

import {
  combineDataProcessors,
  conditionalProcessor,
  createFormSectionConfig,
} from './section-patterns';

describe('Section Patterns - Form configuration utilities', () => {
  describe('createFormSectionConfig', () => {
    it('creates reusable form section configurations', () => {
      const presetConfig = {
        sectionName: 'customSection',
        defaultData: { name: 'default' },
      };

      const getConfig = createFormSectionConfig(presetConfig);
      expect(getConfig).to.be.a('function');
    });

    it('merges preset defaults with custom overrides', () => {
      const presetConfig = {
        sectionName: 'section1',
        defaultData: { field: 'preset' },
      };

      const getConfig = createFormSectionConfig(presetConfig);
      const config = getConfig({
        sectionName: 'section2',
        extraField: 'added',
      });

      expect(config).to.deep.equal({
        sectionName: 'section2',
        defaultData: { field: 'preset' },
        extraField: 'added',
      });
    });

    it('uses preset config when no overrides given', () => {
      const presetConfig = {
        sectionName: 'preset',
        schema: 'testSchema',
        defaultData: { value: 100 },
      };

      const getConfig = createFormSectionConfig(presetConfig);
      const config = getConfig();

      expect(config).to.deep.equal(presetConfig);
    });
  });

  describe('combineDataProcessors', () => {
    it('chains multiple data transformations', () => {
      const processor1 = data => ({ ...data, step1: true });
      const processor2 = data => ({ ...data, step2: true });
      const processor3 = data => ({ ...data, step3: true });

      const combined = combineDataProcessors(
        processor1,
        processor2,
        processor3,
      );
      const result = combined({ initial: true });

      expect(result).to.deep.equal({
        initial: true,
        step1: true,
        step2: true,
        step3: true,
      });
    });

    it('skips null processors gracefully', () => {
      const processor1 = data => ({ ...data, processed: true });
      const combined = combineDataProcessors(processor1, null, undefined);

      const result = combined({ initial: true });

      expect(result).to.deep.equal({
        initial: true,
        processed: true,
      });
    });

    it('passes results through processor chain', () => {
      const processor1 = data => ({ ...data, value: data.value * 2 });
      const processor2 = data => ({ ...data, value: data.value + 10 });

      const combined = combineDataProcessors(processor1, processor2);
      const result = combined({ value: 5 });

      expect(result.value).to.equal(20); // (5 * 2) + 10
    });

    it('returns data unchanged without processors', () => {
      const combined = combineDataProcessors();
      const data = { unchanged: true };
      const result = combined(data);

      expect(result).to.deep.equal(data);
    });

    it('preserves original data immutability', () => {
      const originalData = { value: 1 };
      const processor = data => ({ ...data, value: data.value + 1 });
      const combined = combineDataProcessors(processor);

      combined(originalData);

      expect(originalData.value).to.equal(1);
    });
  });

  describe('conditionalProcessor', () => {
    it('applies transformation when condition met', () => {
      const condition = data => data.shouldProcess === true;
      const processor = data => ({ ...data, processed: true });

      const conditional = conditionalProcessor(condition, processor);
      const result = conditional({ shouldProcess: true, value: 1 });

      expect(result).to.deep.equal({
        shouldProcess: true,
        value: 1,
        processed: true,
      });
    });

    it('skips transformation when condition fails', () => {
      const condition = data => data.shouldProcess === true;
      const processor = data => ({ ...data, processed: true });

      const conditional = conditionalProcessor(condition, processor);
      const result = conditional({ shouldProcess: false, value: 1 });

      expect(result).to.deep.equal({
        shouldProcess: false,
        value: 1,
      });
    });

    it('evaluates complex conditional logic', () => {
      const condition = data => data.age >= 18 && data.hasConsent;
      const processor = data => ({ ...data, isEligible: true });

      const conditional = conditionalProcessor(condition, processor);

      const eligible = conditional({ age: 21, hasConsent: true });
      expect(eligible.isEligible).to.be.true;

      const notEligible = conditional({ age: 16, hasConsent: true });
      expect(notEligible.isEligible).to.be.undefined;
    });

    it('provides data to condition evaluator', () => {
      const conditionSpy = sinon.spy(() => true);
      const processor = data => data;

      const conditional = conditionalProcessor(conditionSpy, processor);
      const testData = { test: 'data' };
      conditional(testData);

      expect(conditionSpy.calledOnce).to.be.true;
      expect(conditionSpy.firstCall.args[0]).to.deep.equal(testData);
    });

    it('forwards data to processor after validation', () => {
      const condition = () => true;
      const processorSpy = sinon.spy(data => data);

      const conditional = conditionalProcessor(condition, processorSpy);
      const testData = { test: 'data' };
      conditional(testData);

      expect(processorSpy.calledOnce).to.be.true;
      expect(processorSpy.firstCall.args[0]).to.deep.equal(testData);
    });

    it('integrates with processor chains', () => {
      const condition1 = data => data.step1;
      const processor1 = data => ({ ...data, result1: true });

      const condition2 = data => data.step2;
      const processor2 = data => ({ ...data, result2: true });

      const combined = combineDataProcessors(
        conditionalProcessor(condition1, processor1),
        conditionalProcessor(condition2, processor2),
      );

      const result = combined({ step1: true, step2: false });
      expect(result).to.deep.equal({
        step1: true,
        step2: false,
        result1: true,
      });
    });

    it('supports data mutations within processors', () => {
      const condition = () => true;
      const processor = data => {
        const result = { ...data };
        delete result.toRemove;
        result.added = true;
        return result;
      };

      const conditional = conditionalProcessor(condition, processor);
      const result = conditional({ keep: 'this', toRemove: 'that' });

      expect(result).to.deep.equal({
        keep: 'this',
        added: true,
      });
    });

    it('processes empty objects correctly', () => {
      const condition = data => Object.keys(data).length === 0;
      const processor = () => ({ isEmpty: true });

      const conditional = conditionalProcessor(condition, processor);

      const emptyResult = conditional({});
      expect(emptyResult).to.deep.equal({ isEmpty: true });

      const nonEmptyResult = conditional({ hasData: true });
      expect(nonEmptyResult).to.deep.equal({ hasData: true });
    });
  });

  describe('edge cases', () => {
    describe('combineDataProcessors advanced', () => {
      it('handles undefined processor returns', () => {
        const processor1 = () => undefined;
        const processor2 = data => ({ ...(data || {}), step2: true });

        const combined = combineDataProcessors(processor1, processor2);
        const result = combined({ initial: true });

        expect(result).to.deep.equal({ step2: true });
      });

      it('transforms arrays through pipeline', () => {
        const processor1 = data => ({
          ...data,
          items: [1, 2, 3],
        });
        const processor2 = data => ({
          ...data,
          items: data.items.map(i => i * 2),
        });

        const combined = combineDataProcessors(processor1, processor2);
        const result = combined({});

        expect(result.items).to.deep.equal([2, 4, 6]);
      });

      it('preserves all JavaScript data types', () => {
        const processor = data => ({ ...data, processed: true });
        const combined = combineDataProcessors(processor);

        const input = {
          string: 'text',
          number: 42,
          boolean: false,
          null: null,
          undefined,
          array: [1, 2],
          object: { nested: true },
        };

        const result = combined(input);

        expect(result.string).to.be.a('string');
        expect(result.number).to.be.a('number');
        expect(result.boolean).to.be.a('boolean');
        expect(result.null).to.be.null;
        expect(result.undefined).to.be.undefined;
        expect(result.array).to.be.an('array');
        expect(result.object).to.be.an('object');
        expect(result.processed).to.be.true;
      });
    });

    describe('createFormSectionConfig advanced', () => {
      it('supports function values in config', () => {
        const presetConfig = {
          validator: () => true,
          formatter: value => value.toUpperCase(),
        };

        const getConfig = createFormSectionConfig(presetConfig);
        const config = getConfig();

        expect(config.validator).to.be.a('function');
        expect(config.formatter).to.be.a('function');
        expect(config.validator()).to.be.true;
        expect(config.formatter('test')).to.equal('TEST');
      });

      it('preserves Symbol keys in config', () => {
        const sym = Symbol('test');
        const presetConfig = {
          [sym]: 'symbol value',
          regular: 'regular value',
        };

        const getConfig = createFormSectionConfig(presetConfig);
        const config = getConfig({ extra: 'added' });

        expect(config[sym]).to.equal('symbol value');
        expect(config.regular).to.equal('regular value');
        expect(config.extra).to.equal('added');
      });
    });

    describe('conditionalProcessor errors', () => {
      it('throws on undefined property access', () => {
        const condition = data => data.nested.deep.value === true;
        const processor = data => ({ ...data, processed: true });

        const conditional = conditionalProcessor(condition, processor);

        expect(() => {
          const result = conditional({});
          expect(result).to.deep.equal({});
        }).to.throw();
      });

      it('allows in-place mutations', () => {
        const condition = () => true;
        const processor = data => {
          return Object.assign(data, { mutated: true });
        };

        const conditional = conditionalProcessor(condition, processor);
        const input = { original: true };
        const result = conditional(input);

        expect(result.mutated).to.be.true;
        expect(result.original).to.be.true;
        expect(input.mutated).to.be.true;
      });
    });

    describe('performance', () => {
      it('chains many processors efficiently', () => {
        const processors = [];
        for (let i = 0; i < 50; i++) {
          processors.push(data => ({ ...data, [`field${i}`]: i }));
        }

        const combined = combineDataProcessors(...processors);
        const result = combined({ initial: true });

        expect(result.initial).to.be.true;
        expect(result.field0).to.equal(0);
        expect(result.field49).to.equal(49);
        expect(Object.keys(result)).to.have.lengthOf(51);
      });

      it('processes recursive structures safely', () => {
        const processor = data => {
          if (data.level > 0) {
            return {
              ...data,
              level: data.level - 1,
              nested: processor({ level: data.level - 1 }),
            };
          }
          return { ...data, done: true };
        };

        const result = processor({ level: 3 });

        expect(result.level).to.equal(2);
        expect(result.nested.level).to.equal(1);
        expect(result.nested.nested.level).to.equal(0);
        expect(result.nested.nested.nested.done).to.be.true;
      });
    });
  });
});
