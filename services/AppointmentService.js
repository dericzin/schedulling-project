var mailer = require("nodemailer")
var Appo = require("../database/models/appointment");
const AppointmentFactory = require("../factories/AppointmentFactory");




class AppointmentService {

    async Create(name, email, description, cpf, date, time) {


        var newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true
        } catch (err) {
            console.log(err);
            return false
        }

    }

    async getAll(showFinished) {

        if (showFinished) {
            return await Appo.find();
        } else {
            var appos = await Appo.find({ 'finished': false });

            var appointments = [];

            appos.forEach(appointment => {

                appointments.push(AppointmentFactory.Build(appointment))

            });

            return appointments

        }
    }

    async GetById(id) {
        try {
            return await Appo.findOne({ '_id': id });
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async Finish (id){

        try {
            await Appo.findByIdAndUpdate(id, {finished: true})
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }

        
    }

    async Search(query){
        try {
            var appos = Appo.find().or([{email: query}, {cpf: query}])
            return appos
        } catch (err) {
           console.log(err);
           return []; 
        }

    }

    async SendNotification(){
        var appos = await this.getAll(false)
        var transporter = mailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            secure: false, 
            auth: {
                user: "4b7fbad6299319",
                pass:"c7198f17187531"
            }
        })



        appos.forEach(async appo =>{
            
            var date = appo.start.getTime();
            var hour = 1000*60*60;
            var gap = date-Date.now();

            if (gap <= hour) {
                
                if(!appo.notified){

                    await Appo.findByIdAndUpdate(appo.id, {notified: true})

                    transporter.sendMail({
                        from: "Thiago Déric <tdrb_05@hotmail.com>",
                        to: appo.email,
                        subject: "Sua consulta vai acontecer em breve",
                        text: "Prezado cliente, informamos que a sua consulta acontecerá em menos de 1 hora."

                    }).then((message) =>{
                        console.log(message);
                    }).catch(err =>{
                        console.log(err);
                    })

                    
                }

            }

        })
    }

}

module.exports = new AppointmentService();