module.exports = {
    name: 'embed',
    description: 'Crée un embed personnalisé',
    async execute(message, args) {
        await message.delete().catch(() => {});
        const regex = /(\w+)=["""']([^"""']+)["""']/g;
        let match;
        let options = {};
        
        while ((match = regex.exec(message.content)) !== null) {
            options[match[1].toLowerCase()] = match[2];
        }

        if (Object.keys(options).length === 0) {
            const helpEmbed = {
                title: "Utilisation de !embed",
                description: 'Exemple :\n`!embed titre="Titre" description="Description" color="#FF0000" footer="Pied de page" image="URL" thumbnail="URL" author="Auteur" authoricon="URL"`',
                color: 0xe67e22
            };
            await message.channel.send({ embeds: [helpEmbed] });
            return;
        }

        let embed = {
            title: options.titre,
            description: options.description,
            color: options.color ? Number(options.color.replace('#', '0x')) : null,
            footer: options.footer ? { text: options.footer } : null,
            image: options.image ? { url: options.image } : null,
            thumbnail: options.thumbnail ? { url: options.thumbnail } : null,
            author: options.author ? {
                name: options.author,
                icon_url: options.authoricon
            } : null,
            timestamp: new Date()
        };

        await message.channel.send({ embeds: [embed] });
    }
};
