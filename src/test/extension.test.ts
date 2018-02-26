//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
import * as assert from 'assert';

import { getTranslationKeyFromString } from '../lib';

// The module 'assert' provides assertion methods from node
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Translation Key', () => {
  // Defines a Mocha unit test
  test('Replaces spaces with underscores', () => {
    assert.equal(
      getTranslationKeyFromString('THIS IS A TEST'),
      'THIS_IS_A_TEST'
    );
    assert.equal(
      getTranslationKeyFromString('this is a test'),
      'THIS_IS_A_TEST'
    );
  });

  test('Supports disabling autocapitalize', () => {
    assert.equal(
      getTranslationKeyFromString('this is a test', 'snake', false),
      'this_is_a_test'
    );
  });

  test('Supports camel case', () => {
    assert.equal(
      getTranslationKeyFromString('This is a test', 'camel', false),
      'thisIsATest'
    );
  });
});
