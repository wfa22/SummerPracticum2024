import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './ParseForm.css';

const ParseForm = ({ setSearchParams }) => {
    const [formData, setFormData] = useState({
        text: '',
        area: '',
        salary_from: '',
        salary_to: '',
        employment: '',
        schedule: '',
        experience: '',
        education: ''
    });
    const [areas, setAreas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/areas/')
            .then(response => {
                const areaOptions = response.data.map(area => ({
                    value: area.area_id,
                    label: area.name
                }));
                setAreas(areaOptions);
            })
            .catch(error => {
                console.error('There was an error fetching the areas!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAreaChange = (selectedOption) => {
        setFormData({
            ...formData,
            area: selectedOption ? selectedOption.value : ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            salary_from: formData.salary_from ? parseInt(formData.salary_from) : null,
            salary_to: formData.salary_to ? parseInt(formData.salary_to) : null,
        };

        const filteredData = Object.fromEntries(
            Object.entries(dataToSend).filter(([_, v]) => v != null && v !== '')
        );

        axios.post('http://localhost:8000/api/parse/', filteredData)
            .then(response => {
                setSearchParams(filteredData);
                navigate('/vacancies');
            })
            .catch(error => {
                console.error('There was an error parsing the vacancies!', error);
            });
    };

    return (
        <form className="parse-form" onSubmit={handleSubmit}>
            <input type="text" name="text" value={formData.text} onChange={handleChange} placeholder="Keywords"/>
            <Select
                name="area"
                options={areas}
                onChange={handleAreaChange}
                placeholder="Select Area"
                isClearable
                isSearchable
            />
            <input type="number" name="salary_from" value={formData.salary_from} onChange={handleChange}
                   placeholder="Salary From"/>
            <input type="number" name="salary_to" value={formData.salary_to} onChange={handleChange}
                   placeholder="Salary To"/>
            <select name="employment" value={formData.employment} onChange={handleChange} defaultValue="">
                <option value="" disabled hidden>Employment</option>
                <option value="full">Полная занятость</option>
                <option value="part">Частичная занятость</option>
                <option value="project">Проектная работа/разовое задание</option>
                <option value="volunteer">Волонтерство</option>
                <option value="probation">Стажировка</option>
            </select>
            <select name="schedule" value={formData.schedule} onChange={handleChange} defaultValue="">
                <option value="" disabled hidden>Schedule</option>
                <option value="fullDay">Полный день</option>
                <option value="shift">Сменный график</option>
                <option value="flexible">Гибкий график</option>
                <option value="remote">Удаленная работа</option>
                <option value="flyInFlyOut">Вахтовый метод</option>
            </select>
            <select name="experience" value={formData.experience} onChange={handleChange} defaultValue="">
                <option value="" disabled hidden>Experience</option>
                <option value="noExperience">Нет опыта</option>
                <option value="between1And3">От 1 года до 3 лет</option>
                <option value="between3And6">От 3 до 6 лет</option>
                <option value="moreThan6">Более 6 лет</option>
            </select>
            <select name="education" value={formData.education} onChange={handleChange} defaultValue="">
                <option value="" disabled hidden>Education</option>
                <option value="special_secondary">Среднее специальное</option>
                <option value="higher">Высшее</option>
            </select>
            <button type="submit">Parse Vacancies</button>
        </form>
    );
};

export default ParseForm;