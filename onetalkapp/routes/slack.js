var express = require('express');
var router = express.Router();

//Social Media Apps
// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require('@slack/bolt');

const app = new App({
    token:"xoxp-3527237299956-3510278336167-3548649189584-63970400d36dbf0be6d4ef44c858050c",
    appToken: "xapp-1-A03G4JW22D6-3551001933927-cc759b5779d6e7b95efc44dc03f2f064b57e7e25137a2ec70a88c2db1c5684c3",
    socketMode: true,
});
(async () => {
    await app.start();
    console.log('⚡️ Bolt app started');
})();

// Find conversation ID using the conversations.list method
async function findConversation(name) {
    try {
        // Call the conversations.list method using the built-in WebClient
        const result = await app.client.conversations.list({
            // The token you used to initialize your app
            token: "xoxp-3527237299956-3510278336167-3548649189584-63970400d36dbf0be6d4ef44c858050c"
        });

        for (const channel of result.channels) {
            if (channel.name === name) {
                conversationId = channel.id;

                // Print result
                // console.log("Found conversation ID: " + conversationId);
                // Break from for loop
                return Promise.resolve(conversationId);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}


// Store conversation history
let conversationHistory = [];
async function getMessageHistoryForChannel(channelId) {
    try {
        // Call the conversations.history method using WebClient
        const result = await app.client.conversations.history({
            channel: channelId
        });
        conversationHistory = result.messages;
        console.log(conversationHistory.length + " messages found in " + channelId);
        console.log(conversationHistory);
        // Print results
    } catch (error) {
        console.error(error);
    }
}

async function postMessageToChannel(channelId, message){
    try {
        // Call the chat.postMessage method using the WebClient
        const result = await app.client.chat.postMessage({
            channel: channelId,
            text: message
        });

        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}

let users = [];
async function getUserInfoAPI(userId){
    try {
        // Call the chat.postMessage method using the WebClient
        const profile = await app.client.users.profile.get({
            token: "xoxp-3527237299956-3510278336167-3548649189584-63970400d36dbf0be6d4ef44c858050c",
            user: userId
        });
        console.log("dddddddddddddddddd", profile);
        users.push(profile.profile);
        return profile.profile;
    }
    catch (error) {
        console.error(error);
    }
}

console.log("Below is the user Info API call result")
getUserInfoAPI("U03F0869W4X");

// let chatHistory = []
// async function beautifyConversationseHistory(){
//     let history = conversationHistory;
//     // Name of User
//     // Image of User
//     // Text by user
//     //Emoji
//     for(const h of conversationHistory) {
//         var user = getUserInfoAPI(h.user)
//         var user_name = (await user).real_name
//         var user_image = (await user).image_original
//         var user_text = h.text
//         var obj = {"Name": user_name, "Avatar": user_image, "Text": user_text}
//         chatHistory.push(obj);
//         console.log(chatHistory);
//     }
//     var s = JSON.stringify(chatHistory);
//     console.log(s);
//     return s;
// }

console.log("////////////////////////////////////////////////////")
// beautifyConversationseHistory();

/* GET Slack Message History for Particular Channel. */
router.get('/message-history/:channelName',async (req, res) => {
    console.log(req.params.channelName);
    let channelName = req.params.channelName;
    let channelId = await findConversation(channelName);
    console.log(channelId);
    getMessageHistoryForChannel(channelId);
    res.end(JSON.stringify(conversationHistory));
});

router.get('/post-message/:channelId',async (req, res) => {
    console.log(req.params.channelId);
    let channelId1 = req.params.channelId;
    console.log(channelId1);
    postMessageToChannel(channelId1, "Hello there. Test message from OneTalk");
});

getMessageHistoryForChannel("C03F086AV2T");

module.exports = router;