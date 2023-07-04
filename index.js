const express = require("express");
const connectToMongoDB = require("./database/database");
const AppointmentService = require("./services/AppointmentService");
const app = express();
var session = require("express-session");
var flash = require("express-flash");


app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true,
    cookie: { maxAge: 60000 }
}));


app.set('view engine', 'ejs')


connectToMongoDB().then(() => {
    console.log("Connected to Database");
}).catch(err => {
    console.log(err);
})

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/cadastro", (req, res) => {
    res.render("create",)
})

app.post("/create", async (req, res) => {

    const { name, email, description, cpf, date, time } = req.body;


    if (name == "" || name == " " || name == undefined) {
        res.status(400).json({ error: "Por favor, insire um nome" })
        return
    }


    if (email == "" || email == " " || email == undefined) {
        res.status(400).json({ error: "Por favor, insira um email" })
        return
    }


    if (cpf == "" || description == " " || description == undefined) {
        res.status(400).json({ error: "Por favor, insira um CPF" })
    }

    if (description == "" || description == " " || description == undefined) {
        res.status(400).json({ error: "Por favor, insira uma descrição!" })
        return
    }



    if (!date ) {
        res.status(400).json({ error: "Insira uma data válida" });
        return;
    }

    if (!time || time.trim() === '') {
        res.status(400).json({ error: "Insira um horário válido" });
        return;
    }


    var status = await AppointmentService.Create(name, email, description, cpf, date, time)

    if (status) {
        res.redirect("/")
    } else {
        res.send("Ocorreu uma falha!")
    }

})


app.get("/getcalendar", async (req, res) =>{

    var appointments = await AppointmentService.getAll(false);

    res.json(appointments)

})

app.get("/event/:id", async (req, res) =>{

    let appointment = await AppointmentService.GetById(req.params.id);
    console.log(appointment);

    if (appointment) {
        res.render("event", {appo: appointment})
    }else{
        res.redirect("/")
    }

    
});

app.post("/finish", async (req, res) =>{
    var id = req.body.id;
    var result = await AppointmentService.Finish(id);
    res.redirect("/")

})

app.get("/list", async (req, res) =>{



    var appos = await AppointmentService.getAll(true);
    res.render("list", {appos})
})

app.get("/searchresult", async (req, res) =>{
    var appos = await AppointmentService.Search(req.query.search)

    if (appos!="") {
        res.render("list",{appos});
   } else {
     res.redirect("/list");  
   }

    
})



setInterval(async() => {
    await AppointmentService.SendNotification();
}, 3000); 

app.listen(2506, () => {
    console.log("Servidor Rodando");
})