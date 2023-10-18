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
var audioBlob; 

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
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      document.getElementById('audioPlayer').src = audioUrl;
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing the microphone:', error);
  }
});

//stop audio Recording
document.getElementById('stopRecording').addEventListener('click', async () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
})

document.getElementById('sendAudio').addEventListener('click', ()=>{
//cloneVoice(document.getElementById('voiceName'), audioBlob);
speechToText();
}
)


const API_KEY = "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"; // Replace with your actual API key

async function fetchResponse() {

  const response = await fetch("https://api.openai.com/v1/chat/completions", { //This is the API endpoint

    method: "POST",

    headers: {

      Authorization: `Bearer ${API_KEY}`,

      "Content-Type": "application/json",

    },

    body: JSON.stringify({

      "model": "gpt-3.5-turbo",

      "messages": [{ "role": "user", "content": "Wer ist Präsident von Amerika?" }],

      "max_tokens": 100,

      "top_p": 1,

      "temperature": 0.5,

      "frequency_penalty": 0,

      "presence_penalty": 0

    }),

  });

  const data = await response.json();

  console.log(data);

}

async function speechToText() {

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", { //This is the API endpoint

    method: "POST",

    headers: {

      Authorization: `Bearer ${API_KEY}`

    },

    body: JSON.stringify({

      model: "whisper-1",

      file: new File([audioBlob],document.getElementById('voiceName').value, {type: "audio/wav"}),

      "max_tokens": 100,

      "language": "de",

      "temperature": 0.5,

    }),

  });

  const data = await response.json();

  console.log(data);

}


