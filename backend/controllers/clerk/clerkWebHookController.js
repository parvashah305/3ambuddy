const { verifyWebhook } = require('@clerk/express/webhooks')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const clerkWebHookController = async (req, res) => {
    try {
        const webhookEvent = await verifyWebhook(req)

        const data = webhookEvent.data
        const eventType = webhookEvent.type

        if (eventType == "user.created" || eventType == "user.updated") {
            const uuid = data.id;
            const name = `${data.first_name} ${data.last_name}`;
            const email = data.email_addresses[0].email_address;
            const username = data.username;

            prisma.user.upsert({
                where: {
                    uuid
                },
                update: {
                    name, email, username,
                },
                create: {
                    uuid, name, email, username
                }
            }).then((result)=>{
                console.log(`${eventType == "user.created" ? "User created: " : "User updated: "} ${JSON.stringify({ uuid: uuid, name: name })}`)
            }).catch((err)=>{
                console.error('Failed to upsert user from Clerk webhook:', err);
            })
        }else if (eventType == "user.deleted"){
            const uuid = data.id;
            const name = data.email;
            prisma.user.delete({
                where: {
                    uuid
                }
            }).then((result)=>{
                console.log(`User deleted: ${JSON.stringify({ uuid: uuid, name: name })}`)
            }).catch((err)=>{
                console.error('Failed to delete user from Clerk webhook:', err);
            })
        }

        // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        // console.log('Webhook payload:', webhookEvent.data)

        return res.send('Webhook received')
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return res.status(400).send('Error verifying webhook')
    }
}

module.exports = clerkWebHookController