const adminRouter = require("express").Router();

const upload = require("../global/multer.config");

adminRouter.post("/add-new-file", upload.single("file") , (req, res) => {
    const data = req.body;
    const file = req.file;
    const fullData = {
        ...Object.assign({}, data),
        fileUrl: file.path,
    }
    switch (data.service) {
        case "medallion": {
            const { addNewFile } = require("../models/medallion.model");
            addNewFile(fullData).then((result) => {
                res.json(result);
            }).catch(err => console.log(err));
            break;
        }
        case "courses": {
            const { addNewFile } = require("../models/courses.model");
            addNewFile(fullData).then((result) => {
                res.json(result);
            }).catch(err => console.log(err));
            break;
        }
        case "lectures": {
            const { addNewFile, getCustomLectureFile } = require("../models/lectures.model");
            addNewFile(fullData).then((result) => {
                res.json(result);
            }).catch(err => console.log(err));
            break;
        }
        default: {
            res.json("Error !!");
        }
    }
});

adminRouter.get("/login", (req, res) => {
    // جلب الإيميل وكلمة السر المطلوبين للتسجيل
    let email = req.query.email,
        password = req.query.password;
    // التحقق من أنّ الإيميل وكلمة السر قد تم إرسالهم بالفعل
    if (email.length > 0 && password.length > 0) {
        const { adminLogin } = require("../models/admin.model");
        adminLogin(email, password).then((result) => {
            // إرجاع النتيجة للمستخدم
            res.json(result);
        })
            // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية تسجيل الدخول
            .catch((err) => res.json(err));
    } else {
        // إرجاع رسالة خطأ في حالة لم يتم إرسال الإيميل أو كلمة السر أو كلاهما
        res.status(500).json("عذراً لم يتم إرسال الإيميل أو كلمة السر أو كلاهما !!");
    }
});

adminRouter.get("/admin-info/:adminId", (req, res) => {
    // جلب رقم معرّف المسؤول
    let adminId = req.params.adminId;
    // إذا لم يُرسل رقم المعرّف فعلياً فإننا نرجع رسالة خطأ
    if (!adminId) {
        res.json("الرجاء إرسال معرّف للمسؤول !!!");
    } else {
        // جلب معلومات المسؤول
        const { getAdminInfo } = require("../models/admin.model");
        getAdminInfo(adminId).then((result) => {
            // إرجاع النتيجة للمستخدم
            res.json(result);
        })
            // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية جلب بيانات المسؤول
            .catch((err) => res.json(err));
    }
});

adminRouter.post("/add-new-ad", async (req, res) => {
    const { addAds } = require("../models/ads.model");
    try {
        const result = await addAds(req.body.content);
        if (result === "تهانينا ، لقد تمّ إضافة الإعلان بنجاح") {
            const { getAllUsers } = require("../models/users.model");
            const users = await getAllUsers();
            if (users.length > 0) {
                const bot = require("../server");
                for (let i = 0; i < users.length; i++) {
                    await bot.sendMessage(users[i].chatId, req.body.content);
                }
            }
        }
        res.json(result);
    } catch(err) {
        console.log(err);
        res.status(500).json("عذراً حدث خطأ ، الرجاء إعادة العملية !!");
    }
});

module.exports = adminRouter;