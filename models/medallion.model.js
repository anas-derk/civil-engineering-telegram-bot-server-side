// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + courseModel

const { mongoose, medallionModel } = require("./all.models");

async function addNewFile(data) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث في جدول النوط عن كورس له نفس رابط الملف تماماً
        const fileUrl = await medallionModel.findOne({ fileUrl: data.fileUrl });
        // في حالة كان يوجد رابط ملف مطابق فإننا نعيد رسالة خطأ
        if (fileUrl) {  
            await mongoose.disconnect();
            return "عذراً يوجد ملف سابق بنفس الرابط تماماً";
        }
        else {
            // في حالة لم يكن يوجد رابط ملف مطابق فإننا نضيف رابط ملف جديد
            const newFile = new medallionModel({
                year: data.year,
                season: data.season,
                subject: data.subject,
                fileUrl: data.fileUrl,
            });
            // حفظ رابط الملف في قاعدة البيانات
            await newFile.save();
            // في حالة نجاح العملية فأننا نقطع الاتصال بقاعدة البيانات ونعيد رسالة نجاح
            mongoose.disconnect();
            return "تهانينا ، لقد تمّ إضافة رابط الملف بنجاح";
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getCustomMedallionFile(requestInfo) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط النوط في جدول النوط
        const medallions = await medallionModel.find({
            year: requestInfo.year,
            season: requestInfo.season,
        });
        return medallions;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllMedallions() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط النوط في جدول النوط
        const medallions = await medallionModel.find({});
        return medallions;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewFile,
    getCustomMedallionFile,
    getAllMedallions,
}