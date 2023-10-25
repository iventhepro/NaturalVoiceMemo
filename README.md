# NaturalVoiceMemo
Natural Voice Memo ist eine Applikation, in der man eine Audio aufnehmen kann, diese Audio wird als Prompt für einen Chatbot verwendet. Die Antwort wird dann von einer anderen Stimme vorgelesen. 

## Verwendung
mithilfe des Buttons "Start recording" wird die Aufnahme begonnen. Mit dem selben Button wieder gestoppt. Die Stimme muss man dann benennen und dann kann man mit "Send Audio" den aufgenommenen prompt senden. Das Audio Format kann man auch angeben. Wenn ein anderes Audio Format gewünscht wird, kann der Knopf "Send Audio" nach dem änderen des Audio Formats im Dropdown darüber, erneut gedrückt werden und der Output wird für das neue Audio Format generiert. 

## Technologie
HTML, JavaScript, Node.js, Express.js

## installation
node installieren 
cd backend
npm i
(
npm i node-fetch
npm i cors
npm i express
npm i form-data
npm i multer
npm i stream
npm i axios
)
node app

Man braucht einen eigenen Open Ai Api Key welches auf der Webseite generiert werden kann. Solange man eine Telefonnummer angibt, kreigt man Gratis Credits. 
https://platform.openai.com/account/api-keys

html öffnen