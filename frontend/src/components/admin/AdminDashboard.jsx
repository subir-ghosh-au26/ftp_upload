import React from 'react';
import { Box, Flex, Heading, Text, Button, Spacer } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Stats from './Stats';
import FilesTable from './FilesTable';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
            <Flex direction="column" maxW="1200px" mx="auto">

                {/* START: New Header Section */}
                <Flex
                    as="header"
                    alignItems="center"
                    mb={8}
                    wrap="wrap"
                    borderBottomWidth="1px"
                    pb={4}
                >
                    <Box>
                        <Heading as="h1" size="xl" color="brand.800">
                            Admin Dashboard
                        </Heading>
                        <Text color="gray.600">
                            Welcome, {user ? user.name : 'Admin'}!
                        </Text>
                    </Box>
                    <Spacer />
                    <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={handleLogout}
                        mt={{ base: 4, md: 0 }} // Add margin top on small screens
                    >
                        Logout
                    </Button>
                </Flex>
                {/* END: New Header Section */}

                {/* Stats Cards and Charts */}
                <Stats />

                {/* All Files Table */}
                <FilesTable />
            </Flex>
        </Box>
    );
};

export default AdminDashboard;