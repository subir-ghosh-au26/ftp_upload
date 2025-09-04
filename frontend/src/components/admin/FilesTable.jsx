import React, { useState, useEffect } from 'react';
import {
    Box, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,
    Spinner, Text, Button, useColorModeValue, Tag, Flex, IconButton,
    Tooltip
} from '@chakra-ui/react';
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const FilesTable = () => {
    const [data, setData] = useState({ files: [], totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useAuth();
    const tableBg = useColorModeValue('white', 'gray.700');

    // --- START: PAGINATION LOGIC ---
    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                // Pass the current page as a query parameter
                const res = await axios.get(`/api/admin/files?page=${currentPage}&limit=10`, {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch files", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, [token, currentPage]); // Re-fetch when currentPage changes

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, data.totalPages));
    };
    // --- END: PAGINATION LOGIC ---

    const handleDownload = async (file) => {
        setDownloading(file.fileId);
        try {
            const res = await axios.get(`/api/admin/download/${file.fileId}`, {
                headers: { 'x-auth-token': token },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
        } finally {
            setDownloading(null);
        }
    };

    if (loading && data.files.length === 0) {
        return (
            <Flex justify="center" align="center" p={10}>
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={tableBg}>
            <TableContainer>
                <Table variant="simple">
                    <TableCaption placement="top" mb={4}>
                        <Flex justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="bold">All Uploaded Files</Text>
                            {/* --- START: PAGINATION CONTROLS --- */}
                            <Flex align="center">
                                <Tooltip label="Previous Page">
                                    <IconButton
                                        icon={<ChevronLeftIcon />}
                                        onClick={handlePrevPage}
                                        isDisabled={data.currentPage === 1}
                                        mr={2}
                                        size="sm"
                                    />
                                </Tooltip>
                                <Text fontSize="sm">
                                    Page <strong>{data.currentPage}</strong> of <strong>{data.totalPages}</strong>
                                </Text>
                                <Tooltip label="Next Page">
                                    <IconButton
                                        icon={<ChevronRightIcon />}
                                        onClick={handleNextPage}
                                        isDisabled={data.currentPage === data.totalPages}
                                        ml={2}
                                        size="sm"
                                    />
                                </Tooltip>
                            </Flex>
                            {/* --- END: PAGINATION CONTROLS --- */}
                        </Flex>
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th>File Name</Th>
                            <Th>Uploaded By</Th>
                            <Th>Upload Date</Th>
                            <Th isNumeric>Size</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading && (
                            <Tr><Td colSpan={5} textAlign="center"><Spinner /></Td></Tr>
                        )}
                        {!loading && data.files.map((file) => (
                            <Tr key={file.fileId}>
                                <Td fontWeight="medium" maxWidth="250px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={file.filename}>
                                    {file.filename}
                                </Td>
                                <Td>
                                    <Tag size="sm" colorScheme="blue">{file.userName}</Tag>
                                </Td>
                                <Td>{new Date(file.uploadDate).toLocaleString()}</Td>
                                <Td isNumeric>{(file.size / 1024 / 1024).toFixed(2)} MB</Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        leftIcon={<DownloadIcon />}
                                        // colorScheme="brand"
                                        isLoading={downloading === file.fileId}
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
            {!loading && data.files.length === 0 && (
                <Text textAlign="center" p={5}>No files have been uploaded yet.</Text>
            )}
        </Box>
    );
};

export default FilesTable;