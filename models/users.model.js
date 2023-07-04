// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + usersModel

const { mongoose, usersModel } = require("./all.models");

async function addNewUser(chatId, userId, userName) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث في جدول المستخدمين عن مستخدم له نفس المعرّف
        const user = await usersModel.findOne({
            chatId: chatId,
        });
        if (!user) {
            // في حالة لم يكن يوجد مستخدم مطابق فإننا ننشأ مستخدم جديد
            const newUser = new usersModel({
                chatId: chatId,
                userId: userId,
                userName: userName,
            });
            // حفظ الإعلان في قاعدة البيانات
            await newUser.save();
            // في حالة نجاح العملية فأننا نقطع الاتصال بقاعدة البيانات ونعيد رسالة نجاح
            await mongoose.disconnect();
            return "تهانينا ، لقد تمّ إضافة السمتخدم بنجاح";
        }
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllUsers() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        const userList = await usersModel.find({});
        // قطع الاتصال بقاعدة البيانات وإعادة بيانات الإعلانات
        await mongoose.disconnect();
        return userList;
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        await mongoose.disconnect();
        throw Error(err);
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    addNewUser,
    getAllUsers,
}