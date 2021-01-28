const express = require('express')
const app = express()
const path = require('path')
const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const clientId = '292808595591-a33lpploga88pl5hbqj3v4o7pbbvg1tm.apps.googleusercontent.com'
const clientSecret = 'w9lohP5KrQZFnpFf6TnnXzAZ'
const redirectUri = 'https://developers.google.com/oauthplayground'
const refreshToken = 'ya29.a0AfH6SMDyS-Ts-Jy9FtE1udh0HgV3PD9iwC-QB8vbk_MxrGy92eVuPqWSXxGa7RZeatC6rtMf3TXPBWhJmiOEgoHaN3uKo3aKtddtj_BmGqTrz1o9amxtWYEBtCQMUH2HDEKysG9ZEZq9srPA9nD3_4m6LAVGo1hf-7Vh6qFtMs_H'
const oAuth2Client = new google.auth.OAuth2(clientId,clientSecret, redirectUri)

oAuth2Client.setCredentials({refresh_token: refreshToken})


async function sendMail(from,to,subject,text,html){

    try {
        
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                type: 'OAuth2',
                user: 'felipe@gazapina.com.br',
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken

            }
        })

        const mailOptions = {
            from,
            to,
            subject,
            text,
            html
        }

        const result = await transport.sendMail(mailOptions)
        return result

    } catch (error) {
        return error
    }
}



app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/email',(req,res) =>{
    
    try {
        let subject = `Send email by ${req.query.nome}`
        let mensagem = req.query.mensagem
        let email = req.query.email
        let envio = req.query.envio
        let html = `<p>${mensagem}</p>`
        
        
        sendMail(email,envio,subject,mensagem,html)
        
    } catch (error) {
        console.log(error)
    }

    //sendMail()
    res.sendFile(path.join(__dirname + '/index.html'))
})



app.listen('4567') 