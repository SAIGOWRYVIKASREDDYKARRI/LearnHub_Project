const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('refined_check_output.txt', msg + '\n');
};

const checkRefinedLogs = async () => {
    fs.writeFileSync('refined_check_output.txt', '');
    try {
        // 1. Admin Login (Should NOT be in logs now)
        log('1. Logging in as Admin...');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        const adminToken = adminLogin.data.token;
        log('Admin login successful.');

        // 2. Teacher Login & Action (Should be in logs)
        log('\n2. Logging in as Teacher...');
        const teacherLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'teacher@gmail.com',
            password: 'teacher123'
        });
        const teacherToken = teacherLogin.data.token;

        // Create and Delete Course as Teacher
        const courseRes = await axios.post(`${BASE_URL}/courses`, {
            title: 'Temp Course for Log Check',
            description: 'Desc',
            category: 'Test',
            price: 0
        }, { headers: { Authorization: `Bearer ${teacherToken}` } });
        const courseId = courseRes.data._id;

        await axios.delete(`${BASE_URL}/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${teacherToken}` }
        });
        log('Teacher created and deleted a course.');

        // 3. Fetch Logs as Admin
        log('\n3. Fetching Activity Logs...');
        const logsRes = await axios.get(`${BASE_URL}/activities`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        const logs = logsRes.data;
        log(`Fetched ${logs.length} logs.`);

        // Check for Admin Logs
        const adminLogs = logs.filter(l => l.user?.role === 'admin');
        if (adminLogs.length > 0) {
            log(`FAILURE: Found ${adminLogs.length} admin logs!`);
        } else {
            log('SUCCESS: No admin logs found.');
        }

        // Check for Teacher Delete Log
        const deleteLog = logs.find(l => l.action === 'DELETE_COURSE' && l.details.includes('Temp Course'));
        if (deleteLog) {
            log('SUCCESS: Found DELETE_COURSE log.');
        } else {
            log('FAILURE: DELETE_COURSE log not found.');
        }

    } catch (error) {
        log('Verification failed: ' + (error.response?.data?.message || error.message));
    }
};

checkRefinedLogs();
