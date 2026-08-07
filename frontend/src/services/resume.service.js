import api from "../lib/axios";

const uploadResume = async (formData) => {
    const response = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

const getResume = async () => {
    const response = await api.get("/resume");
    return response.data;
};

const updateResume = async (data) => {
    const response = await api.patch(
        "/resume",
        data
    );

    return response.data;
};

const deleteResume = async () => {
    const response = await api.delete("/resume");
    return response.data;
};

export default {
    uploadResume,
    getResume,
    updateResume,
    deleteResume,
};