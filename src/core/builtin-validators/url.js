/*
Using modified Valid URL from https://github.com/ogt/valid-url/
Copyright (c) 2013 Odysseas Tsatalos and oDesk Corporation

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
function splitUri(uri) {
  return uri.match(
    /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  );
}

function isUri(value) {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  // check for illegal characters
  if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) {
    return false;
  }

  // check for hex escapes that aren't complete
  if (/%[^0-9a-f]/i.test(value) || /%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) {
    return false;
  }

  // from RFC 3986
  const splitted = splitUri(value);
  const scheme = splitted[1];
  const authority = splitted[2];
  const path = splitted[3];

  // scheme and path are required, though the path can be empty
  if (!(scheme && scheme.length && path.length >= 0)) {
    return false;
  }

  // if authority is present, the path must be empty or begin with a /
  if (authority && authority.length) {
    if (!(path.length === 0 || /^\//.test(path))) {
      return false;
    }
  } else {
    // if authority is not present, the path must not start with //
    if (/^\/\//.test(path)) {
      return false;
    }
  }

  // scheme must begin with a letter, then consist of letters, digits, +, ., or -
  if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) {
    return false;
  }
  return true;
}

export default value => {
  if (!isUri(value)) {
    return false;
  }

  // from RFC 3986
  const splitted = splitUri(value);
  const scheme = splitted[1];
  const authority = splitted[2];
  return authority && (scheme === "http" || scheme === "https");
};
