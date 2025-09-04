import React, { useState, useEffect } from 'react';
import {
    Table, Thead, Tbody, Tr, Th, Td, TableContainer,
    Spinner, Text, Button, Flex, IconButton, Tooltip, Tag
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

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/admin/files?page=${currentPage}&limit=10`, { headers: { 'x-auth-token': token } });
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch files", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, [token, currentPage]);

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, data.totalPages));

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
        return <Flex justify="center" align="center" p={10}><Spinner color="white" size="xl" /></Flex>;
    }

    return (
        <div className="admin-glass-card">
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold">All Uploaded Files</Text>
                <Flex align="center">
                    <Tooltip label="Previous Page"><IconButton icon={<ChevronLeftIcon />} onClick={handlePrevPage} isDisabled={data.currentPage === 1} mr={2} size="sm" variant="ghost" colorScheme="whiteAlpha" /></Tooltip>
                    <Text fontSize="sm">Page <strong>{data.currentPage}</strong> of <strong>{data.totalPages}</strong></Text>
                    <Tooltip label="Next Page"><IconButton icon={<ChevronRightIcon />} onClick={handleNextPage} isDisabled={data.currentPage === data.totalPages} ml={2} size="sm" variant="ghost" colorScheme="whiteAlpha" /></Tooltip>
                </Flex>
            </Flex>
            <TableContainer>
                <Table variant="unstyled">
                    <Thead borderBottom="1px solid rgba(255, 255, 255, 0.2)">
                        <Tr>
                            <Th color="white">File Name</Th>
                            <Th color="white">Uploaded By</Th>
                            <Th color="white">Upload Date</Th>
                            <Th isNumeric color="white">Size</Th>
                            <Th color="white">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading && <Tr><Td colSpan={5} textAlign="center"><Spinner color="white" /></Td></Tr>}
                        {!loading && data.files.map((file) => (
                            <Tr key={file.fileId} _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}>
                                <Td fontWeight="medium" title={file.filename} maxW="300px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{file.filename}</Td>
                                <Td><Tag size="sm" variant="subtle" colorScheme="cyan">{file.userName}</Tag></Td>
                                <Td>{new Date(file.uploadDate).toLocaleString()}</Td>
                                <Td isNumeric>{(file.size / 1024 / 1024).toFixed(2)} MB</Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        leftIcon={<DownloadIcon />}
                                        colorScheme="cyan"
                                        variant="solid"
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
            {!loading && data.files.length === 0 && <Text textAlign="center" p={5}>No files have been uploaded yet.</Text>}
        </div>
    );
};

export default FilesTable;