// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + subjectsModel

const { mongoose, subjectsModel } = require("./all.models");

async function getAllCustomSubjects(filteredData) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل أسماء المواد بحسب السنة والفصل في جدول المواد
        const subjects = await subjectsModel.find({
            year: filteredData.year,
            season: filteredData.season,
        });
        return subjects;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function postAllSubjects(subjects) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // نشر كل أسماء المواد
        await subjectsModel.insertMany(subjects);
        return "تم النشر بنجاح";
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllSubjects() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل أسماء المواد  في جدول المواد
        const subjects = await subjectsModel.find({});
        return subjects;
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    getAllCustomSubjects,
    postAllSubjects,
    getAllSubjects,
}