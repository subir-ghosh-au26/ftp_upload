import React, { useState, useEffect } from 'react';
import {
    Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
    Spinner, Text, Button, Flex, Tag, useColorModeValue
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const FtpFileBrowser = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchFtpFiles = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/admin/ftp-files', { headers: { 'x-auth-token': token } });
                // Sort by modification date, newest first
                const sortedFiles = res.data.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
                setFiles(sortedFiles);
            } catch (error) {
                console.error("Failed to fetch FTP files", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFtpFiles();
    }, [token]);

    const handleDownload = async (file) => {
        setDownloading(file.id);
        try {
            // The file path is already Base64 encoded in its 'id' property
            const res = await axios.get(`/api/admin/download-ftp?path=${file.id}`, {
                headers: { 'x-auth-token': token },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("FTP Download failed", error);
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return <Flex justify="center" align="center" p={10}><Spinner color="white" size="xl" /></Flex>;
    }

    return (
        <div className="admin-glass-card">
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold">Live FTP Server Browser</Text>
                <Tag colorScheme="purple">{files.length} files found</Tag>
            </Flex>
            <TableContainer>
                <Table variant="unstyled">
                    <Thead borderBottom="1px solid rgba(255, 255, 255, 0.2)">
                        <Tr>
                            <Th color="white">File Name</Th>
                            <Th color="white">Last Modified</Th>
                            <Th isNumeric color="white">Size</Th>
                            <Th color="white">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {files.map((file) => (
                            <Tr key={file.id} _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}>
                                <Td fontWeight="medium" title={file.path} maxW="400px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{file.name}</Td>
                                <Td>{new Date(file.modifiedAt).toLocaleString()}</Td>
                                <Td isNumeric>{(file.size / 1024 / 1024).toFixed(2)} MB</Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        leftIcon={<DownloadIcon />}
                                        colorScheme="purple"
                                        variant="solid"
                                        isLoading={downloading === file.id}
                                        onClick={() => handleDownload(file)}
                                    >
                                        Download
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {files.length === 0 && <Text textAlign="center" p={5}>No files found on the FTP server.</Text>}
        </div>
    );
};

export default FtpFileBrowser;