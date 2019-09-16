const BlankEmbed = (client, Discord, config, message, ecolor, be_content) => {
  const b_embed = {
    "description": be_content,
    "color": ecolor
  }
  message.channel.send({
    embed: b_embed
  }).then(msg => msg.delete(2000));
}

module.exports = {
  BlankEmbed
}