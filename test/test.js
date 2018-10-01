'use strict';

const assert     = require('assert');
const expect     = require('chai').expect;
const loopback   = require('loopback');
const supertestp = require('supertest-as-promised');

const api = supertestp('http://localhost:8000');

const LoopbackAllowedPropertiesMixin = require('../allowed-properties');

// -----------------------------------------------------------------------------
// SETUP LOOPBACK SERVER -------------------------------------------------------
const app    = module.exports = loopback();
const ds     = loopback.createDataSource('memory');

const Person = ds.createModel('Person', {}, { plural: 'persons' });

Person.remoteMethod('customMethod', {
  isStatic: true,
  http: {
    path: '/customMethod',
    verb: 'post'
  },
  accepts: [
    { arg: 'data', type: 'object', http: { source: 'body' } },
  ],
  returns: { root: true, type: 'object' }
});
Person.customMethod = function (data, cb) {
  process.nextTick(() => {
    cb(null, data);
  });
};

LoopbackAllowedPropertiesMixin(Person, {
  create: [
    'name',
    'email',
  ],
  'prototype.patchAttributes': [
    'name',
  ],
  'customMethod': [
    'attribute1',
    'attribute2'
  ],
  'find': [],
});

const Animal = ds.createModel('Animal', {}, { plural: 'animals' });
LoopbackAllowedPropertiesMixin(Animal);

const Thing = ds.createModel('Thing', {}, { plural: 'things' });
LoopbackAllowedPropertiesMixin(Thing, { create: true });

app.dataSource('ds', ds);
app.model(Person);
app.model(Animal);
app.model(Thing);
app.use(loopback.rest());
// SETUP LOOPBACK SERVER END ---------------------------------------------------

describe('#loopback-allowed-properties-mixin', () => {

  before((done) => {
    // Listen on HTTP requests
    app.listen(8000, done);
  });

  it('existing static method', (done) => {
    const data = {
      name: 'Alexander Rondon',
      email: 'arondn2@gmail.com',
      deparment: 'Development'
    };
    const dataExpected = {
      name: data.name,
      email: data.email,
    };
    api.post('/persons')
    .send(data)
    .expect(function(res) {
      dataExpected.id = res.body.id;
    })
    .expect(200, dataExpected, done);
  });

  it('existing prototype method', (done) => {
    const changes = {
      name: 'Alex J. Rondón',
      email: 'arondon@sirideas.com',
    };
    const dataExpected = {
      name: changes.name,
    }
    api.get('/persons')
    .expect(200)
    .then(function(res) {
      expect(res.body.length).to.equal(1);
      return res.body.shift();
    })
    .then((data) => {
      dataExpected.id = data.id;
      dataExpected.email = data.email;
      api.patch(`/persons/${data.id}`)
      .send(changes)
      .expect(200, dataExpected, done);
    });
  });

  it('custom static customMethod', (done) => {
    const body = {
      attribute1: 'attribute1',
      attribute2: 'attribute2',
      attribute3: 'attribute3',
    };
    const bodyExpected = {
      attribute1: 'attribute1',
      attribute2: 'attribute2',
    };
    api.post('/persons/customMethod')
    .send(body)
    .expect(200, bodyExpected, done);
  });

  after(() => {
    process.exit();
  });

});
