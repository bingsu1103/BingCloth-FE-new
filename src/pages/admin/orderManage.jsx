import { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { Input } from 'antd';
import { deleteOrderAPI, getOrderAPI } from "../../services/api.order";
import UpdateOrder from "../../components/admin/order/updateOrder"
const { Search } = Input;

const OrderManagePage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const confirm = (id) => {
        handleDelete(id);
    };
    const handleDelete = async (id) => {
        try {
            const res = await deleteOrderAPI(id);
            if (res && res.EC === 0) {
                message.success("Order deleted successfully!");
                fetchOrders();
            } else {
                message.error("Failed to delete order!");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            message.error("An error occurred while deleting the order!");
        }
    };
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await getOrderAPI();
            if (response && response.EC === 0) {
                const orders = response.data.map((item) => ({
                    key: item._id,
                    _id: item._id,
                    name: item.userInfo?.name || "Unknown",
                    total_amount: item.total_amount,
                    status: item.status,
                    address: item.shipping?.address || "N/A",
                    phone: item.shipping?.phone || "N/A",
                    contact: item.shipping?.contact || "N/A",
                    unit: item?.shipping?.unit || "N/A",
                    userInfo: item?.userInfo?._id
                }));
                setDataSource(orders);
                setOriginalData(orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    const onSearch = (value) => {
        const filtered = originalData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item._id.toLowerCase().includes(value.toLowerCase())
        );
        setDataSource(filtered);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "_id"
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Total",
            dataIndex: "total_amount",
            key: "total_amount",
            sorter: (a, b) => a.total_amount - b.total_amount,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address"
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status"
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: "unit"
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => {
                        setOpenUpdate(true);
                        setSelectedOrderId(record?.userInfo)
                    }}>
                        Update
                    </Button>
                    <Popconfirm
                        title="Delete the order"
                        description="Are you sure to delete this order?"
                        onConfirm={() => confirm(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];
    return (
        <div className="min-h-screen p-5 flex flex-col gap-4 bg-[#fff]">
            <div className="flex justify-center">
                <h1 className='font-extrabold text-2xl text-[#000]'>ORDER MANAGEMENT</h1>
            </div>
            <div className="flex justify-between items-center">
                <Input.Search
                    placeholder="Input ID or Name to search"
                    allowClear
                    enterButton="Find"
                    size="middle"
                    onSearch={onSearch}
                    onChange={(e) => {
                        if (!e.target.value) {
                            setDataSource(originalData);
                        }
                    }}
                    style={{ maxWidth: '500px' }}
                />
                <div className="flex gap-2">
                    <Button onClick={fetchOrders} type="primary">Reload</Button>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: 'max-content' }}
            />
            {openUpdate && selectedOrderId && (
                <UpdateOrder
                    openUpdate={openUpdate}
                    setOpenUpdate={setOpenUpdate}
                    id={selectedOrderId}
                />
            )}
        </div>
    );
};

export default OrderManagePage;