import { useEffect, useState } from "react";
import { deleteUserAPI, getUserAPI } from "../../services/api.user";
import { message, Button, Popconfirm, Input, Table } from "antd"
import AddUser from "../../components/admin/user/addUser";
import UpdateUser from "../../components/admin/user/updateUser";
const UserManagePage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const confirm = (id, role) => {
        handleDelete(id, role);
    };
    const handleDelete = async (id, role) => {
        try {
            if (role === 'admin') {
                message.error("Can not delete this user (ADMIN)");
                return;
            }
            const res = await deleteUserAPI(id);
            if (res && res.EC === 0) {
                message.success("User deleted successfully!");
                fetchUsers();
            }
            else {
                message.error("User delete failed!");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("An error occurred while deleting the user!");
        }
    }
    const showModal = () => {
        setOpen(true);
    };
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUserAPI();
            if (response && response.EC === 0) {
                const users = response.data.map((item) => ({
                    key: item._id,
                    _id: item._id,
                    name: item.name,
                    address: item.address,
                    phone: item.phone,
                    role: item.role
                }));
                setDataSource(users);
                setOriginalData(users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
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
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: [
                {
                    text: 'User', value: 'user',
                },
                {
                    text: 'Admin', value: 'admin'
                }
            ],
            onFilter: (value, record) => record.role.includes(value)
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => {
                        setSelectedUserId(record._id);
                        setOpenUpdate(true);
                    }}>
                        Update
                    </Button>
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={() => confirm(record._id, record.role)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];
    const onSearch = (value) => {
        const filtered = originalData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item._id.toLowerCase().includes(value.toLowerCase())
        );
        setDataSource(filtered);
    };
    return (
        <div className="min-h-screen p-5 flex flex-col gap-4 bg-[#fff]">
            <div className="flex justify-center">
                <h1 className='font-extrabold text-2xl text-[#000]'>USER MANAGEMENT</h1>
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
                    <Button type="primary" onClick={showModal}>
                        Add User
                    </Button>
                    <AddUser open={open} setOpen={setOpen} />
                    <Button onClick={fetchUsers} type="primary">Reload</Button>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: 'max-content' }}
            />
            <UpdateUser openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} id={selectedUserId} />
        </div>
    )
}
export default UserManagePage;
