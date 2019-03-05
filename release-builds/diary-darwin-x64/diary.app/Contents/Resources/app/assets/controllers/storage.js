const loki = require('lokijs');
const Cryptr = require('cryptr');
let db = new loki(__dirname + '/db.json', {autoload: true, autoloadCallback: loadHandler, autosave: true, autosaveInterval: 1000});
let cryptr, entries;

function loadHandler() {
    entries = db.getCollection('entries');
    if(!entries){
        entries = db.addCollection('entries')
    }
}

module.exports = {
    setEncryptionKey: (key) => {
        cryptr = new Cryptr(key);
    },
    getAllEntries: () => {
        let allEntries = [];
        for(let entry of entries.where((e) => !e.deleted)){
            allEntries.push({id: entry.id, title: cryptr.decrypt(entry.title), icon: cryptr.decrypt(entry.icon), content: cryptr.decrypt(entry.content), date: cryptr.decrypt(entry.date)});
        }
        return allEntries;
    },
    addEntry: (entry) => {
        entries.insert({ id: numberOfEntries(), title: cryptr.encrypt(entry.title), icon: cryptr.encrypt(entry.icon), content: cryptr.encrypt(entry.content), date: cryptr.encrypt(entry.date)})
    },
    deleteEntry: (id) => {
        let entry = entries.findOne({id: parseInt(id)});
        if(!entry) return false;
        entry.deleted = true;
        return true;
    },
    updateEntry: (id, title, content, icon, date) => {
        let entry = entries.findOne({id: parseInt(id)});
        entry.title = cryptr.encrypt(title);
        entry.date = cryptr.encrypt(date);
        entry.content = cryptr.encrypt(content);
        entry.icon = cryptr.encrypt(icon);
        db.saveDatabase();
    },
    getEntry: (id) => {
        const encryptedEntry = entries.findOne({id: parseInt(id)});
        if(!encryptedEntry || encryptedEntry.deleted) return false;
        let entry = {
            id: id,
            title: cryptr.decrypt(encryptedEntry.title),
            content: cryptr.decrypt(encryptedEntry.content),
            icon: cryptr.decrypt(encryptedEntry.icon),
            date: cryptr.decrypt(encryptedEntry.date)
        };
        return entry;
    }
};

function numberOfEntries(){
    return entries.where(() => true).length;
}