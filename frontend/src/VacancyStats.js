// VacancyStats.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VacancyStats.css';

const VacancyStats = ({ searchParams }) => {
    const [stats, setStats] = useState({
        totalVacancies: 0,
        totalCompanies: 0,
        averageSalary: 0
    });

    useEffect(() => {
        fetchStats();
    }, [searchParams]);

    const fetchStats = () => {
        axios.get('http://localhost:8000/api/vacancies/', { params: searchParams })
            .then(response => {
                const vacancies = response.data;
                const totalVacancies = vacancies.length;

                const companySet = new Set(vacancies.map(vacancy => vacancy.company));
                const totalCompanies = companySet.size;

                const salaries = vacancies
                    .filter(vacancy => vacancy.salary_from && vacancy.salary_to)
                    .map(vacancy => (vacancy.salary_from + vacancy.salary_to) / 2);

                const averageSalary = salaries.length ? (salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;

                setStats({
                    totalVacancies,
                    totalCompanies,
                    averageSalary: Math.round(averageSalary)
                });
            })
            .catch(error => {
                console.error('There was an error fetching the stats!', error);
            });
    };

    return (
        <div className="vacancy-stats">
            <h2>Statistics</h2>
            <p>Total Vacancies: {stats.totalVacancies}</p>
            <p>Total Companies: {stats.totalCompanies}</p>
            <p>Average Salary: {stats.averageSalary ? `${stats.averageSalary} руб.` : 'N/A'}</p>
        </div>
    );
};

export default VacancyStats;
