const CreateDB = () => {
    db.serialize(function () {
        db.run(`CREATE TABLE IF NOT EXISTS tickets ( 
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
            userid TEXT NOT NULL,
            username TEXT NOT NULL,
            description TEXT NOT NULL,
            status INTEGER NOT NULL, 
            channel TEXT,
            closed_id TEXT,
            closed_name TEXT,
            closed_timestamp TEXT,
            veredict TEXT, 
            timestamp TEXT NOT NULL
            );`);
        db.run(`CREATE TABLE IF NOT EXISTS cooldown (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            userid TEXT NOT NULL,
            timestamp TEXT NOT NULL
            );`);
        db.run(`CREATE TABLE IF NOT EXISTS error_log (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            ticketid TEXT,
            userid TEXT,
            tried TEXT NOT NULL,
            error TEXT NOT NULL,
            timestamp TEXT NOT NULL
            );`);
    });
}

module.exports = {
    CreateDB
}