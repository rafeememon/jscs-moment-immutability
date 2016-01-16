var assert = require('assert')

var momentMutatorsWithArgs = [
  'startOf',
  'endOf',
  'utcOffset',
  'zone',
  'millisecond',
  'milliseconds',
  'second',
  'seconds',
  'minute',
  'minutes',
  'hour',
  'hours',
  'date',
  'dates',
  'day',
  'days',
  'weekday',
  'isoWeekday',
  'dayOfYear',
  'week',
  'weeks',
  'isoWeek',
  'isoWeeks',
  'month',
  'months',
  'quarter',
  'year',
  'years',
  'weekYear',
  'isoWeekYear'
]

var momentMutatorsNoArgs = [
  'local',
  'utc'
]

var momentUnits = [
  'year',
  'years',
  'y',
  'month',
  'months',
  'm',
  'date',
  'dates',
  'D',
  'day',
  'days',
  'd',
  'hour',
  'hours',
  'h',
  'minute',
  'minutes',
  'm',
  'second',
  'seconds',
  's',
  'millisecond',
  'milliseconds',
  'ms'
]

function contains (values, value) {
  return values.indexOf(value) !== -1
}

function isMutatorWithArgs (node) {
  return node.callee.type === 'MemberExpression' &&
    contains(momentMutatorsWithArgs, node.callee.property.name) &&
    node.arguments.length > 0
}

function isMutatorNoArgs (node) {
  return node.callee.type === 'MemberExpression' &&
    contains(momentMutatorsNoArgs, node.callee.property.name)
}

function isAddSubtractMutator (node) {
  return node.callee.type === 'MemberExpression' &&
    contains(['add', 'subtract'], node.callee.property.name) &&
    node.arguments.length === 2 &&
    contains(momentUnits, (node.arguments[1].value + '').toLowerCase())
}

function isSetMutator (node) {
  return node.callee.type === 'MemberExpression' &&
    node.callee.property.name === 'set' &&
    node.arguments.length === 2 &&
    contains(momentUnits, (node.arguments[0].value + '').toLowerCase())
}

function isMutator (node) {
  return isMutatorWithArgs(node) ||
    isMutatorNoArgs(node) ||
    isAddSubtractMutator(node) ||
    isSetMutator(node)
}

function hasClone (node) {
  if (node.type === 'CallExpression') {
    if (node.callee.type === 'MemberExpression' &&
        node.callee.property.name === 'clone') {
      return true
    } else {
      return hasClone(node.callee.object)
    }
  } else {
    return false
  }
}

module.exports = function () {}

module.exports.prototype = {
  configure: function (options) {
    assert(
      options === true,
      this.getOptionName() + ' option requires a true value or should be removed'
    )
  },

  getOptionName: function () {
    return 'momentImmutability'
  },

  check: function (file, errors) {
    file.iterateNodesByType(['CallExpression'], function (node) {
      if (isMutator(node) && !hasClone(node)) {
        errors.add('Clone required for moment.js operations', node.callee.property.loc.start)
      }
    })
  }
}
