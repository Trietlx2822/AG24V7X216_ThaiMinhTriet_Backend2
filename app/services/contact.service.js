const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    // Thêm các phương thức làm việc với CSDL tại đây
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
            married: payload.married,
            hobbies: Array.isArray(payload.hobbies) ? payload.hobbies : []
        };
        // Remove undefined fields
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.insertOne(contact);
        // Trả về document vừa tạo
        return await this.Contact.findOne({ _id: result.insertedId });
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(new RegExp(name)), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);

        const result = await this.Contact.updateOne(filter, { $set: update });

        if (result.matchedCount === 0) {
            // Không tìm thấy contact nào để cập nhật
            return null;
        }

        // Sau khi update, truy vấn lại document để trả về kết quả thật
        return await this.findById(id);
    }

    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }

}


module.exports = ContactService;
