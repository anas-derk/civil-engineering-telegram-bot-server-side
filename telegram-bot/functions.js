const axios = require("axios");

const BASE_API_URL = require("../global/BASE_API_URL");

async function getCustomSubjects(apiRoute) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}`);
    const data = await res.data;
    return data;
}

async function getCustomFile(year, season, apiRoute, chatId) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}?year=${year}&season=${season}`);
    const data = await res.data;
    if (data.length === 0) {
        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
    } else {
        const fileUrl = `${BASE_API_URL}/${data[0].fileUrl}`;
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        await bot.sendDocument(chatId, response.data);
    }
}

async function processUserChoices(chatId, choises) {
    try {
        switch (choises.service) {
            case "medallions": {
                await getCustomFile(choises.year, choises.season, "/medallions/custom-medallion-file", chatId);
                break;
            }
            case "courses": {
                await getCustomFile(choises.year, choises.season, "/courses/custom-course-file", chatId);
                break;
            }
            case "lectures": {
                await getCustomFile(choises.year, choises.season, "/lectures/custom-lecture-file", chatId);
                break;
            }
            default: {
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getCustomSubjects,
    getCustomFile,
    processUserChoices,
}