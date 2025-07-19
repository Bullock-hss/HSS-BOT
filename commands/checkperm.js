module.exports = {
    name: 'checkperm',
    description: 'Vérifie les permissions du bot ou d\'un rôle',
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.channel.send("Seuls les administrateurs peuvent utiliser cette commande.");
        }

        const allPerms = [
            { name: 'Administrateur', perm: 'Administrator' },
            // ...tous les perms existants...
        ];

        let target;
        let targetName;
        if (args.length > 0) {
            const roleName = args.join(' ').trim().toLowerCase();
            const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
            if (!role) return message.channel.send(`Rôle "${args.join(' ')}" introuvable.`);
            target = role;
            targetName = `le rôle **${role.name}**`;
        } else {
            target = message.guild.members.me;
            targetName = 'le bot';
        }

        let fields = [];
        allPerms.forEach(p => {
            let hasPerm;
            if (target instanceof require('discord.js').Role) {
                hasPerm = target.permissions.has(p.perm);
            } else {
                hasPerm = target.permissionsIn(message.channel).has(p.perm);
            }
            fields.push({
                name: p.name,
                value: hasPerm ? '✅' : '❌',
                inline: true
            });
        });

        for (let i = 0; i < fields.length; i += 25) {
            await message.channel.send({
                embeds: [{
                    title: `Permissions de ${targetName} dans ce salon`,
                    color: 0x3498db,
                    fields: fields.slice(i, i + 25),
                    timestamp: new Date()
                }]
            });
        }
    }
};
