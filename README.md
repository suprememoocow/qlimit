# qlimit

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/suprememoocow/qlimit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Q promises library helper to restrict the concurrency of q promises

```
npm install qlimit
```

## Reasoning

Sometimes you need to perform an operation operation over a large number of items. The usual way to handle this when using Q promises is to do something like this:

```javascript
return Q.all(items.map(function(item) { 
  return performOperationOnItem(item);
});
```

Each item will then be processed in parallel. 

If each execution of `performOperationOnItem` issues an HTTP request or database operation, you may find that this code quickly overwhelms the backend server, or the HTTP client times out before issuing the operation (by default the nodejs's global `HTTP.Agent` will issue 5 concurrent requests to any single host, the rest will be queued).  Too many concurrent connections may result in timeout errors though.

## Using `qlimit`

It's best explained with a code example:

```javascript
var qlimit = require('qlimit');
var limit = qlimit(2); // 2 being the maximum concurrency

// Using the same example as above
return Q.all(items.map(limit(function(item) { 
  return performOperationOnItem(item);
}));
```

`qlimit` can also be used to limit access to a specific resource, like this

```javascript
var qlimit = require('qlimit');
var limit = qlimit(2); // 2 being the maximum concurrency

function fetchSomethingFromEasilyOverwhelmedBackendServer(id) {
  return limit(function() {
    // Emulating the backend service
    return Q.delay(1000)
      .thenResolve({ hello: 'world' }); 
  });
}
```

In this example, calls can then be made to `fetchSomethingFromEasilyOverwhelmedBackendServer` with a
maximum concurrency of two. Callers do not need to worry about co-ordinating their calls.

# Licence

License
The MIT License (MIT)

Copyright (c) 2014, Andrew Newdigate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


