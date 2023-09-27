import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "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",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
 

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

 

  console.log(completion.choices[0]);
}

 

main();