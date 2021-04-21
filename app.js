const { Botkit, BotkitConversation } = require('botkit');

const {WebAdapter} = require('botbuilder-adapter-web');

const adapter = new WebAdapter({});

const controller = new Botkit({
    adapter: adapter
});

controller.hears('hello','message,direct_message', function(bot, message) {
    bot.reply(message,'Hello yourself!');
});

controller.on('message', async(bot, message) => {
    bot.reply(message,'you typed random');
});

const MY_DIALOG_ID = 'hello';
let convo = new BotkitConversation(MY_DIALOG_ID, controller);

convo.say('Buudy!');

convo.ask('What is your name?', async(response, convo, bot) => {
    console.log(`user name is ${ response }`);
}, 'name');

convo.addAction('favorite_color');

convo.addMessage('Awesome {{vars.name}}!', 'favorite_color');
convo.addQuestion('Now, what is your favorite color?', async(response, convo, bot) => {
    console.log(`user favorite color is ${ response }`);
},'color', 'favorite_color');

convo.addAction('confirmation' ,'favorite_color');

convo.addQuestion('Your name is {{vars.name}} and your favorite color is {{vars.color}}. Is that right?', [
    {
        pattern: 'no',
        handler: async(response, convo, bot) => {
            await convo.gotoThread('favorite_color');
        }
    },{
        pattern: 'yes',
        handler: async(response, convo, bot) => {
            await bot.say('Thank you for the response');
        }
    },
    {
        default: true,
        handler: async(response, convo, bot) => {
            await bot.say(response, 'thank you for your response')
        }
    }
], 'confirm', 'confirmation');

controller.addDialog(convo);

controller.hears('dialog', 'message', async (bot, message) => {
    await bot.beginDialog('hello');
});