const loki = require("lokijs"),
    axios  = require("axios"),
    fs     = require("fs"),
    path   = require("path");

const DB_DIR = path.join(__dirname, "db");

try {
    fs.statSync(DB_DIR);
} catch (e) {
    fs.mkdirSync(DB_DIR);
    fs.writeFileSync(path.join(DB_DIR, "tokens.db"), "{}");
}

const api = {
    baseURL: "http://127.0.0.1:8081"
}

const db = new loki(path.join(__dirname, "db/tokens.db"), {
    autoload: true,
    adapter: new (require("lokijs/src/loki-fs-structured-adapter"))(),
    autosave: true,
    autosaveInterval: 5000,
});

const pseudonym = db.getCollection("pseudonym");

module.exports = {
    pseudonym: pseudonym ? pseudonym : db.addCollection("pseudonym", {
        unique: [ "token", "username" ],
    }),
    api: axios.create(api),
};