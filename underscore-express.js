var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var cache = {};

// Set the default template extension. Override as necessary.
_.templateExtension = 'underscore';

// Set the special express property for templating to work.
_.__express = function (abs, options, cb) {
  var sync = !cb;
  try {

    // Helper function for sub-templating, store the original value for nested
    // sub-templates.
    var dir = path.dirname(abs);
    options.include = function (rel) {
      var resolved = path.resolve(dir, rel + '.' + _.templateExtension);
      var include = options.include;
      var str = _.__express(resolved, options);
      options.include = include;
      return str;
    };

    // Check cache...
    var fn = options.cache && cache[abs];
    if (!fn) {
      if (sync) {
        var data = fs.readFileSync(abs, 'utf8');
        fn = cache[abs] = _.template(data, null, options);
      } else {
        return fs.readFile(abs, 'utf8', function (er, data) {
          if (er) return cb(er);
          fn = cache[abs] = _.template(data, null, options);
          cb(null, fn(options));
        });
      }
    }

    // Run and return template
    var str = fn(options);
    if (sync) return str;
    cb(null, str);
  } catch (er) {
    if (sync) throw er;
    cb(er);
  }
};
