const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/chirps.db', (err) => {
    if (err) {
        console.error('Error while connecting to database: ', err);
    } else {
        console.log('Connected to or created SQLite database');
    }
});

db.serialize(() => {
    db.run('DROP TABLE chirps')
    db.run(`CREATE TABLE chirps(chirpId INTEGER PRIMARY KEY,
                                purchaseID TEXT,
                                movie TEXT,
                                location TEXT,
                                date TEXT,
                                time TEXT,
                                quantity TEXT
                                )`)
});

function getAllPurchases() {
    db.all('SELECT chirpId, purchaseID, movie, location, date, time, quantity FROM chirps', (err, chirps) => {
        if (err) {
            console.error('Error querying database: ', err);
        } else {
            console.log(chirps);
        }
    });
}

function deletePurchase(id, callback) {
    db.run('DELETE FROM chirps WHERE purchaseID = ?', id, (err) => {
        if (err) {
            console.error('Error deleting from database: ', err);
        } else {
            console.log("Item deleted.");
        }
    });
}

function addPurchase(purchaseID, movie, location, date, time, quantity, callback) {
    db.run(`INSERT INTO chirps(purchaseID, movie, location, date, time, quantity) VALUES(?, ?, ?, ?, ?, ?)`, [purchaseID, movie, location, date, time, quantity], (err) => {
        if (err) {
            console.error('Error inserting into database: ', err);
        }
    });
}

//module.exports.db = db;
module.exports.getAllPurchases = getAllPurchases;
module.exports.deletePurchase = deletePurchase;
module.exports.addPurchase = addPurchase;