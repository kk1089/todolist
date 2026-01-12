const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('Сервер запускается...');

const PORT = 3000;
const TODOS_FILE = path.join(__dirname, 'todos.json');

// создаем файл если его нет 
if(!fs.existsSync(TODOS_FILE)) {
    fs.writeFileSync(TODOS_FILE, JSON.stringify([]));
    console.log('file todos.json create');
}

//read task
function readTodos() {
    const data = fs.readFileSync(TODOS_FILE, 'utf8');
    return JSON.parse(data);
}

//save tasks
function saveTodos(todos) {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
}

//create server 
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Allow requests from any domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    //Preliminary request
    if(req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API: Get tasks

    if(req.method === 'GET' && req.url === '/api/todos') {
        const todos = readTodos();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(todos));
        return;
    }

    if(req.method === 'POST' && req.url === '/api/todos') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', ()=> {
            try {
                const newTodo = JSON.parse(body);
                newTodo.id = Date.now();

                const todos = readTodos();
                todos.push(newTodo);
                saveTodos(todos);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(newTodo));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        });
        return;
    }

    // Default response
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Server work. Use /api/todos');
});

// Launch 
server.listen(PORT, ()=> {
    console.log(`Server running: http://localhost:${PORT}`);
    console.log('Test: curl http://localhost:3000/api/todos');
});

