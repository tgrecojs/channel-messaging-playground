const IO = (run) => ({
  run,
  map: (f) => IO(() => f(run())),
  chain: (f) => IO(() => f(run()).run()),
  concat: (other) => IO(() => run().concat(other.run())),
});
IO.of = (x) => IO(() => x);

const Fn = (g) => ({
  map: (f) => Fn((x) => f(g(x))),
  chain: (f) => Fn((x) => f(g(x)).run(x)),
  concat: (other) => Fn((x) => g(x).concat(other.run(x))),
  run: g,
});
Fn.ask = Fn((x) => x);
Fn.of = (x) => Fn(() => x);

const sendMessageFromPort = (port) => (message) => port.postMessage(message);
const id = (x) => x;
const formatMessage = ({ data }) => `Message received by IFrame:  ${data} `;
const createEl = () => document.createElement("li");

const runPortSetup = (targetPort) =>
  Fn((env) => {
    env.port2 = targetPort;
    return env;
  });

const head = ([x, ...xs]) => x;

const setMessageHandler = (env) => {
  env.port2.onmessage = env.messageHandler;
  return env;
};
const setPortConfig = ({ ports }) =>
  runPortSetup(head(ports)).map(setMessageHandler);

const runAppendChild = (listItem) =>
  Fn((env) => {
    console.log({ env });
    env.list.appendChild(listItem);
    return env;
  });

const setTextContent =
  ({ data }) =>
  (el) => {
    el.textContent = data;
    return el;
  };

const runHandleMessage = (e) =>
  Fn.of(createEl())
    .map(setTextContent(e))
    .chain(runAppendChild)
    .chain(() => Fn((env) => sendMessageFromPort(env.port2)(formatMessage(e))));

const trace = (label) => (value) => {
  console.log(label, ":::", value);
  return value;
};
// Handle messages received on port2
function onMessage(e) {
  return runHandleMessage(e).map(trace("after handle message")).run(env);
}

const env = {
  list: document.querySelector("ul"),
  port2: null,
  messageHandler: onMessage,
};

// Listen for the intial port transfer message
window.addEventListener("message", (e) => setPortConfig(e).run(env));
