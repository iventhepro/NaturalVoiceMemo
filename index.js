const tectalicOpenai = require('@tectalic/openai').default;

tectalicOpenai("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")
  .chatCompletions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Will using a well designed and supported third party package save time?' }]
  })
  .then((response) => {
    console.log(response.data.choices[0].message.content.trim());
  });

document.getElementById("openai").addEventListener("click", main());

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

 

  console.log(completion.choices[0]);
}

 

main();