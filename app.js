const express = require('express');
const app = express();
var FormData = require('form-data');

const port = 3000;
const multer = require('multer');
const cors = require('cors')
const fetch = require('node-fetch')
const Readable = require('stream').Readable; // Importieren Sie die Readable-Klasse aus dem 'stream'-Modul

app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Das Verzeichnis, in dem die Dateien gespeichert werden sollen
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Der Dateiname wird nicht geändert
    }
});
app.use(cors())
const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('audioFile'), (req, res) => {
    console.log(req.file)
    let {text} = req.body
    const formData = new FormData();
  
    formData.append('sample_file', fs.createReadStream('./uploads/' + req.file.filename));
    formData.append('voice_name', 'iven');

    fetch('https://api.play.ht/api/v2/cloned-voices/instant', {
        method: 'POST',
        headers: {
            'AUTHORIZATION': 'f32b6b3096b44e09a75a5f5ac20e14a6',
            'X-USER-ID': 'CPP4MvdEgEfoseGmIByCBymdMs43',
        },
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Senden Sie die API-Antwort zurück an den Client
            tts('s3://voice-cloning-zero-shot/bd8a6816-6d6f-42d7-aada-f786164c0bc0/iven/manifest.json', text)
        })
        .catch(error => {
            console.error(error);
            tts('s3://voice-cloning-zero-shot/bd8a6816-6d6f-42d7-aada-f786164c0bc0/iven/manifest.json', text)

        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
async function tts(voice, text,){
    console.log(text)
    const options = {
        method: 'POST',
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
          AUTHORIZATION: 'f32b6b3096b44e09a75a5f5ac20e14a6',
          'X-USER-ID': 'CPP4MvdEgEfoseGmIByCBymdMs43'
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          output_format:"mp3",
          voice_engine: 'PlayHT2.0'
        })
      };
    
      fetch('https://api.play.ht/api/v2/tts', options)
      .then(response =>{        const fileStream = fs.createWriteStream('audio_output.mp3');

    // Lesen Sie den Readable Stream der API-Antwort und schreiben Sie die Daten in die Datei
    response.body.pipe(fileStream);
console.log("startet")
    // Optional: Hören Sie auf 'end'-Event, um zu wissen, wann das Schreiben abgeschlossen ist
    fileStream.on('finish', () => {
      console.log('Audio-Datei wurde erfolgreich geschrieben.');
    });})
      
        //.then(response => response.json())
        .catch(err => console.error(err));
}
var request = require('request');

var fs = require('fs');
var path = require('path');
var options = {

    'method': 'POST',

    'url': 'https://api.play.ht/api/v2/cloned-voices/instant',

    'headers': {

        'accept': ' application/json',

        'content-type': ' multipart/form-data',

        'AUTHORIZATION': '11c84fe37adb40d1a22a28a614210f19',

        'X-USER-ID': '0qLOleS0vHSkv1FCiDnge54TaYI2'

    },

    formData: {

        'voice_name': 'iven',

        'sample_file': {

            'value': fs.createReadStream(path.join('C:/Users/ivenk/Desktop/NaturalVoiceMemo/file_example_WAV_1MG.wav')),

            'options': {

                'filename': path.join('C:/Users/ivenk/Desktop/NaturalVoiceMemo/file_example_WAV_1MG.wav'),

                'contentType': null

            }

        }

    }

};


