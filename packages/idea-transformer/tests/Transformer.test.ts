//test suite
import fs from 'fs';
import path from 'path';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//for testing
import Transformer from '../src/Transformer';
//resusable variables
const cwd = __dirname;
const idea = path.resolve(cwd, 'schema.idea');

describe('Transformer Tests', () => {
  it('Should get processed schema', () => {
    const transformer = new Transformer(idea, { cwd });
    const actual = transformer.schema;
    const output = actual.plugin?.['./in/make-enums'].output;
    expect(output).to.equal('./out/enums.ts');
    expect(actual.model && 'Profile' in actual.model).to.be.true;
    expect(actual.model && 'Auth' in actual.model).to.be.true;
    expect(actual.model && 'Connection' in actual.model).to.be.true;
    expect(actual.model && 'File' in actual.model).to.be.true;
    expect(actual.type && 'Address' in actual.type).to.be.true;
    expect(actual.type && 'Contact' in actual.type).to.be.true;
    expect(actual.enum && 'Roles' in actual.enum).to.be.true;
    expect(actual.prop && 'Config' in actual.prop).to.be.true;
    //merge checks
    expect(actual.model?.Profile?.columns[0].name).to.equal('id');
    expect(actual.model?.Profile?.columns[1].name).to.equal('addresses'); 
    expect(actual.model?.Profile?.columns[2].attributes.label?.[0]).to.equal('Full Name');
    //final checks
    expect(
      actual.model?.File?.columns.find(c => c.name === 'references')
    ).to.be.undefined; 
  }).timeout(20000);

  it('Should make enums', () => {
    const transformer = new Transformer(idea, { cwd });
    transformer.transform();
    const out = path.join(cwd, 'out/enums.ts');
    const exists = fs.existsSync(out);
    expect(exists).to.be.true;
    if (exists) {
      fs.unlinkSync(out);
    }
  }).timeout(20000);
});