const axios = require('axios');

require("dotenv").config();

const { App } = require("@slack/bolt");
const { text } = require("body-parser");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/curry-bot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/curry-bot-catfact", async ({ ack, respond }) => {
  await ack();

  await respond({text: "Thinking of a fact..."})

  try {
    const response = await axios.get("https://catfact.ninja/fact");
        await respond({ 
            text: `Cat Fact:\n${response.data.fact}`,
            replace_original: true
        });
    } catch (err) {
        await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/curry-bot-joke", async ({ ack, respond }) => {
  await ack();

  await respond({text:"Thinking of a joke..."})

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    
  
    await respond({
      text: `${response.data.setup} \n ${response.data.punchline}`,
      replace_original: true
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/curry-bot-quote", async ({ ack, respond }) => {
  await ack();

  await respond({text:"Thinking of a quote!..."})

  try {
    const response = await axios.get('https://dummyjson.com/quotes/random');

    const quote = response.data.quote; 
    const authorName = response.data?.author
 
    await respond({
      text: `Quote of the Day \n ${quote}\n _— ${authorName}_`,
      replace_original: true
    });
  } catch (err) {
    console.error("Slack bot error details:", err);
    await respond({ text: "Failed to fetch a quote", replace_original: true });
  }
});