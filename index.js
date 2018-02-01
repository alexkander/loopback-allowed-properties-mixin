'use strict';

const AllowedProperties = require('./allowed-properties');

module.exports = unction (app) {
  app.loopback.modelBuilder.mixins.define('AllowedProperties', AllowedProperties);
};
