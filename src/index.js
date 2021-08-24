const express = require('express');
const cors = require('cors');
const {uuid, isUuid} = require('uuidv4');

const app = express();
app.use(cors());
app.use(express.json());

const projects = [];

const logRequests = (request, response, next) => {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
} 

const validadePojectId = (request, response, next) => {
    const {id} = request.params;

    if(!isUuid(id))
        return response.status(400).json({error: "invalid project id"})

    return next();
}

app.use(logRequests);

app.get('/projects', (request, response) => {
    const {title} = request.query;

    const results = title ? projects.filter(e => e.title.includes(title)) : projects

    return response.json(results)
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {title, owner, id: uuid()};
    projects.push(project);

    return response.json(project)
})

app.put('/projects/:id', validadePojectId, (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(e => e.id === id);

    if(projectIndex < 0)
        return response.status(400).json({error: "project not found"});

    const project = {
        title, owner , id
    }

    projects[projectIndex] = project;

    return response.json(project);
})

app.delete('/projects/:id', validadePojectId, (request, response) => {
    const {id} = request.params;


    const projectIndex = projects.findIndex(e => e.id === id);

    if(projectIndex < 0)
        return response.status(400).json({error: "project not found"});

    projects.splice(projectIndex, 1);

    return response.status(204).send();
})

app.listen(3333, () => {
    console.log('Backend Started')
});