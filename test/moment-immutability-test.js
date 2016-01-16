/* eslint-env mocha */
var MomentImmutabilityRule = require('..')
var Checker = require('jscs')
var expect = require('chai').expect

function expectErrors (count, results) {
  var errors = results.getErrorList()
  expect(errors).to.have.length(count)
  errors.forEach(function (error) {
    expect(error).to.have.property('rule', 'momentImmutability')
  })
}

describe('moment-immutability', function () {
  var checker

  beforeEach(function () {
    checker = new Checker()
    checker.registerDefaultRules()
    checker.configure({
      additionalRules: [new MomentImmutabilityRule()],
      momentImmutability: true
    })
  })

  it('should report for a mutator requiring args', function () {
    expectErrors(1, checker.checkString('m.year(2016)'))
  })

  it('should not report for a mutator requiring args with a clone', function () {
    expectErrors(0, checker.checkString('m.clone().year(2016)'))
  })

  it('should not report for a mutator requiring args as a getter', function () {
    expectErrors(0, checker.checkString('m.year()'))
  })

  it('should not report for a standalone mutator requiring args', function () {
    expectErrors(0, checker.checkString('year(2016)'))
  })

  it('should report for a mutator not requiring args', function () {
    expectErrors(1, checker.checkString('m.utc()'))
  })

  it('should not report for a standalone mutator not requiring args', function () {
    expectErrors(0, checker.checkString('utc'))
  })

  it('should not report for a mutator not requiring args with a clone', function () {
    expectErrors(0, checker.checkString('m.clone().utc()'))
  })

  it('should report for multiple mutators', function () {
    expectErrors(2, checker.checkString('m.year(2016).month(0)'))
  })

  it('should not report for multiple mutators with a clone', function () {
    expectErrors(0, checker.checkString('m.clone().year(2016).month(0)'))
  })
})
