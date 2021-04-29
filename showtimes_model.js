const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('----MONGO STRING HERE-----', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(error) {
    if (error) {
        console.error('failed to connect: ', error);
    } else {
        console.log('Connected to MongoDB');
    }
});
mongoose.set('useCreateIndex', true);

let Schema = mongoose.Schema;

let showtimesSchema = new Schema({
    id: String, 
    title: String,
    locationID: Number,
    location: String,
    date: String,
    time: [String]
}, {
    collection: 'showtimes'
});

module.exports = mongoose.model('showtimes', showtimesSchema);
