const express = require("express")
const app = express()

const database = require("./database_connection")
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const SECRET = "fuckboi"

app.use(bodyParser.json())
app.use(cors())

app.get("/", (request, response) => {
    const token = request.headers.authorization.split(" ")[1]
    jwt.verify(token, SECRET, (error, decodedToken)=>{
        if (error){
            response.status(401).json({message: "fuckass"})
        } else{
            response.status(200).json({message: "yeet"})
        }
    }) 
    response.sendStatus(200)
})

app.post("/users", (request, response) =>{
    bcrypt.hash(request.body.password, 10)
        .then(hashedPassword => {
            return database("user").insert({
                username: request.body.username,
                password_digest: hashedPassword,
            }).returning(["id", "username", "password_digest"])
        }).then(users => {
         response.json(users[0])
    })
})

app.post("/login", (request, response) => {
    database("user")
    .where({username: request.body.username})
    .first()
    .then(user => {
        if (!user){
            response.status(401).json({error: "no user with that name"})
        }else{
            return bcrypt
            .compare(request.body.password, user.password_digest)
            .then(isAuthenticated => {
                if (!isAuthenticated){
                    response.status(401).json({error: "dumbass"})
                }else{
                jwt.sign(user, SECRET, (error, token) => {
                    response.status(200).json({ token })
                })
            }
            })
        }
    })
})

app.listen(9000)