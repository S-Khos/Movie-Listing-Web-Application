let express = require('express');
let app = express();
const { v4: uuidv4 } = require('uuid');
var QRCode = require('qrcode');
const path = require('path');
const sqliteModel = require('./model/purchase_model');
let showtime = require('./showtimes_model');

app.set('port', process.env.PORT || 3000);

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/main.html');
});

// pug render
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


app.post('/buyTickets', function(request, response) {
    console.log(request.body);
    response.render('ticketPurchase', request.body);
});

app.post('/buyTicket', function(request, response) {
    var confirmationID = uuidv4();
    console.log(request.body);
    sqliteModel.addPurchase(confirmationID,
        request.body.title,
        request.body.location,
        request.body.date,
        request.body.time,
        request.body.quantity);
    
    sqliteModel.getAllPurchases();
    QRCode.toFile(__dirname+`/public/qrcode/qr.png`, confirmationID, {
        width: 500
    }, function (err) {
        if (err) throw err
    });
    function render(){
        response.render("confirmation", {id: confirmationID});
    }
    setTimeout(render, 500);
});

app.get('/showtimes_api', function(request, response){
    let location = parseInt(request.query.location);
    let date = request.query.date;
    console.log(location, date);
    showtime.find({
        locationID: location,
        date: date
    })
    .then(function(showtimes_from_db) {
        console.log(showtimes_from_db);
        response.json(showtimes_from_db);
    })
});


app.listen(app.get('port'), function(){
    console.log(`server is listening on port ${app.get('port')}`);
});