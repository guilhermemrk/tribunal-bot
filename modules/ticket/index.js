const CreateTicket = require('./ticket')
const CloseTicket = require('./close')

const ticketSystem = (client, Discord, m_db, config, command, moment, m_default, message, args) => {
	// .ticket [description] - Creates a ticket
	// .closeticket - Closes a ticket (admin only)
	// Optional
	// TODO: .closeticket - When you close a ticket, add every message to a text channel and send it to another channel, then delete the ticket channel
	// TODO: .ticketlog - Some information about ticket in the last 30 days or something
	// TODO: .clearcooldown [userid] - Clear user's cooldown.

	// .ticket [description]
	if (command == 'ticket') {
		CreateTicket.CreateTicket(client, Discord, m_db, config, command, moment, m_default, message, args);
	}
	// .closeticket [description]
	if (command == 'closeticket') {
		CloseTicket.CloseTicket(client, Discord, m_db, config, command, moment, m_default, message, args);
	}

}

module.exports = {
	ticketSystem
}