module.exports = {
    name: 'poll',
    description: 'Crée un sondage',
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.channel.send("Seuls les administrateurs peuvent utiliser cette commande.");
        }
        await message.delete().catch(() => {});
        const regex = /"([^"]+)"/g;
        const pollArgs = [];
        let match;
        while ((match = regex.exec(message.content)) !== null) {
            pollArgs.push(match[1]);
        }
        if (pollArgs.length < 3) {
            const errorEmbed = {
                title: "Erreur de syntaxe",
                description: 'Utilisation :\n`!poll "Titre" "Option 1" "Option 2" [Option 3] ... (minimum 2 options)`',
                color: 0x712e71
            };
            await message.channel.send({ embeds: [errorEmbed] });
            return;
        }

        const [titre, ...options] = pollArgs;
        if (options.length > 10) {
            const errorEmbed = {
                title: "Erreur de syntaxe",
                description: 'Maximum 10 options autorisées.',
                color: 0x712e71
            };
            await message.channel.send({ embeds: [errorEmbed] });
            return;
        }

        const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
        const embed = {
            title: `📊 ${titre}`,
            color: 0x712e71,
            description: 'Réagissez ci-dessous pour voter !',
            fields: options.map((opt, i) => ({
                name: `${emojis[i]} ${opt}`,
                value: '\u200B',
                inline: false
            })),
            footer: { text: `Sondage créé par ${message.author.username}` },
            timestamp: new Date()
        };

        const pollMessage = await message.channel.send({ content: '@here', embeds: [embed] });
        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(emojis[i]);
        }
    }
};
