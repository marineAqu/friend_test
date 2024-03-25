import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';




const columns = [
    { id: 'name', label: '닉네임', minWidth: 120 },
    { id: 'score', label: '점수', minWidth: 80 },
    { id: 'button', label: '상세보기', minWidth: 80 }, // 버튼 컬럼 추가
];

function createData(name, score, no) {
    const url = "http://localhost:3000/friend_test/score-detail/" + no;
    return { name, score, url};
}

const rowsExample = [
    createData('인도', 8, 1),
    createData('China', 7, 2),
    createData('Italy', 9, 3),
    createData('서성이', 10, 4),
    createData('Canada', 6, 5),
    createData('아쿠', 8, 6),
    createData('Germany', 7, 7),
    createData('Ireland', 9, 8),
    createData('윙구링', 6, 9),
    createData('Japan', 10, 10),
    createData('France', 8, 11),
    createData('United Kingdom', 9, 12),
    createData('Russia', 7, 13),
    createData('Nigeria', 6, 14),
    createData('Brazil', 10, 15),
];


export default function StickyHeadTable({quizId}) {

    const [rows, setRows] = useState(rowsExample)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/sharepage', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quizId: quizId
                    })
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                const updatedRows = data.rows.map(row => createData(row.name, row.score, row.no));
                setRows(updatedRows)
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();
    }, [quizId]);

    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleButtonClick = (url) => {
        window.open(url, "_blank"); // 새 창으로 URL 열기
    };

    return (

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{
                                    minWidth: column.minWidth,
                                    backgroundColor: '#cfd8dc',
                                    fontFamily: 'seoul-m',
                                    fontWeight: 500,
                                    textAlign: 'center'
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{
                                                minWidth: column.minWidth,
                                                backgroundColor: '#eceff1',
                                                fontFamily: 'seoul-s',
                                                fontSize: '16px',
                                                textAlign: 'center'
                                                }}
                                            >
                                                {column.id === 'button' ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleButtonClick(row.url)}
                                                    >
                                                        바로가기
                                                    </Button>
                                                ) : (
                                                    column.format && typeof value === 'number' ? column.format(value) : value
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Paper>

        
    );
}


