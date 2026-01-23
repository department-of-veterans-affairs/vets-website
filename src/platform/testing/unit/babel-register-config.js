/**
 * Configure @babel/register to handle TypeScript files
 * This file must be required BEFORE @babel/register in mocha.json
 */

// Set environment variables for Babel
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Configure @babel/register with TypeScript extensions
require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es'],
});
