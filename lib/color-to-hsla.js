/**
 * Module dependencies
 */

var regexps = require('./regexps');
var named = require('./named');

exports['default'] = module.exports = colorToHsla;

/**
 * Parse any valid color string or color object and return HSLA values
 * {Object|String} format
 */

function colorToHsla(format) {
  if (typeof format === 'string') return parseString(format);
  if (typeof format !== 'object') throw new Error('Must pass string or object');
  var a = format.a == null ? 1 : format.a;
  if (has(format, 'hsl')) return hsla(format.h, format.s, format.l, a);
  if (has(format, 'rgb')) return rgbaToHsla(format.r, format.g, format.b, a);
  throw new Error('Could not parse argument');
}

function has(obj, type) {
  var keys = type.split('');
  var isType;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (typeof obj[key] !== 'undefined') {
      isType = true;
    } else if (obj[key] == null && isType) {
      throw new Error('Missing key "' + key + '" in color type ' + type);
    }
  }
  return !!isType;
}

function parseString(string) {
  var m;
  string = (string + '').trim().toLowerCase();
  return (m = regexps.reHslPercent.exec(string)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
    : (m = regexps.reHslaPercent.exec(string)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
    : (m = regexps.reHex3.exec(string)) ? (m = parseInt(m[1], 16), rgbaToHsla((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
    : (m = regexps.reHex6.exec(string)) ? rgbn(parseInt(m[1], 16)) // #ff0000
    : (m = regexps.reRgbInteger.exec(string)) ? rgbaToHsla(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
    : (m = regexps.reRgbPercent.exec(string)) ? rgbaToHsla(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
    : (m = regexps.reRgbaInteger.exec(string)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
    : (m = regexps.reRgbaPercent.exec(string)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
    : named.hasOwnProperty(string) ? rgbn(named[string])
    : string === 'transparent' ? rgbaToHsla(NaN, NaN, NaN, 0)
    : null;
}

function rgbn(n) {
  return rgbaToHsla(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  return rgbaToHsla(r, g, b, a);
}

function rgbaToHsla(R, G, B, A) {
  var r = +R / 255;
  var g = +G / 255;
  var b = +B / 255;
  var a = +A;
  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var h = NaN;
  var s = max - min;
  var l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return {h: h, s: s, l: l, a: a};
}

function hsla(H, S, L, A) {
  return {h: +H, s: +S, l: +L, a: +A};
}
