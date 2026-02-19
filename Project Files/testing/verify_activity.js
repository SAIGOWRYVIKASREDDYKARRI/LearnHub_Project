const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('activity_check_output.txt', msg + '\n');
};

const checkActivityLogs = async () => {
    fs.writeFileSync('activity_check_output.txt', '');
    try {
        // 1. Generate Logs: Login as Teacher
        log('1. Logging in as Teacher to generate log...');
        const teacherLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'teacher@gmail.com',
            password: 'teacher123'
        });
        log('Teacher login successful.');

        // 2. Generate Logs: Login as Admin
        log('\n2. Logging in as Admin to fetch logs...');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        const adminToken = adminLogin.data.token;
        log('Admin login successful.');

        // 3. Fetch Logs
        log('\n3. Fetching Activity Logs...');
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        };
        const logsRes = await axios.get(`${BASE_URL}/activities`, config);

        log(`Fetched ${logsRes.data.length} logs.`);

        // Print last 5 logs
        const last5 = logsRes.data.slice(0, 5);
        last5.forEach((l, i) => {
            log(`Log ${i}: [${l.action}] ${l.user?.name} (${l.user?.role}) - ${l.details} at ${l.createdAt}`);
        });

    } catch (error) {
        log('Verification failed: ' + (error.response?.data?.message || error.message));
    }
};

checkActivityLogs();
