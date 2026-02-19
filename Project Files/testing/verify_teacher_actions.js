const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('teacher_action_output.txt', msg + '\n');
};

const verifyActions = async () => {
    fs.writeFileSync('teacher_action_output.txt', '');
    try {
        log('1. Logging in as Teacher...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'teacher@gmail.com',
            password: 'teacher123'
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        log('Login successful.');

        // 2. Create Course
        log('\n2. Creating Course...');
        const courseData = {
            title: 'Test Course ' + Date.now(),
            description: 'Test Description',
            category: 'Test Category',
            price: 10
        };
        const createRes = await axios.post(`${BASE_URL}/courses`, courseData, config);
        const courseId = createRes.data._id;
        log(`Course Created: ${createRes.data.title} (${courseId})`);

        // 3. Update Course
        log('\n3. Updating Course...');
        const updateData = {
            title: createRes.data.title + ' (Updated)',
            price: 20
        };
        const updateRes = await axios.put(`${BASE_URL}/courses/${courseId}`, updateData, config);
        log(`Course Updated: ${updateRes.data.title}, Price: ${updateRes.data.price}`);

        // 4. Delete Course
        log('\n4. Deleting Course...');
        await axios.delete(`${BASE_URL}/courses/${courseId}`, config);
        log('Course Deleted.');

        // 5. Verify Deletion
        try {
            await axios.get(`${BASE_URL}/courses/${courseId}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                log('Verification: Course not found (Good).');
            } else {
                log('Verification failed: ' + error.message);
            }
        }

    } catch (error) {
        log('Verification failed: ' + (error.response?.data?.message || error.message));
    }
};

verifyActions();
