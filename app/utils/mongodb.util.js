const { MongoClient } = require("mongodb");

class MongoDB {
    static async connect(uri) {
        if (this.client) {
            console.log("Reusing existing MongoDB client.");
            return this.client;
        }

        try {
            const client = new MongoClient(uri);
            await client.connect();
            console.log("Connected successfully to MongoDB!");
            this.client = client;
            return this.client;
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }
}

module.exports = MongoDB;
