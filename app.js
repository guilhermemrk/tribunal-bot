const Discord = require('discord.js');
const moment = require('moment');
const client = new Discord.Client();
var modules = require('./modules');
const config = require("./src/config.json");

prefix = config.prefix;

var m_login = modules.m_login;
var m_ready = modules.m_ready;
var m_db = modules.m_db;
var m_ticket = modules.m_ticket;
var m_default = modules.m_default;

m_ready.botReady(client, Discord, m_db, config);

client.on('message', message => {
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0);
  m_ticket.ticketSystem(client, Discord, m_db, config, command, moment, m_default, message, args);
})

m_login.botLogin(config.token, client, Discord);