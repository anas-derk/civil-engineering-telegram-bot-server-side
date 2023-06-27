// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + coursesModel

const { mongoose, coursesModel } = require("./all.models");

async function addNewFile(data) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث في جدول الكورسات عن كورس له نفس رابط الملف تماماً
        let fileUrl = await coursesModel.findOne({ fileUrl: data.fileUrl });
        // في حالة كان يوجد رابط ملف مطابق فإننا نعيد رسالة خطأ
        if (fileUrl) {  
            mongoose.disconnect();
            return "عذراً يوجد ملف سابق بنفس الرابط تماماً";
        }
        else {
            // في حالة لم يكن يوجد رابط ملف مطابق فإننا نضيف رابط ملف جديد
            let newFile = new coursesModel({
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
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getCustomCourseFile(requestInfo) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط الكورسات في جدول الكورسات
        const courses = await coursesModel.find({
            year: requestInfo.year,
            season: requestInfo.season,
        });
        return courses;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllCourses() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط الكورسات في جدول الكورسات
        const courses = await coursesModel.find({});
        return courses;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewFile,
    getCustomCourseFile,
    getAllCourses,
}