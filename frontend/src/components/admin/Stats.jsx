import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const cardBg = useColorModeValue('white', 'gray.700');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats', {
                    headers: { 'x-auth-token': token },
                });
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return <Spinner />;
    }

    if (!stats) {
        return <Text>Could not load stats.</Text>
    }

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const chartData = {
        labels: Object.keys(stats.uploadsPerUser),
        datasets: [
            {
                label: 'Uploads per User',
                data: Object.values(stats.uploadsPerUser),
                backgroundColor: 'rgba(42, 105, 172, 0.6)',
                borderColor: 'rgba(42, 105, 172, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'User Upload Activity' },
        },
    };

    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
                    <StatLabel>Total Uploads</StatLabel>
                    <StatNumber>{stats.totalUploads}</StatNumber>
                    <StatHelpText>All files from all users</StatHelpText>
                </Stat>
                <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
                    <StatLabel>Total Users</StatLabel>
                    <StatNumber>{stats.totalUsers}</StatNumber>
                    <StatHelpText>Admin and regular users</StatHelpText>
                </Stat>
                <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
                    <StatLabel>Total Storage Used</StatLabel>
                    <StatNumber>{formatBytes(stats.totalSize)}</StatNumber>
                    <StatHelpText>On the FTP server</StatHelpText>
                </Stat>
            </SimpleGrid>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg} mb={8}>
                <Bar options={chartOptions} data={chartData} />
            </Box>
        </>
    );
};

export default Stats;