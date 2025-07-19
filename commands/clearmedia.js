module.exports = {
    name: 'clearmedia',
    description: 'Supprime les messages sans image',
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
            const toDelete = messages.filter(m =>
                !m.attachments.some(att => att.contentType && att.contentType.startsWith('image/')) &&
                !/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i.test(m.content)
            );
            if (toDelete.size === 0) break;
            await message.channel.bulkDelete(toDelete, true).then(b => { deleted += b.size; });
            fetchMore = toDelete.size === 100;
        }
        message.channel.send(`🧹 ${deleted} messages sans image supprimés.`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    }
};
