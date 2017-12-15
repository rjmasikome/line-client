"use strict";

import { LineClient } from "../lib/Client";

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