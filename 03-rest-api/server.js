const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Middleware modules:
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Routes:
app.get('/', (request, response) => {
    response.send('Hello Express!');
});

app.post('/hello', (request, response) => {
    let body = request.body;
    body.message = 'Hello ' + body.name;
    response.json(body);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000...');
});