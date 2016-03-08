var lib = require('../index.js');
var should = require('should');

describe('color-to-hsla', function() {
  describe('strings', function() {
    it('should parse named colors', function() {
      lib('red').should.eql({h: 0, s: 1, l: .5, a: 1});
    });

    it('should parse HEX 3 values', function() {
      lib('#f00').should.eql({h: 0, s: 1, l: .5, a: 1});
    });

    it('should parse HEX 6 values', function() {
      lib('#ff0000').should.eql({h: 0, s: 1, l: .5, a: 1});
    });

    it('should parse RGB integer values', function() {
      lib('rgb(255, 0, 0)').should.eql({h: 0, s: 1, l: .5, a: 1});
    });

    it('should parse RGB percent values', function() {
      lib('rgb(100%, 0%, 0%)').should.eql({h: 0, s: 1, l: .5, a: 1});
    });

    it('should parse RGBA values', function() {
      lib('rgba(255, 0, 0, .5)').should.eql({h: 0, s: 1, l: .5, a: .5});
    });

    it('should parse HSLA values', function() {
      lib('hsla(0, 100%, 50%, .5)').should.eql({h: 0, s: 1, l: .5, a: .5});
    });
  });

  describe('objects', function() {
    it('should parse RGB objects', function() {
      lib({r: 255, g: 0, b: 0}).should.eql({h:0, s: 1, l: .5, a: 1});
    });

    it('should parse RGBA objects', function() {
      lib({r: 255, g: 0, b: 0, a: .5}).should.eql({h:0, s: 1, l: .5, a: .5});
    });

    it('should parse HSL objects', function() {
      lib({h: 0, s: 1, l: .5}).should.eql({h:0, s: 1, l: .5, a: 1});
    });

    it('should parse HSLA objects', function() {
      lib({h: 0, s: 1, l: .5, a: .5}).should.eql({h:0, s: 1, l: .5, a: .5});
    });

    it('should throw when object cannot be parsed', function() {
      (function(){ lib({}) }).should.throw(Error);
    });

    it('should throw when object\'s type value is missing', function() {
      (function(){ lib({r: 255, g: 0}) }).should.throw(Error);
      (function(){ lib({h: 0, s: 0}) }).should.throw(Error);
    });
  });
});
