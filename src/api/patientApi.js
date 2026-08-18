import axios from "axios";

const BASE_URL =
  "http://41.188.172.204:3033/test/patient-registration";

export const getPatients = async (registrationId, page = 1) => {
  const response = await axios.get(BASE_URL, {
    params: {
      Registration_ID: registrationId,
      page,
    },
  });

  return response.data.data;
};

export const updatePatient = async (registrationId, payload) => {
  const response = await axios.put(
    `${BASE_URL}/${registrationId}`,
    payload
  );

  return response.data;
};