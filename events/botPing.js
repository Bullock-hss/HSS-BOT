module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if (!message?.client) return;
        
        if (message.mentions.has(message.client.user) && !message.author.bot) {
            try {
                await message.channel.send(`Merci de ne pas me ping, <@${message.author.id}> ! Tu ne peux plus écrire pendant 1 minute.`);
                
                if (message.guild && message.member.moderatable) {
                    await message.member.timeout(60000, 'Ping du bot');
                }
            } catch (err) {
                console.error('Erreur lors du timeout:', err);
            }
        }
    }
};
