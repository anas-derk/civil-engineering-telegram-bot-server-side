// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + lectureModel

const { mongoose, lecturesModel } = require("./all.models");

async function addNewFile(data) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث في جدول المحاضرات عن محاضرة لها نفس رابط الملف تماماً
        let fileUrl = await lecturesModel.findOne({ fileUrl: data.fileUrl });
        // في حالة كان يوجد رابط ملف مطابق فإننا نعيد رسالة خطأ
        if (fileUrl) {  
            mongoose.disconnect();
            return "عذراً يوجد ملف سابق بنفس الرابط تماماً";
        }
        else {
            // في حالة لم يكن يوجد رابط ملف مطابق فإننا نضيف رابط ملف جديد
            let newFile = new lecturesModel({
                year: data.year,
                season: data.season,
                subject: data.subject,
                name: data.name,
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

async function getCustomLectureFile(requestInfo) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط المحاضرات في جدول المحاضرات
        const lectures = await lecturesModel.find({
            year: requestInfo.year,
            season: requestInfo.season,
        });
        return lectures;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllCustomLectures(filteredData) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط المحاضرات في جدول المحاضرات
        const lectures = await lecturesModel.find({
            year: filteredData.year,
            season: filteredData.season,
            subject: filteredData.subject,
        });
        return lectures;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewFile,
    getCustomLectureFile,
    getAllCustomLectures,
}