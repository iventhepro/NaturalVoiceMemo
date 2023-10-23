async function cloneVoice(voice_name, audioFile) {

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
      if (audioBlob != null) {
        alert("Alte audio wird verworfen, neue Aufnahme startet...");
      }
      //initialisierung des MediaRecorders
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(micStream);

      //sobald daten verfügbar sind fügt datenstücke dem File hinzu
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayer').src = audioUrl;
      };

      // Setzt ein Timeout von 100 Sekunden (100'000 Millisekunden)
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          alert('Maximale Aufnahmelänge erreicht (10 Sekunden).');
          recordButton.setAttribute("class", "btn btn-success");
          recordButton.textContent = "Start Recording";
        }
      }, 100000);

      mediaRecorder.start();
      recordButton.setAttribute("class", "btn btn-danger");
      recordButton.textContent = "Stop Recording";

      isRecording = true;
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        recordButton.setAttribute("class", "btn btn-success");
        recordButton.textContent = "Start Recording";
        isRecording = false;
      }
    }
  } catch (error) {
    console.error('Error accessing the microphone:', error);
  }

});

document.getElementById('sendAudio').addEventListener('click', () => {
  speechToText();
});


const API_KEY = ""; // Replace with your actual API key


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

      "max_tokens": 200,

      "top_p": 1,

      "temperature": 0.5,

      "frequency_penalty": 0,

      "presence_penalty": 0

    }),

  });

  const data = await response.json();

  console.log(data);

  //set Text of response to the actual text Response
  document.getElementById("responseText").innerText = data.choices[0].message.content;
  alert("Text succesfully generated from prompt!");
  await cloningVoice(data.choices[0].message.content);

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
  //set the sent voice text to the box
  document.getElementById("sentText").innerText = data.text;
  alert("Audio converted to Text!");
  console.log(data);

  generateTextFromUserInput(data.text);
}

async function cloningVoice(gbttext) {
  let file = new File([audioBlob], document.getElementById('voiceName').value + ".wav", { type: "audio/wav" });

  var formdata = new FormData();
  formdata.append("voice_name", "iven");
  formdata.append("filename", document.getElementById("voiceName").value); 
  formdata.append("audioFile", file);
  formdata.append("text", gbttext);
  formdata.append("format", document.getElementById("format").value); 

  fetch("http://localhost:3000/api/mytts", { body: formdata, method: "POST" })
    .then(response => response.text())
    .then(dataUrl => setSourcesToAudio(dataUrl))
    .catch(error => console.log('error', error));

  /*
 fetch("http://localhost:3000/api/upload", { body: formdata, method: "POST" })
   .then(response => response.text())
   .then(result => console.log(result))
   .then(response => document.getElementById("result").src = response)
   .catch(error => console.log('error', error));*/

}

function setSourcesToAudio(dataUrl) {
  const audioElement = document.getElementById('result');

  let stringWithoutQuotes = dataUrl.replace(/"/g, '');

  let stringWithoutBraces = stringWithoutQuotes.replace("}", '');

  document.getElementById("result").src = stringWithoutBraces;

  document.getElementById("download").href = stringWithoutBraces; 

  document.getElementById("download").text = stringWithoutBraces; 
}