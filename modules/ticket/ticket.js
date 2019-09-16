function create_channel(client, Discord, config, message, m_db, m_default, moment) {
    let server = message.guild;
    db.get("SELECT * FROM tickets WHERE userid=? ORDER BY timestamp DESC LIMIT 1", [message.author.id], function (err, row) {
        if (err) console.log(err);
        if (row == undefined) {
            m_default.BlankEmbed.BlankEmbed(client, Discord, config, message, config.embedERRORColor, `ERROR! Please contact a staff member!`);
            db.run("INSERT INTO error_log (userid, tried, error, timestamp) VALUES (?,?,?,?)", [message.author.id, 'Create a ticket channel', err, moment().format().toString()], function (err) {
                if (err) console.log(err);
            });
        } else {
            let ticket_id = row.id;
            server.createChannel(`ticket-${ticket_id}`, {
                    type: 'channel',
                    permissionOverwrites: [{
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }, {
                        id: server.defaultRole.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }, {
                        id: config.adminrole,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }]
                })
                .then(channel => {
                    channel.setParent(config.ticketcategory);
                    channel.setTopic(channel.id);
                    const b_embed = {
                        "title": `Ticket created!`,
                        "description": `**Don't worry! Only you and the staff users can see this chat!**
						Our team will read through it and come back to you as soon as we can!
						Feel free to complement your ticket in this channel, make it as informative as possible.
						Be aware that you can only open one ticket every 3 hours.

						**Ticket ID **: ${ticket_id}
						**Ticket from user **: ${message.author.tag} (${message.author.id})
						**Ticket description**:
						${row.description}`,
                        "footer": {
                            "text": `${moment().format('DD-MM-YYYY H:m:s [GMT-4]')}`
                        },
                        "color": config.embedOkColor
                    }
                    channel.send('@everyone');
                    channel.send({
                        embed: b_embed
                    });

                    // Log
                    const l_embed = {
                        "title": `Ticket created!`,
                        "description": `**Ticket ID **: ${ticket_id}
						**Ticket from user **: ${message.author.tag} (${message.author.id})
						**Ticket description**:
						${row.description}`,
                        "footer": {
                            "text": `${moment().format('DD-MM-YYYY H:m:s [GMT-4]')}`
                        },
                        "color": config.embedOkColor
                    }
                    client.channels.get(config.logchannelid).send({
                        embed: l_embed
                    });
                    db.run("UPDATE tickets SET channel=? WHERE id=?", [channel.id, ticket_id], function (err) {
                        if (err) console.log(err);
                    });
                })
                .catch(console.error);
        }
    });
}

const CreateTicket = (client, Discord, m_db, config, command, moment, m_default, message, args) => {
    let message_guild = message.guild.id;
    let ticket_guild = config.ticketserverid;
    let message_channel = message.channel.id;
    let ticket_channel = config.ticketchannelid;
    // Was the command used in the right server?
    if (message_guild == ticket_guild) {
        // In the right channel?
        if (message_channel == ticket_channel) {
            db.get('SELECT * FROM cooldown WHERE userid=? ORDER BY timestamp DESC LIMIT 1', [message.author.id], function (err, row) {
                if (err) console.log(err);
                if (args[0] == undefined) {
                    t_description = 'No description added.';
                } else {
                    t_description = args.join(" ");
                }
                if (row != undefined) {
                    c_begin = moment();
                    c_end = moment(row.timestamp);
                    c_time = c_begin.diff(c_end, 'minutes', false);
                    c_time = config.cooldown - parseInt(c_time);
                } else {
                    c_time = undefined
                }
                if (c_time == undefined || c_time < 0) {
                    db.serialize(function () {
                        db.run(`INSERT INTO tickets (userid, username, description, status, timestamp) VALUES (?,?,?,?,?)`, [message.author.id, message.author.tag, t_description, '1', moment().format().toString()], function (err) {
                            if (err) {
                                if (err) console.log(err);
                                db.run(`INSERT INTO error_log (tried, error, timestamp) VALUES (?,?,?)`, ['Create a ticket', err, moment().format().toString()], function (err) {
                                    if (err) console.log(err);
                                });
                            }
                        });
                        db.run(`INSERT INTO cooldown (userid, timestamp) VALUES (?,?)`, [message.author.id, moment().format().toString()], function (err) {
                            if (err) {
                                db.run(`INSERT INTO error_log (tried, error, timestamp) VALUES (?,?,?)`, ['Add cooldown to a user after ticket creation', err, moment().format().toString()], function (err) {
                                    if (err) console.log(err);
                                });
                            }
                        });
                        db.get("SELECT * FROM tickets WHERE userid=? ORDER BY timestamp DESC LIMIT 1", [message.author.id], function (err, row) {
                            if (err) console.log(err);
                            if (row != undefined) {
                                create_channel(client, Discord, config, message, m_db, m_default, moment);
                            } else {
                                m_default.BlankEmbed.BlankEmbed(client, Discord, config, message, config.embedERRORColor, `ERROR! Please contact a staff member!`);
                            }
                        })
                    });
                } else {
                    m_default.BlankEmbed.BlankEmbed(client, Discord, config, message, config.embedERRORColor, `You have to wait **${c_time} minutes** to create another ticket!`);
                }
            });
        } else {
            m_default.BlankEmbed.BlankEmbed(client, Discord, config, message, config.embedERRORColor, `Wrong channel!`);
        }
    } else {
        m_default.BlankEmbed.BlankEmbed(client, Discord, config, message, config.embedERRORColor, `Wrong server!`);
    }
    message.delete(1000);
}

module.exports = {
    CreateTicket
}