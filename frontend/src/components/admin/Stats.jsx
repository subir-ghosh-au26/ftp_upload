import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats', { headers: { 'x-auth-token': token } });
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    if (loading) return <Spinner color="white" size="xl" thickness="4px" speed="0.65s" />;
    if (!stats) return <Text color="white">Could not load stats.</Text>;

    const chartData = {
        labels: Object.keys(stats.uploadsPerUser),
        datasets: [
            {
                label: 'Uploads per User',
                data: Object.values(stats.uploadsPerUser),
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    // CRITICAL: Options to make the chart text readable (white)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: 'white' } },
            title: { display: true, text: 'User Upload Activity', color: 'white', font: { size: 16 } },
        },
        scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } },
        },
    };

    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                <div className="stat-card">
                    <p className="stat-label">Total Uploads</p>
                    <h2 className="stat-number">{stats.totalUploads}</h2>
                    <p className="stat-help-text">All files from all users</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Users</p>
                    <h2 className="stat-number">{stats.totalUsers}</h2>
                    <p className="stat-help-text">Admin and regular users</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Storage Used</p>
                    <h2 className="stat-number">{formatBytes(stats.totalSize)}</h2>
                    <p className="stat-help-text">On the FTP server</p>
                </div>
            </SimpleGrid>
            <Box className="admin-glass-card">
                <Bar options={chartOptions} data={chartData} />
            </Box>
        </>
    );
};

export default Stats;