module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes',
    async execute(message, args) {
        await message.delete().catch(() => {});
        const helpEmbed = {
            title: "📚 Liste des commandes",
            description: "Voici toutes les commandes disponibles :",
            fields: [
                {
                    name: "🧹 Commandes de modération",
                    value: "**!ca** - Supprime tous les messages récents\n**!clearMedia** - Supprime les messages sans image",
                    inline: false
                },
                {
                    name: "⚙️ Commandes d'administration",
                    value: "**!checkperm [rôle]** - Vérifie les permissions\n**!poll \"titre\" \"option1\" \"option2\"** - Crée un sondage",
                    inline: false
                },
                {
                    name: "🛠️ Utilitaires",
                    value: "**!embed** - Crée un embed personnalisé\n**!tw** - Teste le message de bienvenue",
                    inline: false
                }
            ],
            color: 0x2ecc71,
            footer: { text: "HSS-BOT - Tapez la commande pour plus d'infos" },
            timestamp: new Date()
        };
        await message.channel.send({ embeds: [helpEmbed] });
    }
};
