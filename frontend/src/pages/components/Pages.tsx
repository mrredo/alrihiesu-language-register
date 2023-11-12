import React from 'react';
import {WordFilter, WordMetaData} from "../../interfaces/words";
import { Pagination } from 'react-bootstrap';

interface Props {
    data: WordMetaData;
    setFilter: (...args: any) => void
}

const CustomPagination: React.FC<Props> = ({ data, setFilter }) => {
    const renderPageButtons = () => {
        const buttons = [];

        // Add the first page button
        buttons.push(
            <Pagination.First key="first" onClick={() => handlePageChange(1)} disabled={data.current_page === 1} />
        );

        // Add the previous ellipsis
        if (data.current_page > 3) {
            buttons.push(<Pagination.Ellipsis key="prev-ellipsis" />);
        }

        // Add the pages around the current page
        for (let i = Math.max(1, data.current_page - 2); i <= Math.min(data.page_count, data.current_page + 2); i++) {
            buttons.push(
                <Pagination.Item key={i} active={i === data.current_page} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        // Add the next ellipsis
        if (data.current_page < data.page_count - 2) {
            buttons.push(<Pagination.Ellipsis key="next-ellipsis" />);
        }

        // Add the last page button, disabled if it's the last page
        buttons.push(
            <Pagination.Last key="last" onClick={() => handlePageChange(data.page_count)} disabled={data.current_page === data.page_count} />
        );

        return buttons;
    };

    const handlePageChange = (page: number) => {

        setFilter((prevFilter: WordFilter) => ({
            ...prevFilter,
            page: page
        }));
        // setFilter(filter)
    };

    return (
        <Pagination>
            {renderPageButtons()}
        </Pagination>
    );
};

export default CustomPagination;
