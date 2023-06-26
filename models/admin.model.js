// استيراد الملف الذي يحتوي على رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + adminModel

const { mongoose, adminModel } = require("./all.models");

// استيراد مكتبة التشفير

const bcrypt = require("bcryptjs");

async function adminLogin(email, password) {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(DB_URL);
    // البحث في جدول المسؤولين عن إيميل مطابق
    let adminData = await adminModel.findOne({ email });
    // في حالة لم يكن يوجد بيانات لهذا الإيميل نرجج رسالة خطأ
    if (!adminData) {
        await mongoose.disconnect();
        return "عذراً البريد الالكتروني أو كلمة السر خاطئة ...";
    } else {
        // في حالة كانت توجد بيانات لهذا الإيميل نتحقق من كلمة السر هل صحيحية أم لا
        let isTruePassword = await bcrypt.compare(password, adminData.password);
        // في حالة كانت صحيحة نرجع رقم معرّف المسؤول
        if (isTruePassword) {
            await mongoose.disconnect();
            return adminData._id;
        } else {
            // في حالة لم تكن صحيحة نرجع رسالة خطأ
            await mongoose.disconnect();
            return "عذراً البريد الالكتروني أو كلمة السر خاطئة ...";
        }
    }
}

async function getAdminInfo(adminId) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // التحقق من أنّ المستخدم موجود عن طريق البحث في جدول المسؤولين عن بيانات رقم معرّف المسؤول
        let admin = await adminModel.findById(adminId);
        // قطع الاتصال بقاعدة البيانات
        await mongoose.disconnect();
        // في حالة كانت توجد بيانات لهذا المسؤول عندها نُرجع بياناته
        if (admin) return admin;
        // في حالة لم توجد بيانات نُرجع رسالة خطأ
        return "عذراً ، حساب المسؤول غير موجود";
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        await mongoose.disconnect();
        throw Error("عذراً توجد مشكلة ، الرجاء إعادة العملية !!!");
    }
}

module.exports = {
    adminLogin,
    getAdminInfo,
}