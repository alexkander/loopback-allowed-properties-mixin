loopback-allowed-properties-mixin
===============

[![npm version](https://badge.fury.io/js/loopback-allowed-properties-mixin.svg)](https://badge.fury.io/js/loopback-allowed-properties-mixin) [![Build Status](https://travis-ci.org/arondn2/loopback-allowed-properties-mixin.svg?branch=master)](https://travis-ci.org/arondn2/loopback-allowed-properties-mixin)
[![Coverage Status](https://coveralls.io/repos/github/arondn2/loopback-allowed-properties-mixin/badge.svg?branch=master)](https://coveralls.io/github/arondn2/loopback-allowed-properties-mixin?branch=master)

Loopback mixin to set what fields can be written in a request.

## Installation

`npm install loopback-allowed-properties-mixin --save`

## Usage

Add the mixins property to your `server/model-config.json`:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../node_modules/loopback-allowed-properties-mixin",
      "../common/mixins"
    ]
  }
}
```

Add mixin params in model definition. Example:
```
{
  "name": "Person",
  "properties": {
    "name": "string",
    "email": "string",
    "status": "string",
  },
  "mixins": {
    "AllowedProperties": {
      "create": [
        "name",
        "email"
      ],
      "prototype.patchAttributes": [
        "name"
      ],
      "setStatus": [
        "status"
      ]
    }
  }
}
```

In the above definition, `create` method will only recieve the request body with properties `name` and `email`, `prototype.patchAttributes` method will only recieve the request body with `name` attribute and finally `setStatus` method will only recieve `status` attribute in the body request.

## Troubles

If you have any kind of trouble with it, just let me now by raising an issue on the GitHub issue tracker here:

https://github.com/arondn2/loopback-allowed-properties-mixin/issues

Also, you can report the orthographic errors in the READMEs files or comments. Sorry for that, English is not my main language.

## Tests

`npm test` or `npm run cover`
