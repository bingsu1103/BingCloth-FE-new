import { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { deleteProductAPI, getProductAPI } from "../../services/api.product";
import AddProduct from "../../components/admin/product/addProduct";
import { Input } from 'antd';
import UpdateProduct from "../../components/admin/product/updateProduct";
const { Search } = Input;

const ProductManagePage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const confirm = (id) => {
        handleDelete(id);
    };
    const handleDelete = async (id) => {
        try {
            const res = await deleteProductAPI(id);
            if (res && res.EC === 0) {
                message.success("Product deleted successfully!");
                fetchProducts();
            } else {
                message.error("Failed to delete product!");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            message.error("An error occurred while deleting the product!");
        }
    };
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getProductAPI();
            if (response && response.EC === 0) {
                const products = response.data.map((item) => ({
                    key: item?._id,
                    name: item?.name,
                    price: item?.price,
                    stock_quantity: item?.stock_quantity,
                    category: item?.categoryInfo.name,
                    status: item?.status || "NULL",
                    description: item?.description || "No description available",
                }));
                setDataSource(products);
                setOriginalData(products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
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
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toLocaleString()} VNĐ`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Stock Quantity",
            dataIndex: "stock_quantity",
            key: "stock_quantity",
            sorter: (a, b) => a.stock_quantity - b.stock_quantity,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            filters: dataSource
                .filter((item, index, self) =>
                    index === self.findIndex(t => t.category === item.category)
                )
                .filter(item => item && item.category)
                .reduce((acc, item) => {
                    acc.push({ text: item.category, value: item.category });
                    return acc;
                }, []),
            onFilter: (value, record) => record.category.includes(value)
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: dataSource
                .filter((item, index, self) =>
                    index === self.findIndex(t => t.status === item.status)
                )
                .filter(item => item && item.status)
                .reduce((acc, item) => {
                    acc.push({ text: item.status, value: item.status });
                    return acc;
                }, []),
            onFilter: (value, record) => record.status.includes(value)
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",

        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => {
                        setSelectedProductId(record._id);
                        setOpenUpdate(true);
                    }}>
                        Update
                    </Button>
                    <Popconfirm
                        title="Delete the product"
                        description="Are you sure to delete this product?"
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
                <h1 className='font-extrabold text-2xl text-[#000]'>PRODUCT MANAGEMENT</h1>
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
                    <Button type="primary" onClick={() => setOpen(true)}>
                        Add Product
                    </Button>
                    <AddProduct open={open} setOpen={setOpen} />
                    <Button onClick={fetchProducts} type="primary">Reload</Button>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: 'max-content' }}
            />
            <UpdateProduct openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} id={selectedProductId} />
        </div>
    );
};

export default ProductManagePage;