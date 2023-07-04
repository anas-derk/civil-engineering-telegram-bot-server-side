let {
    channelId,
    channeURL,
    BASE_API_URL,
    subjectNames,
    userChoises,
} = require("./data");

const axios = require("axios");

async function getCustomSubjects(apiRoute) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}`);
    const data = await res.data;
    return data;
}

async function getCustomFiles(year, season, subject, apiRoute) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}?year=${year}&season=${season}&subject=${subject}`);
    const data = await res.data;
    return data;
}

async function getCustomFileData(apiRoute, fileId) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}/${fileId}`);
    const data = await res.data;
    return data;
}

async function getAllSubjects(apiRoute) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}`);
    const data = await res.data;
    return data;
}

async function handleStartBot(bot, msg) {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const { addNewUser } = require("../models/users.model");
        await addNewUser(chatId, userId, msg.from.username);
        userChoises[chatId] = { year: null, season: null, service: null, subject: null, fileId: null };
        const data = await getAllSubjects("/subjects/all-subjects");
        subjectNames = data.map((subject) => subject.name);
        await bot.sendMessage(chatId, "مرحباً بك في البوت الخاص بنا", {
            reply_markup: {
                keyboard: [
                    ["/start"],
                ],
                resize_keyboard: true,
            }
        });
        const memberInfo = await bot.getChatMember(channelId, userId);
        if (memberInfo.status === "left") {
            await bot.sendMessage(chatId, "عذراً أنت لست مشتركاً في قناتنا الرجاء الاشترك على الرابط : " + channeURL);
        } else {
            await bot.sendMessage(chatId, "الرجاء اختيار السنة", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "سنة أولى", callback_data: "first-year" }],
                        [{ text: "سنة ثانية", callback_data: "second-year" }],
                        [{ text: "سنة ثالثة", callback_data: "third-year" }],
                        [{ text: "سنة رابعة", callback_data: "fourth-year" }],
                        [{ text: "سنة خامسة", callback_data: "fifth-year" }],
                    ],
                }
            })
        }
    } catch (err) {
        console.log(err);
    }
}

