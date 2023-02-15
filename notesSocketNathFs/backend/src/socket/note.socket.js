import { noteModel } from "../models/note.model.js"

export const socket=(fastify)=>{

    fastify.io.on("connection",(socket)=>{
        console.log("usuario conectado", socket.id) //comentar si se desplega

        const getNotes=async()=>{
            const notes=await noteModel.find()
            fastify.io.emit("server:getNotes",notes)
        }

        getNotes()

        socket.on("client:addNote",async(note)=>{
            await noteModel.create(note)
            getNotes()
        })

        socket.on("client:updateNote",async(note)=>{
            await noteModel.findByIdAndUpdate({_id:note._id},note)
            getNotes()
        })

        socket.on("client:deleteNote",async(id)=>{
            await noteModel.findOneAndDelete(id)
            getNotes()
        })

        socket.on("client:getNote",async(id)=>{
            await noteModel.findById(id)
            fastify.io.emit("server:getNote",note)
            getNotes()
        }) //si usaramos rutas para obtener por id

        socket.on("disconnect",()=>{
            console.log("user desconectado",socket.id)
        }) //comentar si se desplega

    })
}