import React from 'react';
import { WordFilter, WordMetaData } from "../../interfaces/words";
import { Pagination } from 'react-bootstrap';

interface Props {
    data: WordMetaData;
    setFilter: (...args: any) => void;
    setQuery: (...args: any) => void;
}

const CustomPagination: React.FC<Props> = ({ data, setFilter, setQuery }) => {
    const renderPageButtons = () => {
        const buttons = [];

        buttons.push(
            <Pagination.First
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={data.current_page === 1}
            />
        );
        buttons.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(data.current_page - 1)}
                disabled={data.current_page === 1}
            />
        );

        if (data.current_page > 3) {
            buttons.push(<Pagination.Ellipsis key="prev-ellipsis" />);
        }

        for (
            let i = Math.max(1, data.current_page - 2);
            i <= Math.min(data.page_count, data.current_page + 2);
            i++
        ) {
            buttons.push(
                <Pagination.Item
                    key={i}
                    active={i === data.current_page}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (data.current_page < data.page_count - 2) {
            buttons.push(<Pagination.Ellipsis key="next-ellipsis" />);
        }
        buttons.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(data.current_page + 1)}
                disabled={data.current_page === data.page_count}
            />
        );

        buttons.push(
            <Pagination.Last
                key="last"
                onClick={() => handlePageChange(data.page_count)}
                disabled={data.current_page === data.page_count}
            />
        );


        return buttons;
    };

    const handlePageChange = (page: number) => {
        setQuery(true)
        setFilter((prevFilter: WordFilter) => ({
            ...prevFilter,
            page: page,
        }));
    };

    return <Pagination>{renderPageButtons()}</Pagination>;
};

export default CustomPagination;
