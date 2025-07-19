const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');

// Configuration du client avec tous les intents nécessaires
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ] 
});

// Initialisation des commandes et événements
client.commands = new Map();
client.events = new Map();

const loadCommands = () => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        client.commands.set(command.name, command);
        console.log(`Commande chargée: ${command.name}`);
    }
    console.log(`${client.commands.size} commandes chargées avec succès`);
};

const loadEvents = () => {
    const eventsPath = path.join(__dirname, 'events');
    
    // Vérifier si le dossier events existe
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath);
        console.log('Dossier events créé');
        return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    if (eventFiles.length === 0) {
        console.log('Aucun événement trouvé');
        return;
    }

    for (const file of eventFiles) {
        try {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            
            if (event.name && typeof event.execute === 'function') {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args));
                }
                console.log(`Événement chargé: ${event.name} (${file})`);
            } else {
                console.error(`L'événement ${file} est mal formaté`);
            }
        } catch (error) {
            console.error(`Erreur lors du chargement de l'événement ${file}:`, error);
        }
    }
};

// Événements
client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    loadCommands();
    loadEvents();
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!')) {
        await handleCommand(message);
    }
});

client.on('guildMemberAdd', handleNewMember);

async function handleCommand(message) {
    try {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (client.commands.has(commandName)) {
            await client.commands.get(commandName).execute(message, args);
        }
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande:', error);
        message.reply('Une erreur est survenue pendant l\'exécution de la commande.');
    }
}

async function handleNewMember(member) {
    const welcomeEmbed = {
        title: "Bienvenue dans la HsS Team",
        description: `Salut <@${member.id}> !\n\nNous sommes ravis de t'accueillir sur notre serveur.\n\n**Merci de respecter ces quelques règles :**\n• Reste poli et courtois avec tout le monde\n• Pas d'insultes, de propos haineux ou discriminatoires\n• Respecte la vie privée des autres\n• Pas de spam ou de flood\n\nAmuse-toi bien parmi nous ! 🎉`,
        color: 0x6a1b9a,
        footer: { text: "L'équipe HsS Team" },
        timestamp: new Date()
    };
    
    try {
        await member.send({ embeds: [welcomeEmbed] });
    } catch (err) {
        console.error('Erreur lors de l\'envoi du message de bienvenue:', err);
    }
}

// Gestion des erreurs globales
client.on('error', error => {
    console.error('Erreur Discord.js:', error);
});

process.on('unhandledRejection', error => {
    console.error('Promesse non gérée:', error);
});

client.login(token);
