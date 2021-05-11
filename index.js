require('dotenv').config();
const Discord = require('discord.js');

const Prefix = "!";

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

client.once('ready', () => console.log("Bot ready !"));
client.once('reconnecting', () => console.log("Reconnected !"));
client.once('disconnect', () => console.log("Disconnected !"));

client.on('message', async (message) => {
	//Listen to send messages on the server
    if (message.content.startsWith('!kick')){
        const user = message.mentions.users.first();
        if (user) {
            // Now we get the member from the user
            const member = message.guild.member(user);
            // If the member is in the guild
            if (member) {

                member
                    .kick('Optional reason that will display in the audit logs')
                    .then(() => {
                        // We let the message author know we were able to kick the person
                        message.reply(`Successfully kicked ${user.tag}`);
                    })
                    .catch(err => {
                        // An error happened
                        // This is generally due to the bot not being able to kick the member,
                        // either due to missing permissions or role hierarchy
                        message.reply('I was unable to kick the member');
                        // Log the error
                        console.error(err);
                    });
            } else {
                // The mentioned user isn't in this guild
                message.reply("That user isn't in this guild!");
            }
            // Otherwise, if no user was mentioned
        } else {
            message.reply("You didn't mention the user to kick!");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
