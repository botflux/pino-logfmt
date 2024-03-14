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
node examples/basic.js | pino-logfmt --flatten-nested --snake-case
level=30 time=1710427304769 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="hello world"
level=50 time=1710427304769 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="this is at error level"
level=30 time=1710427304769 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="the answer is 42"
level=30 time=1710427304769 pid=78824 hostname=MacBook-Pro-de-Victor-2.local obj=42 msg="hello world"
level=30 time=1710427304769 pid=78824 hostname=MacBook-Pro-de-Victor-2.local obj=42 b=2 msg="hello world"
level=30 time=1710427304769 pid=78824 hostname=MacBook-Pro-de-Victor-2.local nested_obj=42 msg=nested
level=50 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local err_type=Error err_message="an error" err_stack="Error: an error
    at Object.<anonymous> (/Users/victor/Documents/projects/pino-logfmt/node_modules/pino/examples/basic.js:21:12)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47" msg="an error"
level=30 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local a=property msg="hello child!"
level=30 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local a=property another=property msg="hello baby.."
level=20 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="this is a debug statement"
level=20 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local another=property msg="this is a debug statement via child"
level=10 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="this is a trace statement"
level=20 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="this is a \"debug\" statement with \""
level=30 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local err_type=Error err_message=kaboom err_stack="Error: kaboom
    at Object.<anonymous> (/Users/victor/Documents/projects/pino-logfmt/node_modules/pino/examples/basic.js:40:11)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47" msg=kaboom
level=30 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local
level=30 time=1710427304770 pid=78824 hostname=MacBook-Pro-de-Victor-2.local err_type=Error err_message=kaboom err_stack="Error: kaboom
    at Object.<anonymous> (/Users/victor/Documents/projects/pino-logfmt/node_modules/pino/examples/basic.js:43:11)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47" msg=with
level=30 time=1710427304771 pid=78824 hostname=MacBook-Pro-de-Victor-2.local msg="after setImmediate"
```

## Programmatic usage

```javascript
const pino = require("pino")

const logger = pino({
    transport: {
        target: "pino-logfmt",
        options: {
            flattenNestedObjects: true,
            convertToSnakeCase: true,
        }
    }
})

logger.info("Hello world")
```

### Options

| Name                     | Type               | Default       | Description                                                                                                                                                   |
|--------------------------|--------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `includeLevelLabel`      | `boolean`          | `false`       | Add the level as a label in each log entries                                                                                                                  |
| `levelLabelKey`          | `string`           | `"level_label"` | The name of the level label metadata. Only used if `includeLevelLabel` is enabled.                                                                            |
| `formatTime`             | `boolean`          | `false`       | Format pino's `time` field using Date.toISOString(). The `time` field will be overriden with the formatted date.                                              |
| `timeKey`                | `string`           | `"time"`        | The name of the key that holds the log timestamp.                                                                                                             |
| `convertToSnakeCase`     | `boolean`          | `false`       | Convert log field names to snake case.                                                                                                                        |
| `flattenNestedObjects`   | `boolean`          | `false`       | Flatten nested metadata (e.g. `{ error: { type: "Error", message: "Something went wrong" } }` becomes `error_type=Error error_message="Something went wrong"` |
| `flattenNestedSeparator` | `string`           | `"_"`           | The character that is used to merge keys when `flattenNestedObjects` is enabled.                                                                              |
| `destination`            | `string \| number` | `1`             | The destination where the transport will write to. By default, it logs to stdout but you can also provide a file name.                                        |


## CLI usage

The transport is also available using a CLI through. Almost all the options are available as CLI arguments.
Like other CLIs, you can print the help message using `--help` as followed:

```shell
npx pino-logfmt --help

Usage: pino-logfmt [options]

Logfmt transport for pino

Options:
  -V, --version          output the version number
  --include-level-label  add the level as a label (default: false)
  --level-label-key      the key of the level label
  --format-time          format the timestamp into an ISO date (default: false)
  --time-key             the key that holds the timestamp
  --snake-case           convert the keys to snake case (default: false)
  --flatten-nested       flatten nested metadata (default: false)
  --flatten-separator    the separator used when flattening nested metadata
  -h, --help             display help for command
```

```shell
node process-that-emits-logs.js | pino-logfmt
```

### Flags

| Name                    | Type               | Default       | Description                                                                                                                                                   |
|-------------------------|--------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--include-level-label` | `boolean`          | `false`       | Add the level as a label in each log entries                                                                                                                  |
| `--level-label-key`     | `string`           | `"level_label"` | The name of the level label metadata. Only used if `includeLevelLabel` is enabled.                                                                            |
| `--format-time`         | `boolean`          | `false`       | Format pino's `time` field using Date.toISOString(). The `time` field will be overriden with the formatted date.                                              |
| `--time-key`            | `string`           | `"time"`        | The name of the key that holds the log timestamp.                                                                                                             |
| `--snake-case`          | `boolean`          | `false`       | Convert log field names to snake case.                                                                                                                        |
| `--flatten-nested`      | `boolean`          | `false`       | Flatten nested metadata (e.g. `{ error: { type: "Error", message: "Something went wrong" } }` becomes `error_type=Error error_message="Something went wrong"` |
| `--flatten-separator`   | `string`           | `"_"`           | The character that is used to merge keys when `flattenNestedObjects` is enabled.                                                                              |

## Known issues

- Stack traces (and others multi-line strings) are not escaped
- Time formatting can be faster
- Custom levels are not supported yet
- Case formatting can be faster (I don't know I need to test through in a benchmark)
