import React from 'react';
import { Table } from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from './index.less';

class BusTable extends React.Component {
    render() {
        const { bordered,loading, selectedRows, columns,rowKey, data, onSelectRow } = this.props;

        return (
            <StandardTable
                bordered={bordered}
                loading={loading}
                selectedRows={selectedRows}
                columns={columns}
                rowKey={rowKey}
                data={data}
                onSelectRow={onSelectRow}
            />
        );
    }

}

export default BusTable;
