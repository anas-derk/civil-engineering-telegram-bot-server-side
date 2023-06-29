const axios = require("axios");

const BASE_API_URL = require("../global/BASE_API_URL");

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

module.exports = {
    getCustomSubjects,
    getCustomFiles,
    getCustomFileData,
    getAllSubjects,
}