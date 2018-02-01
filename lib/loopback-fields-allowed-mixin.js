'use strict';

module.exports = function (Model, options) {
  
  Object.keys(options).map((methodName) => {

    var methods = options[methodName] instanceof Array? options[methodName] : [];

    Model.beforeRemote(methodName, (ctx, record, next) => {
      var body = ctx.req.body;

      if (body) {
        Object.keys(body).map((field) => {
          if (methods.indexOf(field) !== -1) return;
          delete body[field];
        });
      }

      process.nextTick(() => { next() });

    });
  });

};
