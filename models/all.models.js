// استيراد مكتبة ال mongoose للتعامل مع قاعدة البيانات

const mongoose = require("mongoose");

// تعريف كائن هيكل جدول النوط

const medallionSchema = new mongoose.Schema({
    year: String,
    season: String,
    fileUrl: String,
});

// إنشاء كائت جدول النوط باستخدام الهيكلية السابقة

const medallionModel = mongoose.model("medallion", medallionSchema);

// تعريف كائن هيكل جدول الدورات

const coursesSchema = new mongoose.Schema({
    year: String,
    season: String,
    fileUrl: String,
});

// إنشاء كائت جدول الدورات باستخدام الهيكلية السابقة

const coursesModel = mongoose.model("course", coursesSchema);

// تعريف كائن هيكل جدول المحاضرات

const lecturesSchema = new mongoose.Schema({
    year: String,
    season: String,
    fileUrl: String,
});

// إنشاء كائت جدول الدورات باستخدام الهيكلية السابقة

const lecturesModel = mongoose.model("lecture", lecturesSchema);

module.exports = {
    mongoose,
    medallionModel,
    coursesModel,
    lecturesModel,
}