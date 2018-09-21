'use strict';

const AllowedProperties = require('./allowed-properties');

module.exports = function (app) {
  app.loopback.modelBuilder.mixins.define('AllowedProperties', AllowedProperties);
};
