import { useCallback, useEffect, useState } from "react";
import { useSocket } from "./hook/useSocket";
import {FaTrash,FaPenAlt} from "react-icons/fa"

const initialState = {
  title: "",
  description: "",
};

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(initialState);
  const [isEdit, setIsEdit] = useState(false);
  const { socket } = useSocket("http://localhost:4000");

  const HandleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = useCallback(() => {
    socket.on("server:getNotes", (notes) => {
      setNotes(notes);
    });
  }, []);

  const deleteNote = (id) => {
    socket.emit("client:deleteNote", id);
  };

  const actions = (e) => {
    e.preventDefault();
    isEdit
      ? socket.emit("client:updateNote", note)
      : socket.emit("client:addNote", note);

    clean();
  };

  const edit = (note) => {
    setIsEdit(true);
    setNote(note);
  };

  const clean = () => {
    setIsEdit(false);
    setNote(initialState);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-4">
          <div className="card border border-5 rounded-pill shadow-lg bg-body-tertiary p-5 border-info">
            <div className="card-title text-center"><strong>NOTES</strong></div>
            <div className="card-body">
              <form onSubmit={actions}>
                <div className="mb-3">
                  <label className="form-label">
                    <em>Title</em>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={note.title}
                    autoFocus
                    required
                    className="form-control border border-5 rounded-5 border-primary"
                    onChange={(e) => HandleChange(e)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <em>Description</em>
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="form-control border border-5 rounded-5 border-primary"
                    value={note.description}
                    required
                    onChange={(e) => HandleChange(e)}
                  />
                </div>

                <button
                  className="btn btn-outline-secondary rounded-pill"
                  type="submit"
                >
                  {isEdit ? "Editar" : "Guardar"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-8">
          <ol className="list-group list-group-numbered">
            {notes.map((note) => (
              <li
                key={note._id}
                className="list-group-item d-flex my-2 justify-content-between align-item-start rounded-pill border border-3 border-primary"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{note.title}</div>
                  {note.description}
                </div>

                <button
                  className="btn btn-danger me-2 "
                  onClick={() => deleteNote(note._id)}
                >
                  <FaTrash />
                </button>

                <button className="btn btn-warning " onClick={() => edit(note)}>
                  <FaPenAlt />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
