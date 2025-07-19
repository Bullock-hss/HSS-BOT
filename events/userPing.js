module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        // ID de l'utilisateur à surveiller
        const TARGET_USER_ID = '411002909766189066';
        
        if (
            message.mentions.users.has(TARGET_USER_ID) &&
            !message.author.bot
        ) {
            const reactions = ['👀', '🎯', '📢'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            
            try {
                message.react(randomReaction);
            } catch (err) {
                console.error('Erreur lors de la réaction:', err);
            }
        }
    }
};
