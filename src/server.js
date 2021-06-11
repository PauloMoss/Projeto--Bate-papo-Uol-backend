import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

fs.existsSync("./data.json");
const data = fs.readFileSync("./data.json",'utf8')
let participants = JSON.parse(data).participants;
const messages = JSON.parse(data).messages;

app.post("/participants", (req, res) => {
    
    const newUser = req.body;
    if(newUser.name.length === 0) {
        res.sendStatus(400);
        return;
    }
    const participant = {...newUser, lastStatus: Date.now()}
    participants.push(participant)
    const message = {from: participant.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}
    messages.push(message);
    fs.writeFileSync("./data.json", JSON.stringify({participants, messages}));
    res.sendStatus(200);
})

app.get("/participants", (req, res) => {
    const allParticipants = participants.map(p => p.name)
    res.send(allParticipants)
})

app.post("/messages", (req, res) => {
    const messageContent = req.body;
    const { to, text, type} = messageContent;
    const typeOk = (type !== "message" ? (type !== "private_message") ? false : true : true)
    const userName = req.headers.user;
    if(to.length === 0 || text.length === 0 ) {
        res.sendStatus(400);
        return;
    }
    if(!typeOk) {
        res.sendStatus(400);
        return;
    }
    const message = { from: userName, ...messageContent};
    messages.push(message)
    fs.writeFileSync("./data.json", JSON.stringify({participants, messages}));
    res.send(message)
})

app.get("/messages", (req, res) => {
    const limit = req.query.limit;
    const userName = req.headers.user;
    const returnMessagens = [];
    messages.forEach(m => {
        if(m.from === userName || m.to === userName || m.to == "Todos"){
            returnMessagens.push(m)
        }
    })
    const sendMessages = (returnMessagens.length > limit) ? returnMessagens.slice(returnMessagens.length - limit, returnMessagens.length): returnMessagens;
    res.send(sendMessages)
})

app.post("/status", (req, res) => {
    
    const userName = req.headers.user;
    const userData = participants.find(p => p.name === userName);
    if(!userData) {
        res.sendStatus(400);
        return;
    }
    userData.lastStatus = Date.now();

    res.send(200)
    fs.writeFileSync("./data.json", JSON.stringify({participants, messages}));
})

setInterval(()=> {
    const deleteParticipants = [];
    const updatedParticipants = [];

    participants.forEach(p => {
        if(Date.now() - p.lastStatus > 10000){
            deleteParticipants.push(p);
        } else {
            updatedParticipants.push(p);
        }
    })

    deleteParticipants.forEach(p => {
        messages.push({from: p.name, to: 'Todos', text: 'sai da sala...', type: 'status', time: 'HH:MM:SS'})
    });

    const array = JSON.stringify(participants);
    console.log(array)

    //fs.writeFileSync("./data.json", JSON.stringify({participants: updatedParticipants, messages}));
}, 15000)

app.listen(4000, () => {
    console.log("Servidor Rodando na porta 4000!")
});