async function handleCallBackQuery(bot, query) {
    const selectedValue = query.data;
    const chatId = query.message.chat.id;
    if (!userChoises[chatId]) {
        userChoises[chatId] = { year: null, season: null, service: null, subject: null, fileId: null };
    }
    try {
        if (selectedValue === "first-year"
            || selectedValue === "second-year"
            || selectedValue === "third-year"
            || selectedValue === "fourth-year"
            || selectedValue === "fifth-year"
        ) {
            userChoises[chatId] = { year: selectedValue, season: null, service: null, subject: null, fileId: null };
            await bot.sendMessage(chatId, "الرجاء اختيار الفصل", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "فصل أول", callback_data: "first-season" }],
                        [{ text: "فصل ثاني", callback_data: "second-season" }],
                    ],
                }
            });
        } else if (selectedValue === "first-season" || selectedValue === "second-season") {
            userChoises[chatId] = {
                year: userChoises[chatId].year,
                season: selectedValue,
                service: null,
                subject: null,
                fileId: null
            };
            await bot.sendMessage(chatId, "الرجاء اختيار الخدمة المطلوبة", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "محاضرات", callback_data: "lectures" }],
                        [{ text: "دورات", callback_data: "courses" }],
                        [{ text: "نوط", callback_data: "medallions" }],
                    ],
                }
            });
        } else if (selectedValue === "lectures" || selectedValue === "courses" || selectedValue === "medallions") {
            userChoises[chatId] = {
                year: userChoises[chatId].year,
                season: userChoises[chatId].season,
                service: selectedValue,
                subject: null,
                fileId: null
            };
            const data = await getCustomSubjects(`/subjects/all-custom-subjects?year=${userChoises[chatId].year}&season=${userChoises[chatId].season}`);
            if (data.length === 0) {
                bot.sendMessage(chatId, "عذراً لا يوجد مواد حالياً");
            } else {
                const subjects = data.map((subject) => [{ text: subject.name, callback_data: subject.name }]);
                await bot.sendMessage(chatId, "الرجاء اختيار المادة", {
                    reply_markup: {
                        inline_keyboard: subjects,
                    }
                });
            }
        }
        else if (subjectNames.includes(selectedValue)) {
            userChoises[chatId] = {
                year: userChoises[chatId].year,
                season: userChoises[chatId].season,
                service: userChoises[chatId].service,
                subject: selectedValue,
                fileId: null
            };
            switch (userChoises[chatId].service) {
                case "medallions": {
                    const data = await getCustomFiles(userChoises[chatId].year, userChoises[chatId].season, userChoises[chatId].subject, "/medallions/all-custom-medallions", chatId);
                    if (data.length === 0) {
                        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
                    } else {
                        const customFiles = data.map((file) => [{ text: file.name, callback_data: file._id }]);
                        await bot.sendMessage(chatId, "الرجاء اختيار اسم الملف المطلوب", {
                            reply_markup: {
                                inline_keyboard: customFiles,
                            }
                        });
                    }
                    break;
                }
                case "courses": {
                    const data = await getCustomFiles(userChoises[chatId].year, userChoises[chatId].season, userChoises[chatId].subject, "/courses/all-custom-courses", chatId);
                    if (data.length === 0) {
                        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
                    } else {
                        const customFiles = data.map((file) => [{ text: file.name, callback_data: file._id }]);
                        await bot.sendMessage(chatId, "الرجاء اختيار اسم الملف المطلوب", {
                            reply_markup: {
                                inline_keyboard: customFiles,
                            }
                        });
                    }
                    break;
                }
                case "lectures": {
                    const data = await getCustomFiles(userChoises[chatId].year, userChoises[chatId].season, userChoises[chatId].subject, "/lectures/all-custom-lectures", chatId);
                    if (data.length === 0) {
                        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
                    } else {
                        const customFiles = data.map((file) => [{ text: file.name, callback_data: file._id }]);
                        await bot.sendMessage(chatId, "الرجاء اختيار اسم الملف المطلوب", {
                            reply_markup: {
                                inline_keyboard: customFiles,
                            }
                        });
                    }
                    break;
                }
                default: {
                    console.log(err);
                }
            }
        } else {
            userChoises[chatId].fileId = selectedValue;
            switch (userChoises[chatId].service) {
                case "medallions": {
                    const data = await getCustomFile("/medallions/custom-medallion-file", userChoises[chatId].fileId);
                    if (data) {
                        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
                    } else {
                        const fileUrl = `${BASE_API_URL}/${data.fileUrl}`;
                        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                        await bot.sendDocument(chatId, response.data, {}, {
                            filename: data.name,
                            contentType: "application/pdf",
                        });
                    }
                    break;
                }
                case "courses": {
                    const data = await getCustomFile("/courses/custom-course-file", userChoises[chatId].fileId);
                    if (data) {
                        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
                    } else {
                        const fileUrl = `${BASE_API_URL}/${data.fileUrl}`;
                        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                        await bot.sendDocument(chatId, response.data, {}, {
                            filename: data.name,
                            contentType: "application/pdf",
                        });
                    }
                    break;
                }
                case "lectures": {
                    const data = await getCustomFileData("/lectures/custom-lecture-file", userChoises[chatId].fileId);
                    if (Object.keys(data).length === 0) {
                        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
                    } else {
                        const fileUrl = `${BASE_API_URL}/${data.fileUrl}`;
                        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                        await bot.sendDocument(chatId, response.data, {}, {
                            filename: data.name,
                            contentType: "application/pdf",
                        });
                    }
                    break;
                }
                default: {
                    console.log(err);
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    handleStartBot,
    handleCallBackQuery,
}