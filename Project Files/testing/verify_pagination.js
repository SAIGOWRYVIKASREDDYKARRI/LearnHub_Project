const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('pagination_check_output.txt', msg + '\n');
};

const checkPaginationData = async () => {
    fs.writeFileSync('pagination_check_output.txt', '');
    try {
        log('1. Logging in as Teacher...');
        const teacherLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'teacher@gmail.com',
            password: 'teacher123'
        });
        const teacherToken = teacherLogin.data.token;

        // Generate 15 logs
        log('2. Generating 15 logs...');
        for (let i = 0; i < 15; i++) {
            await axios.post(`${BASE_URL}/courses`, {
                title: `Pagination Test Course ${i}`,
                description: 'Desc',
                category: 'Test',
                price: 0
            }, { headers: { Authorization: `Bearer ${teacherToken}` } });
        }
        log('Logs generated.');

        // Login as Admin
        log('\n3. Fetching Logs as Admin...');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        const adminToken = adminLogin.data.token;

        const logsRes = await axios.get(`${BASE_URL}/activities`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        const logs = logsRes.data;
        log(`Total Logs Fetched: ${logs.length}`);

        if (logs.length >= 15) {
            log('SUCCESS: Sufficient logs for pagination test available.');
        } else {
            log('WARNING: Not enough logs to fully test pagination UI (need > 10).');
        }

    } catch (error) {
        log('Verification failed: ' + (error.response?.data?.message || error.message));
    }
};

checkPaginationData();
