# line-client
LINE (Messenger) Notify client for nodejs. Based on [LINE notify](https://notify-bot.line.me/doc/en/). This works for both Promise and classic callback function. If callback is not passed as parameter, it will return Promise.

### Requirement
1. `node` > 8
2. API Key (Generate Token) from [LINE notify](https://notify-bot.line.me/my/)

### How to use
1. `npm install line-client`
2. For example:
```js
const { LineClient } = require("line-client");
const client = new LineClient("x1hkj4apoiidKuK32lH9dPwOs5uh5fBk7rPogoz");

client.notify({message: "foo"})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log("Error", err);
});

client.notify("testing", (err, res) => {
  if (err) {
    console.log("Error", err);
  }
  console.log(res);
});
```