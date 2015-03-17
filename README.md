# pxy

Pxy (pronounced "pixie") proxies promises. It wraps a new promise (the proxy promise) around an existing promise (the original promise) and relays the resolution, rejection or notification of the original promise to the proxy promise.

The relaying of updates to all promises that are proxied by a Pxy instance are prevented when the Pxy instance is invalidated. 

Moreover, the Pxy instance can be told to recognize promises that are originating from different asynchronous operations (e.g. an HTTP fetch, a timeout, an audio playback, etc.) and cancel the pending operations.
