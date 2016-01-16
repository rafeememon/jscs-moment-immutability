# jscs-moment-immutability
JSCS rule to enforce immutability of moment.js objects

[![build status](https://img.shields.io/travis/rafeememon/node-sql-composer/master.svg)](https://travis-ci.org/rafeememon/jscs-moment-immutability)
[![npm version](https://img.shields.io/npm/v/jscs-moment-immutability.svg)](https://www.npmjs.com/package/jscs-moment-immutability)

## Description

[Moment.js](http://momentjs.com/) objects are [not immutable](https://github.com/moment/moment/issues/1754), and it is easy to forget this when performing operations with them, leading to subtle bugs. This [JSCS](http://jscs.info/) rule checks that mutation operations on moment objects are "safe" by enforcing a clone or a new object construction before the mutation.

## Usage

```
$ npm install --save-dev jscs-moment-immutability
```

In .jscsrc:

```js
{
  ...
  "additionalRules": ["jscs-moment-immutability"],
  "momentImmutability": true,
  ...
}
```

## Rules

```js
m.year(2016) // invalid
m.clone().year(2016) // valid
moment(m).year(2016) // valid

m.add(1, 'day') // invalid
m.clone().add(1, 'day') // valid
moment(m).add(1, 'day') // valid

m.set('year', 2016) // invalid
m.clone().set('year', 2016) // valid
moment(m).set('year', 2016) // valid
```

## License

MIT
