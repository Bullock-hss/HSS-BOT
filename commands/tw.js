module.exports = {
    name: 'tw',
    description: 'Teste le message de bienvenue',
    async execute(message, args) {
        await message.delete().catch(() => {});
        const welcomeEmbed = {
            title: "Bienvenue dans la HsS Team",
            description: `Salut <@${message.author.id}> !\n\nNous sommes ravis de t'accueillir sur notre serveur.\n\n**Merci de respecter ces quelques règles :**\n• Reste poli et courtois avec tout le monde\n• Pas d'insultes, de propos haineux ou discriminatoires\n• Respecte la vie privée des autres\n• Pas de spam ou de flood\n\nAmuse-toi bien parmi nous ! 🎉`,
            color: 0x6a1b9a,
            footer: { text: "L'équipe HsS Team" },
            timestamp: new Date()
        };
        
        try {
            await message.author.send({ embeds: [welcomeEmbed] });
        } catch (err) {
            message.channel.send("Impossible d'envoyer le message privé. Vérifiez vos paramètres de confidentialité.");
        }
    }
};
