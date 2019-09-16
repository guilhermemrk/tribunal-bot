const CloseTicket = (client, Discord, m_db, config, command, moment, m_default, message, args) => {
    if (message.member.roles.has(config.adminrole)) {
        if (args[0] == undefined) {
            t_veredict = 'No veredict added';
        } else {
            t_veredict = args.join(" ");
        }
        if (message.channel.parentID == config.ticketcategory) {
            db.serialize(function () {
                // Update entry
                db.run("UPDATE tickets SET status=?, closed_id=?, closed_name=?, closed_timestamp=?, veredict=? WHERE channel=?", ['0', message.author.id, message.author.tag, moment().format().toString(), t_veredict, message.channel.topic], function (err) {
                    if (err) console.log(err);
                })
                // Send Messages
                db.get("SELECT * FROM tickets WHERE channel=? ORDER BY timestamp DESC LIMIT 1", [message.channel.topic], function (err, row) {
                    if (err) console.log(err);
                    const c_embed = {
                        "title": `Ticket closed!`,
                        "description": `
						**Closed By**: ${row.closed_name} (${row.closed_id})
						**Veredict**: ${row.veredict}
						
						**Ticket ID**: ${row.id}
						**Ticket created by**: ${row.username} (${row.userid})
						**Ticket description**:
						${row.description}`,
                        "footer": {
                            "text": `${moment(row.closed_timestamp).format('DD-MM-YYYY H:m:s [GMT-4]')}`
                        },
                        "color": config.embedOkColor
                    }
                    client.channels.get(config.logchannelid).send({
                        embed: c_embed
                    });

                    // Handle "user has left" scenario
                    try {
                        client.users.get(row.userid).send({
                            embed: c_embed
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });
            })
            message.channel.delete();
        } else {
            m_default.BlankEmbed.BlankEmbed(client, Discord, config, message, config.embedERRORColor, `Wrong channel!`);
        }
    } else {
        m_default.NoPerms.NoPerms(client, Discord, config, message, m_default);
    }
}

module.exports = {
    CloseTicket
}