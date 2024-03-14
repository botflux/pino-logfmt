# pino-logfmt

This package provides a transport that transforms standard pino logs to logfmt.

A standard Pino log line like: 

```
{"level":30,"time":1522431328992,"msg":"hello world","pid":42,"hostname":"foo","v":1}
```

Will format to:

```
level=30 time=1522431328992 msg="hello world" pid=42 hostname=foo v=1
```

## Install

```shell
npm install pino-logfmt
```

## Example

Using the [example script](https://github.com/pinojs/pino/blob/25ba61f40ea5a1a753c85002812426d765da52a4/examples/basic.js) from the Pino module, we can see what the prettified logs will look like:

```shell
node examples/basic.js | pino-logfmt
level=30 time=1710258323886 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="hello world"
level=50 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="this is at error level"
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="the answer is 42"
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local obj=42 msg="hello world"
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local obj=42 b=2 msg="hello world"
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local nested="[object Object]" msg=nested
level=50 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local err="[object Object]" msg="an error"
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local a=property msg="hello child!"
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local a=property another=property msg="hello baby.."
level=20 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="this is a debug statement"
level=20 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local another=property msg="this is a debug statement via child"
level=10 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="this is a trace statement"
level=20 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="this is a \"debug\" statement with \""
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local err="[object Object]" msg=kaboom
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg=
level=30 time=1710258323887 pid=82999 hostname=MacBook-Pro-de-Victor-2.local err="[object Object]" msg=with
level=30 time=1710258323888 pid=82999 hostname=MacBook-Pro-de-Victor-2.local msg="after setImmediate"

```

## Programmatic usage

```javascript
const pino = require("pino")

const logger = pino({
    transport: {
        target: "pino-logfmt"
    }
})

logger.info("Hello world")
```


## CLI usage

