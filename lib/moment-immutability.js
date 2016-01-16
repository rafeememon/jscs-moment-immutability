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

function isMutatorWithArgs (node) {
  return node.callee.type === 'MemberExpression' &&
    momentMutatorsWithArgs.indexOf(node.callee.property.name) !== -1 &&
    node.arguments.length > 0
}

function isMutatorNoArgs (node) {
  return node.callee.type === 'MemberExpression' &&
    momentMutatorsNoArgs.indexOf(node.callee.property.name) !== -1
}

function isMutator (node) {
  return isMutatorWithArgs(node) || isMutatorNoArgs(node)
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
