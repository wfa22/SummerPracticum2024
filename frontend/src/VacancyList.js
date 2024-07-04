import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VacancyList.css';
import parse from 'html-react-parser';

const VacancyList = () => {
    const [vacancies, setVacancies] = useState([]);
    const [searchParams, setSearchParams] = useState({
        city: '',
        keyword: '',
        salary_from: '',
        salary_to: '',
        employment: '',
        schedule: '',
        experience: '',
        education: ''
    });
    const [statistics, setStatistics] = useState({
        vacancyCount: 0,
        companyCount: 0,
        averageSalary: 0,
    });

    const currencyConversionRates = {
        USD: 80,
        KZT: 0.18,
        RUR: 1,
        UZS: 0.0065,
        BYR: 30,
        KGS: 0.91,
    };

    useEffect(() => {
        fetchVacancies();
    }, [searchParams]);

    const fetchVacancies = () => {
        axios.get('http://localhost:8000/api/vacancies/', { params: searchParams })
            .then(response => {
                const vacancies = response.data;
                setVacancies(vacancies);
                updateStatistics(vacancies);
            })
            .catch(error => {
                console.error('There was an error fetching the vacancies!', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVacancies();
    };

    const updateStatistics = (vacancies) => {
        const uniqueCompanies = new Set();
        let totalSalary = 0;
        let salaryCount = 0;

        vacancies.forEach(vacancy => {
            uniqueCompanies.add(vacancy.company);
            if (vacancy.salary_from && vacancy.salary_currency && currencyConversionRates[vacancy.salary_currency]) {
                totalSalary += vacancy.salary_from * currencyConversionRates[vacancy.salary_currency];
                salaryCount++;
            }
            if (vacancy.salary_to && vacancy.salary_currency && currencyConversionRates[vacancy.salary_currency]) {
                totalSalary += vacancy.salary_to * currencyConversionRates[vacancy.salary_currency];
                salaryCount++;
            }
        });

        setStatistics({
            vacancyCount: vacancies.length,
            companyCount: uniqueCompanies.size,
            averageSalary: salaryCount ? totalSalary / salaryCount : 0,
        });
    };

    return (
        <div className="vacancy-list">
            <h1>Job Vacancies</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={searchParams.city}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="keyword"
                    placeholder="Keyword"
                    value={searchParams.keyword}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="salary_from"
                    placeholder="Salary from"
                    value={searchParams.salary_from}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="salary_to"
                    placeholder="Salary to"
                    value={searchParams.salary_to}
                    onChange={handleInputChange}
                />
                <select name="employment" value={searchParams.employment} onChange={handleInputChange}>
                    <option value="">Employment</option>
                    <option value="full">Полная занятость</option>
                    <option value="part">Частичная занятость</option>
                    <option value="project">Проектная работа/разовое задание</option>
                    <option value="volunteer">Волонтерство</option>
                    <option value="probation">Стажировка</option>
                </select>
                <select name="schedule" value={searchParams.schedule} onChange={handleInputChange}>
                    <option value="">Schedule</option>
                    <option value="fullDay">Полный день</option>
                    <option value="shift">Сменный график</option>
                    <option value="flexible">Гибкий график</option>
                    <option value="remote">Удаленная работа</option>
                    <option value="flyInFlyOut">Вахтовый метод</option>
                </select>
                <select name="experience" value={searchParams.experience} onChange={handleInputChange}>
                    <option value="">Experience</option>
                    <option value="noExperience">Нет опыта</option>
                    <option value="between1And3">От 1 года до 3 лет</option>
                    <option value="between3And6">От 3 до 6 лет</option>
                    <option value="moreThan6">Более 6 лет</option>
                </select>
                <select name="education" value={searchParams.education} onChange={handleInputChange}>
                    <option value="">Education</option>
                    <option value="special_secondary">Среднее специальное</option>
                    <option value="higher">Высшее</option>
                </select>
                <button type="submit">Search</button>
            </form>
            <div className="statistics">
                <p>Total Vacancies: {statistics.vacancyCount}</p>
                <p>Unique Companies: {statistics.companyCount}</p>
                <p>Average Salary (RUR): {statistics.averageSalary.toFixed(2)}</p>
            </div>
            {vacancies.length > 0 ? (
                vacancies.map((vacancy) => (
                    <div key={vacancy.id} className="vacancy-item">
                        <div className="vacancy-title">{vacancy.title}</div>
                        <div className="vacancy-company">{vacancy.company}</div>
                        <div className="vacancy-salary">
                            {vacancy.salary_from ? `${vacancy.salary_from} ${vacancy.salary_currency}` : ''}
                            {vacancy.salary_to ? ` - ${vacancy.salary_to} ${vacancy.salary_currency}` : ''}
                        </div>
                        <div className="vacancy-description">{parse(vacancy.description.replace(/<highlighttext>/g, '<span class="highlight">').replace(/<\/highlighttext>/g, '</span>'))}</div>
                        <div className="vacancy-url"><a href={vacancy.url} target="_blank" rel="noopener noreferrer">View Vacancy</a></div>
                        <div className="vacancy-details">
                            <div>City: {vacancy.city}</div>
                            <div>Posted: {new Date(vacancy.date_posted).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No vacancies available.</p>
            )}
        </div>
    );
};

export default VacancyList;
