/* Script Node.js (SQLite) pour initialiser automatiquement un fichier de base de données.
   Usage : node init_db.js
*/

const sqlite3 = require('sqlite3').verbose();
const dbPath = './projet_auto.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur ouverture BDD :', err.message);
    process.exit(1);
  }
  console.log('BDD SQLite ouverte :', dbPath);
});

const schema = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mot_de_passe TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS produits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  prix REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS commandes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL,
  total REAL NOT NULL,
  statut TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT (datetime('now','localtime')),
  FOREIGN KEY(utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
`;

db.exec(schema, (err) => {
  if (err) {
    console.error('Erreur création tables :', err.message);
  } else {
    console.log('Schéma créé avec succès !');
    console.log('Fichier de base de données généré :', dbPath);
  }
  db.close((err) => {
    if (err) console.error('Erreur fermeture BDD :', err.message);
    else console.log('Connexion BDD fermée.');
  });
});
