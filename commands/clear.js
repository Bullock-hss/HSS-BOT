module.exports = {
    name: 'ca',
    description: 'Supprime tous les messages récents',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send("Tu n'as pas la permission de gérer les messages.");
        }
        await message.delete().catch(() => {});
        let deleted = 0;
        let fetchMore = true;
        while (fetchMore) {
            const messages = await message.channel.messages.fetch({ limit: 100 });
            if (messages.size === 0) break;
            const deletable = messages.filter(m => (Date.now() - m.createdTimestamp) < 14 * 24 * 60 * 60 * 1000);
            if (deletable.size === 0) break;
            await message.channel.bulkDelete(deletable, true).then(b => { deleted += b.size; });
            fetchMore = deletable.size === 100;
        }
        message.channel.send(`🧹 ${deleted} messages supprimés.`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    }
};
