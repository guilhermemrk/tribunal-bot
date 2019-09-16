const botReady = (client, Discord, m_db, config) => {
  client.on('ready', () => {
    m_db.ConnectDB.ConnectDB(config);
    m_db.CreateDB.CreateDB();
    console.log(`Bot online!`);
  })
}

module.exports = {
  botReady
}