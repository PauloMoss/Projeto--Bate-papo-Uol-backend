import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

fs.existsSync("./data.json");
const data = fs.readFileSync("./data.json",'utf8')
const participants = JSON.parse(data).participants;
const messages = JSON.parse(data).messages;

app.post("/participants", (req, res) => {
    
    const newUser = req.body;

    if(newUser.name.length === 0) {
        res.sendStatus(400);
        return;
    }
    const participant = {...newUser, lastStatus: Date.now()}
    const message = {from: participant.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}
    participants.push(participant)
    messagens.push(message)
    res.sendStatus(200)
    fs.writeFileSync("./data.json", JSON.stringify({participants, messages}));
})



app.listen(4000, () => {
    console.log("Servidor Rodando na porta 4000!")
});