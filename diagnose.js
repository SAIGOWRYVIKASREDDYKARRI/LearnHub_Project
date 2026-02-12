const fs = require('fs');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('diagnosis_output.txt', msg + '\n');
};

const runDiagnosis = async () => {
    fs.writeFileSync('diagnosis_output.txt', ''); // Clear file
    try {
        // Check Teacher
        log('1. Logging in as Teacher...');
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'teacher@gmail.com',
                password: 'teacher123'
            });
            log('Teacher Login response data: ' + JSON.stringify(loginRes.data, null, 2));
        } catch (e) {
            log('Teacher login failed: ' + e.message);
        }

        // Check Admin
        log('\n2. Logging in as Admin...');
        try {
            const loginRes2 = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@gmail.com',
                password: 'admin123'
            });
            log('Admin Login response data: ' + JSON.stringify(loginRes2.data, null, 2));
        } catch (e) {
            log('Admin login failed: ' + e.message);
        }

    } catch (error) {
        log('Diagnosis failed: ' + (error.response?.data?.message || error.message));
    }
};

runDiagnosis();
