const express = require("express");
const cors = require("cors");
const app = express();
//const http = require("http");
const logger = require("./loggerMiddleware");
app.use(cors());
app.use(express.json());

app.use(logger);

let notes = [
  {
    id: 1,
    content: "me tengo que suscribir",
    date: "2019",
    important: true,
  },
  {
    id: 2,
    content: "todo mal",
    date: "2017",
    important: false,
  },
  {
    id: 3,
    content: "todo bien",
    date: "2021",
    important: true,
  },
  {
    id: 4,
    content: "todo de loco",
    date: "2023",
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id == id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id != id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const ids = notes.map((note) => {
    return note.id;
  });

  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important != "undefined" ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  response.status(201).json(newNote);
});

app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
