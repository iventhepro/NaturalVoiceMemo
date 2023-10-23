const fs = require('fs');
const express = require('express');
const app = express();
var FormData = require('form-data');

const port = 3000;
const multer = require('multer');
const cors = require('cors');
//const fetch = require('node-fetch');

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

app.post('/api/mytts', upload.single('audioFile'), (req, res) => {
    let filename = req.body.filename; 
    let text = req.body.text; 
    let format = req.body.format; 
    console.log(format); 
    const axios = require("axios").default;

    const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/audio/text_to_speech",
        headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDhiYTQzZGUtZTI0Ny00ZTAzLTk4MTYtMWMzNmEyZjkyNjBlIiwidHlwZSI6ImFwaV90b2tlbiJ9.ZUbxhcXIv9ftY6rkHxHCZPjt1dYrZHBgDRoemXY00BA",
        },
        data: {
            show_original_response: false,
            fallback_providers: "google",
            audio_format: format, 
            providers: "amazon",
            language: "de",
            text: text,
            option: "FEMALE",
        },
    };

    axios
        .request(options)
        .then((response) => {
            console.log(response); 
            // Base64-String dekodieren
            const decodedAudioBuffer = Buffer.from(response.data.amazon.audio, 'base64');
           
            // Audio als .mp3-Datei speichern (optional)
        
            fs.writeFileSync(filename + '.' + format, decodedAudioBuffer, 'binary');
            // Audio in eine Data-URL umwandeln
            //const dataUrl = `data:audio/mpeg;base64,${decodedAudioBuffer.toString('base64')}`;
            res.json(response.data.amazon.audio_resource_url); // Sende die Daten an den Cl
            
        })
        .catch((error) => {
            console.error(error);
        });

});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
/*
app.post('/api/upload', upload.single('audioFile'), (req, res) => {
    console.log(req.file)
    let text = req.body.text
    const formData = new FormData();

    formData.append('sample_file', fs.createReadStream('./uploads/' + req.file.filename));
    formData.append('voice_name', 'iven');

    fetch('https://api.play.ht/api/v2/cloned-voices/instant', {
        method: 'POST',
        headers: {
            'AUTHORIZATION': 'fa8a194852cb466db77588e13f13ac7e',
            'X-USER-ID': 'TMH9RgDJa8O4YbWhKuImVWSy23F3',
        },
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Senden Sie die API-Antwort zurück an den Client
            tts("s3://voice-cloning-zero-shot/ed709991-9de7-4fe7-b19d-e4aaa975d003/iven/manifest.json", text, res)
        })
        .catch(error => {
            console.error(error);
            tts('s3://voice-cloning-zero-shot/bd8a6816-6d6f-42d7-aada-f786164c0bc0/iven/manifest.json', text, res)

        });

});

async function tts(voice, text, res) {
    console.log(text);
    console.log(voice);
    const options = {
        method: 'POST',
        headers: {
            accept: 'text/event-stream',
            'content-type': 'application/json',
            AUTHORIZATION: 'fa8a194852cb466db77588e13f13ac7e',
            'X-USER-ID': 'TMH9RgDJa8O4YbWhKuImVWSy23F3'
        },
        body: JSON.stringify({
            text: text,
            voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
            output_format: 'mp3',
            voice_engine: 'PlayHT2.0'
        })
    };

    try {
        const response = await fetch('https://api.play.ht/api/v2/tts', options); // Lese den JSON-Inhalt des Response-Streams
        console.log(response);
        res.json(response); // Sende die Daten an den Client
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    /* const url = 'https://api.play.ht/api/v2/tts';
     const options = {
         method: 'POST',
         headers: {
             accept: 'application/json',
             'content-type': 'application/json',
             AUTHORIZATION: '8838eb0cd7f947a0b82fe18cdb6b422f',
             'X-USER-ID': 'bgTbTv04P4PIr9EC9jPOjL948VH3'
         },
         body: JSON.stringify({
             text: 'Hello from a realistic voice.',
             voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
             output_format: 'mp3',
             voice_engine: 'PlayHT2.0'
         })
     };
 
     fetch(url, options)
         .then(json => console.log(json))
         .catch(err => console.error('error:' + err));
}*/
