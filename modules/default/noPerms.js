const NoPerms = (client, Discord, config, message, m_default) => {
  const b_embed = {
    "description": `You don't have permission to use this command.`,
    "color": config.embedERRORColor
  }
  message.channel.send({
    embed: b_embed
  }).then(msg => msg.delete(2000));
}

module.exports = {
  NoPerms
}