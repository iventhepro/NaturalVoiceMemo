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
let isRecording = false;
const recordButton = document.getElementById('startStopRecording');

//start Audio Recording
recordButton.addEventListener('click', async () => {
  try {
    //if media player is not recording, initialize recorder and start recording, else stop
    if (!isRecording) {
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
      recordButton.setAttribute("class", "btn btn-danger");
      recordButton.textContent = "Stop Recording";

      isRecording = true;
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        recordButton.setAttribute("class", "btn btn-success");
        recordButton.textContent = "Start Recording";
      }
    }
  } catch (error) {
    console.error('Error accessing the microphone:', error);
  }

});

document.getElementById('sendAudio').addEventListener('click', () => {
  //cloneVoice(document.getElementById('voiceName'), audioBlob);
  speechToText();
}
)


const API_KEY = "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"; // Replace with your actual API key

async function generateTextFromUserInput(text) {

  const response = await fetch("https://api.openai.com/v1/chat/completions", { //This is the API endpoint

    method: "POST",

    headers: {

      Authorization: `Bearer ${API_KEY}`,

      "Content-Type": "application/json",

    },

    body: JSON.stringify({

      "model": "gpt-3.5-turbo",

      "messages": [{ "role": "user", "content": text }],

      "max_tokens": 500,

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

  let file = new File([audioBlob], document.getElementById('voiceName').value + ".wav", { type: "audio/wav" });

  const formData = new FormData();
  formData.append('model', 'whisper-1');
  formData.append('file', file);
  formData.append('max_tokens', 500);
  formData.append('language', 'de');
  formData.append('temperature', 0.5);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", { //This is the API endpoint

    method: "POST",

    body: formData,

    headers: {
      'Authorization': `Bearer ${API_KEY}`

    }

  });

  const data = await response.json();

  console.log(data);

  generateTextFromUserInput(data.text);


}


