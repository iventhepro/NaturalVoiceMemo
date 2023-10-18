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

async function cloneVoice(voice_name, audioFile) {
  const fetch = require('node-fetch');

  const url = 'https://play.ht/api/v2/cloned-voices/instant';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'multipart/form-data',
      AUTHORIZATION: 'fc509bae736646ee8703d2b48bdaecde',
      'X-USER-ID': 'pZl8pzgzMvd2pxBKT6J6MPbyK4r1',
      'sample_file': audioFile,
      'voice_name': voice_name
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
}

//media Recorded used for both Buttons
let mediaRecorder;
let audioChunks = [];

//start Audio Recording
document.getElementById('startRecording').addEventListener('click', async () => {
  try {
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(micStream);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      document.getElementById('audioPlayer').src = audioUrl;
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing the microphone:', error);
  }
});

//stop audio Recording
document.getElementById('stopRecording').addEventListener('click', async () =>{
  if(mediaRecorder && mediaRecorder.state !== 'inactive'){
    mediaRecorder.stop();
  }
})

