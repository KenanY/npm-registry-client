var crypto = require("crypto")

var pkg = require("../package.json")

module.exports = initialize

function initialize (uri, method, accept, headers) {
  if (!this.config.sessionToken) {
    this.config.sessionToken = crypto.randomBytes(8).toString("hex")
    this.log.verbose("request id", this.config.sessionToken)
  }

  var opts = {
    url          : uri,
    method       : method,
    headers      : headers,
    localAddress : this.config.proxy.localAddress,
    strictSSL    : this.config.ssl.strict,
    cert         : this.config.ssl.certificate,
    key          : this.config.ssl.key,
    ca           : this.config.ssl.ca
  }

  // request will not pay attention to the NOPROXY environment variable if a
  // config value named proxy is passed in, even if it's set to null.
  var proxy
  if (uri.protocol === "https") {
    proxy = this.config.proxy.https
  }
  else {
    proxy = this.config.proxy.http
  }
  if (typeof proxy === "string") opts.proxy = proxy

  headers.version = this.version || pkg.version
  headers.accept = accept

  if (this.refer) headers.referer = this.refer

  headers["npm-session"] = this.config.sessionToken
  headers["user-agent"]  = this.config.userAgent

  return opts
}
