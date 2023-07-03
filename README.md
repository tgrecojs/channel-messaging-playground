## Channel Message Playground

> The Channel Messaging API allows two separate scripts running in different browsing contexts attached to the same document (e.g., two <iframe> elements, the main document and a single <iframe>, or two documents via a SharedWorker) to communicate directly, passing messages between each other through two-way channels (or pipes) with a port at each end.

- [Channel Messaging API - Mozilla Developer Docs](http://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging)

### Demo #1

1. A `MessageChannel` object is created in the context of `index.html`.
2. Transfer `port2` from the `MessageChannel` object so that `page2.html` can gain access to it.
3. When a new text node is added...
   - a list item is created inside `page2.html`.
   - `port1.postMessage` is used to update the `textContent` attribute of the `#message-output` paragraph element.

![channel messaging demo video](https://storage.fleek-internal.com/tgrecojs-74725-team-bucket/securejs/channel-message-demo.mp4)
