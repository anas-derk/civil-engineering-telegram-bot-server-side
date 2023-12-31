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

async function getCustomCourseFile(fileId) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب رابط الملف المحدد في جدول الكورسات
        const courseFile = await coursesModel.findById(fileId);
        return courseFile;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllCustomCourses(filteredData) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل روابط الكورسات في جدول الكورسات
        const courses = await coursesModel.find({
            year: filteredData.year,
            season: filteredData.season,
            subject: filteredData.subject,
        });
        return courses;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteCustomCourseFile(fileId) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث عن دورة لها نفس رقم المعرّف وحذفه
        await coursesModel.deleteOne({ _id: fileId });
        // إرجاع رسالة نجاح العملية
        return "تم حذف الملف بنجاح";
    }catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewFile,
    getCustomCourseFile,
    getAllCustomCourses,
    deleteCustomCourseFile,
}