/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Kenny Wang @jaywcjlove
*/

const loaderUtils = require('loader-utils');
const FS = require('fs');
const PATH = require('path');
const mkdirp = require('mkdirp');

module.exports = function (content) {
  const options = loaderUtils.getOptions(this) || {}
  const { dir, filename, sep = "dir" } = options;
  this.cacheable && this.cacheable();
  this.value = content;
  const cb = this.async();
  Promise.resolve().then(() => {
    if (dir) {
      if (this.resourcePath.indexOf(dir) > -1) {
        return cb(null, "module.exports = " + JSON.stringify(content));
      }
      let filenameString = this.resourcePath.replace(this.context + PATH.sep, '');
      let writePath = PATH.resolve(process.cwd(), dir);
      if (filename && filename === 'underline') {
        const underlineFileName = this.resourcePath.replace(process.cwd() + PATH.sep, '').split(PATH.sep).join(sep || '__')
        writePath = PATH.resolve(writePath, underlineFileName);
      } else {
        writePath = PATH.join(writePath, this.resourcePath.replace(process.cwd() + PATH.sep, ''));
      }
      mkdirp(PATH.dirname(writePath), (err) => {
        FS.writeFile(writePath, JSON.stringify(content), (err) => {
          if (err) {
            this.emitError('\r\nWrite to directory failed: ' + err);
            return cb(err);
          }
          cb(null, "module.exports = " + JSON.stringify(content));
        })
      })
    } else {
      cb(null, "module.exports = " + JSON.stringify(content));
    }
  }).catch((err) => {
    return err ? cb(new SyntaxError(err)) : cb(err)
  })
}
module.exports.seperable = true;
